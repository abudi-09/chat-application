import { useEffect, useMemo, useState } from "react";
import {
  X,
  Loader2,
  MessageCircle,
  Send,
  Heart,
  ChevronDown,
} from "lucide-react";
import { usePostStore } from "../../store/usePostStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { formatRelativeTime } from "../../utils/date.js";
import PostMediaGrid from "./PostMediaGrid.jsx";

const CommentPanel = ({ post, open, onClose }) => {
  const postId = post?._id ?? null;
  const { commentState, fetchComments, addComment, toggleCommentLike } =
    usePostStore((state) => ({
      commentState: state.commentState,
      fetchComments: state.fetchComments,
      addComment: state.addComment,
      toggleCommentLike: state.toggleCommentLike,
    }));
  const { authUser } = useAuthStore();

  const [body, setBody] = useState("");

  const entry = postId ? commentState[postId] : undefined;
  const isLoading = entry?.isLoading;
  const isPosting = entry?.isPosting;
  const hasMore = entry?.hasMore;
  const comments = entry?.data ?? [];
  const safePost = post ?? {};
  const sourcePost = safePost.repostOf ?? safePost;

  useEffect(() => {
    if (!open || !postId) return;
    fetchComments(postId, { reset: true });
  }, [open, postId, fetchComments]);

  useEffect(() => {
    if (!open) {
      setBody("");
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event?.preventDefault?.();
    if (!postId || !body.trim() || isPosting) return;

    const created = await addComment(postId, { body: body.trim() });
    if (created) {
      setBody("");
    }
  };

  const handleLoadMore = () => {
    if (!postId || isLoading || !hasMore) return;
    fetchComments(postId);
  };

  const panelClasses = useMemo(
    () =>
      `fixed inset-y-0 right-0 z-50 w-full max-w-lg transform bg-base-100 shadow-2xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`,
    [open]
  );

  const overlayClasses = useMemo(
    () =>
      `fixed inset-0 z-40 bg-base-900/50 backdrop-blur-sm transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`,
    [open]
  );

  if (!postId) return null;

  return (
    <>
      <div
        className={overlayClasses}
        role="presentation"
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={panelClasses} aria-hidden={!open} aria-label="Comments">
        <header className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-base-content/80">
              Conversation
            </p>
            <p className="text-xs text-base-content/60">
              {comments.length} comment{comments.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onClose}
            aria-label="Close comments"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <section className="border-b border-base-300 px-5 py-4 text-sm">
          <div className="flex items-start gap-3">
            <img
              src={safePost.author?.profilePic || "/avatar.png"}
              alt={safePost.author?.fullname || "Author"}
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium leading-tight">
                {safePost.author?.fullname || "Unknown User"}
              </p>
              <p className="text-xs text-base-content/60">
                @{safePost.author?.username || "anonymous"} •{" "}
                {formatRelativeTime(safePost.createdAt)}
              </p>
              {safePost.body && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-base-content/80">
                  {safePost.body}
                </p>
              )}
              {safePost.media?.length ? (
                <div className="mt-3">
                  <PostMediaGrid media={safePost.media} />
                </div>
              ) : null}
              {safePost.repostOf && (
                <div className="mt-3 rounded-xl border border-base-300 bg-base-200/40 p-3">
                  <div className="flex items-start gap-2">
                    <img
                      src={sourcePost.author?.profilePic || "/avatar.png"}
                      alt={sourcePost.author?.fullname || "Original author"}
                      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {sourcePost.author?.fullname || "Unknown User"}
                      </p>
                      <p className="text-xs text-base-content/60">
                        @{sourcePost.author?.username || "anonymous"} •{" "}
                        {formatRelativeTime(sourcePost.createdAt)}
                      </p>
                    </div>
                  </div>
                  {sourcePost.body && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-base-content/80">
                      {sourcePost.body}
                    </p>
                  )}
                  {sourcePost.media?.length ? (
                    <div className="mt-3">
                      <PostMediaGrid media={sourcePost.media} />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="flex h-[calc(100%-220px)] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {comments.map((comment) => (
              <article
                key={comment._id}
                className="rounded-xl border border-base-300 bg-base-100/80 p-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={comment.author?.profilePic || "/avatar.png"}
                    alt={comment.author?.fullname || "Comment author"}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {comment.author?.fullname || "Unknown User"}
                      </p>
                      <span className="text-xs text-base-content/60">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    {comment.body && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-base-content/80">
                        {comment.body}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        className={`btn btn-xs gap-1 ${
                          comment.liked ? "btn-secondary" : "btn-ghost"
                        }`}
                        onClick={() => toggleCommentLike(postId, comment._id)}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            comment.liked ? "fill-current" : ""
                          }`}
                        />
                        <span>{comment.likeCount ?? 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {!comments.length && !isLoading && (
              <div className="rounded-xl border border-dashed border-base-300 bg-base-200/30 p-6 text-center text-sm text-base-content/60">
                <MessageCircle className="mx-auto mb-2 h-5 w-5" />
                Be the first to start the conversation
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            {hasMore && !isLoading && (
              <button
                type="button"
                onClick={handleLoadMore}
                className="btn btn-sm btn-ghost mx-auto"
              >
                Load more
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-base-300 px-5 py-4"
          >
            <div className="flex items-start gap-3">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt={authUser?.fullname || "Your avatar"}
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Add your reply"
                  className="textarea textarea-bordered h-24 w-full resize-none"
                  maxLength={600}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
                  <span>{600 - body.length} characters left</span>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary gap-2"
                    disabled={!body.trim() || isPosting}
                  >
                    {isPosting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <footer className="flex items-center justify-between border-t border-base-300 px-5 py-3 text-xs text-base-content/60">
          <span>{safePost.metrics?.views ?? 0} views</span>
          <span className="flex items-center gap-1">
            {comments.length} replies
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </footer>
      </aside>
    </>
  );
};

export default CommentPanel;
