import { useEffect, useMemo, useState } from "react";
import { Loader2, SlidersHorizontal, RefreshCcw, Filter } from "lucide-react";
import PostComposer from "../components/posts/PostComposer.jsx";
import PostCard from "../components/posts/PostCard.jsx";
import PostSkeleton from "../components/posts/PostSkeleton.jsx";
import CommentPanel from "../components/posts/CommentPanel.jsx";
import { usePostStore } from "../store/usePostStore.js";
import { shallow } from "zustand/shallow";

const scopes = [
  { value: "all", label: "All Posts" },
  { value: "mine", label: "My Posts" },
  { value: "connections", label: "Connections" },
  { value: "reposts", label: "Reposts" },
];

const sorts = [
  { value: "recent", label: "Most Recent" },
  { value: "liked", label: "Most Liked" },
  { value: "trending", label: "Trending" },
];

const PostFeedPage = () => {
  const { feed, hasMore, isFetching, scope, sort } = usePostStore(
    (state) => ({
      feed: state.feed,
      hasMore: state.hasMore,
      isFetching: state.isFetching,
      scope: state.scope,
      sort: state.sort,
    }),
    shallow
  );

  const fetchPosts = usePostStore((state) => state.fetchPosts);
  const setScope = usePostStore((state) => state.setScope);
  const setSort = usePostStore((state) => state.setSort);

  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts({ reset: true, scope, sort });
  }, [fetchPosts, scope, sort]);

  const handleScopeChange = (event) => {
    const nextScope = event.target.value;
    setScope(nextScope);
  };

  const handleSortChange = (event) => {
    const nextSort = event.target.value;
    setSort(nextSort);
  };

  const handleRefresh = () => {
    fetchPosts({ reset: true, scope, sort });
  };

  const handleLoadMore = () => {
    if (!hasMore || isFetching) return;
    fetchPosts({ scope, sort });
  };

  const isEmpty = useMemo(
    () => !feed.length && !isFetching,
    [feed.length, isFetching]
  );

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto max-w-4xl px-4 pb-16 pt-24">
        <div className="mb-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-base-content/90">
              Post Stream
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60">
              <button
                type="button"
                className="btn btn-sm btn-ghost gap-2"
                onClick={handleRefresh}
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                Refresh
              </button>
            </div>
          </div>
          <PostComposer />
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-base-300 bg-base-100/60 p-4 shadow-sm md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-base-content/60" />
            <span className="text-base-content/70">Filter</span>
            <select
              value={scope}
              onChange={handleScopeChange}
              className="select select-sm select-bordered"
            >
              {scopes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 text-base-content/60" />
            <span className="text-base-content/70">Sort</span>
            <select
              value={sort}
              onChange={handleSortChange}
              className="select select-sm select-bordered"
            >
              {sorts.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section className="space-y-4">
          {isFetching && feed.length === 0 && (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {feed.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onOpenComments={setSelectedPost}
            />
          ))}

          {isEmpty && (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-100/60 p-10 text-center text-sm text-base-content/60">
              You haven&apos;t seen any posts yet. Follow channels or create
              your first post.
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center py-4">
              <button
                type="button"
                onClick={handleLoadMore}
                className="btn btn-outline"
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          )}
        </section>
      </div>

      <CommentPanel
        post={selectedPost}
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default PostFeedPage;
