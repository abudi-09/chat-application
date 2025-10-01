const PostMediaGrid = ({ media = [] }) => {
  if (!media.length) return null;

  const layoutClass =
    media.length === 1
      ? "grid-cols-1"
      : media.length === 2
      ? "grid-cols-2"
      : media.length === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2";

  return (
    <div className={`grid gap-3 ${layoutClass}`}>
      {media.map((item, index) => (
        <div
          key={`${item.url}-${index}`}
          className="relative overflow-hidden rounded-xl border border-base-200 bg-base-200"
        >
          {item.type === "video" ? (
            <video
              controls
              src={item.url}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={item.url}
              alt={`Post media ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PostMediaGrid;
