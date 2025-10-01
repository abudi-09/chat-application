import {
  Globe2,
  Heart,
  Loader2,
  MessageCircle,
  Repeat2,
  Users2,
  LockKeyhole,
  Eye,
} from "lucide-react";
import { useMemo, useState } from "react";
import { usePostStore } from "../../store/usePostStore.js";
import PostMediaGrid from "./PostMediaGrid.jsx";
import { formatRelativeTime } from "../../utils/date.js";

const VISIBILITY_ICONS = {
  public: Globe2,
  connections: Users2,
  followers: Users2,
  private: LockKeyhole,
  channel: Users2,
};

const PostCard = ({ post, onOpenComments }) => {
  const { toggleLike, repost, likingPostIds, repostingPostIds } = usePostStore(
    (state) => ({
      toggleLike: state.toggleLike,
      repost: state.repost,
      likingPostIds: state.likingPostIds,
      repostingPostIds: state.repostingPostIds,
    })
  );
  const [isConfirmingRepost, setIsConfirmingRepost] = useState(false);

  const isLiking = likingPostIds.has(post._id);
  const isReposting = repostingPostIds.has(post._id);
  const originalPost = post.repostOf ?? null;

  const visibilityLabel = useMemo(() => {
    switch (post.visibility) {
      case "public":
        return "Public";
      case "connections":
        return "Connections";
      case "followers":
        return "Followers";
      case "private":
        return "Private";
      case "channel":
        return post.channel?.name
          ? `Channel · ${post.channel.name}`
          : "Channel";
      default:
        return "";
    }
  }, [post.visibility, post.channel?.name]);

  const VisibilityIcon = VISIBILITY_ICONS[post.visibility] || Globe2;

  const handleCommentClick = () => {
    onOpenComments?.(post);
  };

  const handleRepost = async () => {
    if (isReposting) return;

    if (!isConfirmingRepost) {
      setIsConfirmingRepost(true);
      setTimeout(() => setIsConfirmingRepost(false), 3000);
      return;
    }

    await repost(post._id);
    setIsConfirmingRepost(false);
  };

  return (
    <article className="rounded-2xl border border-base-300 bg-base-100/80 p-5 shadow-sm">
      <header className="flex items-start gap-3">
        <img
          src={post.author?.profilePic || "/avatar.png"}
          alt={post.author?.fullname || "User"}
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div>
              <p className="font-semibold leading-tight">
                {post.author?.fullname || "Unknown User"}
              </p>
              <p className="text-xs text-base-content/60">
                @{post.author?.username || "anonymous"}
              </p>
            </div>
            <span className="text-xs text-base-content/50">
              {formatRelativeTime(post.createdAt)}
            </span>
            <span className="flex items-center gap-1 text-xs text-base-content/50">
              <VisibilityIcon className="h-3.5 w-3.5" />
              {visibilityLabel}
            </span>
          </div>
          {originalPost && (
            <p className="mt-1 text-xs text-primary/80">
              Reposted from{" "}
              <span className="font-medium text-primary">
                {originalPost.author?.fullname ||
                  originalPost.author?.username ||
                  "original author"}
              </span>
            </p>
          )}
        </div>
      </header>

      {post.repostOf ? (
        <>
          {post.body && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">
              {post.body}
            </p>
          )}
          <div className="mt-4 rounded-2xl border border-base-300 bg-base-200/40 p-4">
            <div className="flex items-start gap-3">
              <img
                src={originalPost.author?.profilePic || "/avatar.png"}
                alt={originalPost.author?.fullname || "Original author"}
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-medium leading-tight">
                  {originalPost.author?.fullname || "Unknown User"}
                </p>
                <p className="text-xs text-base-content/60">
                  @{originalPost.author?.username || "anonymous"} •{" "}
                  {formatRelativeTime(originalPost.createdAt)}
                </p>
              </div>
            </div>
            {originalPost.body && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">
                {originalPost.body}
              </p>
            )}
            {originalPost.media?.length ? (
              <div className="mt-4">
                <PostMediaGrid media={originalPost.media} />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          {post.body && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">
              {post.body}
            </p>
          )}
          {post.media?.length ? (
            <div className="mt-4">
              <PostMediaGrid media={post.media} />
            </div>
          ) : null}
        </>
      )}

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={`btn btn-sm gap-2 ${
              post.liked ? "btn-secondary" : "btn-ghost"
            }`}
            onClick={() => toggleLike(post._id)}
            disabled={isLiking}
          >
            {isLiking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`}
              />
            )}
            <span>{post.likeCount ?? 0}</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost gap-2"
            onClick={handleCommentClick}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount ?? 0}</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm gap-2 ${
              isConfirmingRepost ? "btn-warning" : "btn-ghost"
            }`}
            onClick={handleRepost}
            disabled={isReposting}
          >
            {isReposting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Repeat2 className="h-4 w-4" />
            )}
            <span>{post.repostCount ?? 0}</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-base-content/60">
          <Eye className="h-3.5 w-3.5" />
          <span>{post.metrics?.views ?? 0} views</span>
        </div>
      </footer>
    </article>
  );
};

export default PostCard;
