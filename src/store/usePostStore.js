import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const SUPPORTED_VISIBILITY = [
  "public",
  "connections",
  "followers",
  "private",
  "channel",
];

const ensureCommentState = (state, postId) => {
  if (state.commentState[postId]) {
    return state.commentState[postId];
  }

  const initial = {
    data: [],
    cursor: null,
    hasMore: true,
    isLoading: false,
    isPosting: false,
  };

  state.commentState[postId] = initial;
  return initial;
};

export const usePostStore = create((set, get) => ({
  feed: [],
  cursor: null,
  hasMore: true,
  scope: "all",
  sort: "recent",
  isFetching: false,
  isCreating: false,
  isUploadingMedia: false,
  repostingPostIds: new Set(),
  likingPostIds: new Set(),
  commentState: {},

  setScope: (scope) => set({ scope }),
  setSort: (sort) => set({ sort }),

  fetchPosts: async ({ reset = false, scope, sort } = {}) => {
    const { isFetching } = get();
    if (isFetching) return;

    const nextScope = scope || get().scope;
    const nextSort = sort || get().sort;

    if (scope && !sort) {
      set({ scope: nextScope });
    }
    if (sort && !scope) {
      set({ sort: nextSort });
    }

    const cursor = reset ? null : get().cursor;

    set(() => ({
      isFetching: true,
      scope: nextScope,
      sort: nextSort,
      ...(reset ? { feed: [], cursor: null, hasMore: true } : {}),
    }));

    try {
      const res = await axiosInstance.get("/posts", {
        params: {
          scope: nextScope,
          sort: nextSort,
          cursor,
        },
      });

      const payload = res.data;
      const posts = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      const nextCursor = Array.isArray(payload)
        ? null
        : payload?.nextCursor ?? null;

      set((state) => ({
        feed: reset ? posts : [...state.feed, ...posts],
        cursor: nextCursor,
        hasMore: Boolean(nextCursor),
      }));
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error(error?.response?.data?.message || "Failed to load posts");
    } finally {
      set({ isFetching: false });
    }
  },

  createPost: async (payload) => {
    const { isCreating } = get();
    if (isCreating) return null;

    const body = payload.body?.trim();
    if (!body && (!payload.media || payload.media.length === 0)) {
      toast.error("Post cannot be empty");
      return null;
    }

    const visibility = SUPPORTED_VISIBILITY.includes(payload.visibility)
      ? payload.visibility
      : "public";

    const requestPayload = {
      ...payload,
      body,
      visibility,
    };

    set({ isCreating: true });

    try {
      const res = await axiosInstance.post("/posts", requestPayload);
      const post = res.data;
      set((state) => ({ feed: [post, ...state.feed] }));
      toast.success("Post published");
      return post;
    } catch (error) {
      console.error("Failed to create post", error);
      toast.error(error?.response?.data?.message || "Failed to publish post");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  uploadMedia: async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("media", file);

    set({ isUploadingMedia: true });
    try {
      const res = await axiosInstance.post("/posts/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to upload media", error);
      toast.error(error?.response?.data?.message || "Failed to upload media");
      return null;
    } finally {
      set({ isUploadingMedia: false });
    }
  },

  toggleLike: async (postId) => {
    const state = get();
    if (state.likingPostIds.has(postId)) return;

    set((current) => {
      const likingPostIds = new Set(current.likingPostIds);
      likingPostIds.add(postId);
      return { likingPostIds };
    });

    set((current) => ({
      feed: current.feed.map((post) => {
        if (post._id !== postId) return post;
        const liked = !post.liked;
        const likeCount = Math.max(0, (post.likeCount || 0) + (liked ? 1 : -1));
        return { ...post, liked, likeCount };
      }),
    }));

    try {
      const res = await axiosInstance.post(`/posts/${postId}/like`);
      set((current) => ({
        feed: current.feed.map((post) =>
          post._id === postId
            ? { ...post, liked: res.data.liked, likeCount: res.data.likeCount }
            : post
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle like", error);
      toast.error(error?.response?.data?.message || "Failed to update like");
      set((current) => ({
        feed: current.feed.map((post) => {
          if (post._id !== postId) return post;
          const liked = !post.liked;
          const likeCount = Math.max(
            0,
            (post.likeCount || 0) + (liked ? 1 : -1)
          );
          return { ...post, liked, likeCount };
        }),
      }));
    } finally {
      set((current) => {
        const likingPostIds = new Set(current.likingPostIds);
        likingPostIds.delete(postId);
        return { likingPostIds };
      });
    }
  },

  repost: async (postId, payload = {}) => {
    set((current) => {
      const reposting = new Set(current.repostingPostIds);
      reposting.add(postId);
      return { repostingPostIds: reposting };
    });

    try {
      const res = await axiosInstance.post(`/posts/${postId}/repost`, payload);
      const newPost = res.data;
      set((state) => ({
        feed: [newPost, ...state.feed],
        feedUpdatedAt: Date.now(),
      }));
      toast.success("Post shared");
      return newPost;
    } catch (error) {
      console.error("Failed to repost", error);
      toast.error(error?.response?.data?.message || "Failed to repost");
      return null;
    } finally {
      set((current) => {
        const reposting = new Set(current.repostingPostIds);
        reposting.delete(postId);
        return { repostingPostIds: reposting };
      });
    }
  },

  fetchComments: async (postId, { reset = false } = {}) => {
    set((state) => {
      const commentState = { ...state.commentState };
      const entry = ensureCommentState(commentState, postId);

      return {
        commentState: {
          ...commentState,
          [postId]: {
            ...entry,
            data: reset ? [] : entry.data,
            cursor: reset ? null : entry.cursor,
            hasMore: reset ? true : entry.hasMore,
            isLoading: true,
          },
        },
      };
    });

    const current = get().commentState[postId];
    const cursor = reset ? null : current.cursor;

    try {
      const res = await axiosInstance.get(`/posts/${postId}/comments`, {
        params: { cursor },
      });
      const { data = [], nextCursor } = res.data || {};

      set((state) => {
        const entry = ensureCommentState({ ...state.commentState }, postId);
        const updatedData = reset ? data : [...entry.data, ...data];

        return {
          commentState: {
            ...state.commentState,
            [postId]: {
              ...entry,
              data: updatedData,
              cursor: nextCursor,
              hasMore: Boolean(nextCursor),
              isLoading: false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to load comments", error);
      toast.error(error?.response?.data?.message || "Failed to load comments");
      set((state) => ({
        commentState: {
          ...state.commentState,
          [postId]: {
            ...(state.commentState[postId] || {}),
            isLoading: false,
          },
        },
      }));
    }
  },

  addComment: async (postId, payload) => {
    set((state) => {
      const commentState = { ...state.commentState };
      const entry = ensureCommentState(commentState, postId);
      return {
        commentState: {
          ...commentState,
          [postId]: { ...entry, isPosting: true },
        },
      };
    });

    try {
      const res = await axiosInstance.post(
        `/posts/${postId}/comments`,
        payload
      );
      const comment = res.data;
      set((state) => {
        const entry = ensureCommentState({ ...state.commentState }, postId);
        return {
          commentState: {
            ...state.commentState,
            [postId]: {
              ...entry,
              data: [comment, ...entry.data],
              isPosting: false,
            },
          },
          feed: state.feed.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  commentCount: (post.commentCount || 0) + 1,
                  metrics: {
                    ...(post.metrics || {}),
                    comments: (post.metrics?.comments || 0) + 1,
                  },
                }
              : post
          ),
        };
      });
      toast.success("Comment added");
      return comment;
    } catch (error) {
      console.error("Failed to add comment", error);
      toast.error(error?.response?.data?.message || "Failed to add comment");
      set((state) => ({
        commentState: {
          ...state.commentState,
          [postId]: {
            ...(state.commentState[postId] || {}),
            isPosting: false,
          },
        },
      }));
      return null;
    }
  },

  toggleCommentLike: async (postId, commentId) => {
    const entry = get().commentState[postId];
    if (!entry) return;

    set((state) => ({
      commentState: {
        ...state.commentState,
        [postId]: {
          ...entry,
          data: entry.data.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  liked: !comment.liked,
                  likeCount: Math.max(
                    0,
                    (comment.likeCount || 0) + (comment.liked ? -1 : 1)
                  ),
                }
              : comment
          ),
        },
      },
    }));

    try {
      const res = await axiosInstance.post(`/posts/comments/${commentId}/like`);
      set((state) => {
        const updatedEntry = state.commentState[postId];
        if (!updatedEntry) return state;

        return {
          commentState: {
            ...state.commentState,
            [postId]: {
              ...updatedEntry,
              data: updatedEntry.data.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      liked: res.data.liked,
                      likeCount: res.data.likeCount,
                    }
                  : comment
              ),
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to toggle comment like", error);
      toast.error(error?.response?.data?.message || "Failed to update like");
      set((state) => {
        const entryState = state.commentState[postId];
        if (!entryState) return state;
        return {
          commentState: {
            ...state.commentState,
            [postId]: {
              ...entryState,
              data: entryState.data.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      liked: !comment.liked,
                      likeCount: Math.max(
                        0,
                        (comment.likeCount || 0) + (comment.liked ? -1 : 1)
                      ),
                    }
                  : comment
              ),
            },
          },
        };
      });
    }
  },
}));
