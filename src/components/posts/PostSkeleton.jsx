const PostSkeleton = () => (
  <div className="animate-pulse space-y-4 rounded-2xl border border-base-300 bg-base-100/70 p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-base-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/5 rounded bg-base-200" />
        <div className="h-3 w-1/3 rounded bg-base-200" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-base-200" />
      <div className="h-3 w-5/6 rounded bg-base-200" />
      <div className="h-3 w-2/3 rounded bg-base-200" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="aspect-video rounded-xl bg-base-200" />
      <div className="aspect-video rounded-xl bg-base-200" />
    </div>
  </div>
);

export default PostSkeleton;
