import { useRef, useState } from "react";
import { ImagePlus, Loader2, LockKeyhole, Share2, Users2 } from "lucide-react";
import { usePostStore } from "../../store/usePostStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    description: "Visible to everyone",
    icon: Share2,
  },
  {
    value: "connections",
    label: "Connections",
    description: "Visible to your accepted chats",
    icon: Users2,
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can view",
    icon: LockKeyhole,
  },
];

const MAX_MEDIA = 4;

const PostComposer = () => {
  const fileInputRef = useRef(null);
  const { authUser } = useAuthStore();
  const { createPost, uploadMedia, isCreating, isUploadingMedia } =
    usePostStore((state) => ({
      createPost: state.createPost,
      uploadMedia: state.uploadMedia,
      isCreating: state.isCreating,
      isUploadingMedia: state.isUploadingMedia,
    }));

  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [media, setMedia] = useState([]);
  const [isLocallyUploading, setIsLocallyUploading] = useState(false);

  const remainingSlots = MAX_MEDIA - media.length;

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const available = Math.max(0, remainingSlots);
    if (available === 0) {
      event.target.value = "";
      return;
    }

    const filesToUpload = files.slice(0, available);
    setIsLocallyUploading(true);

    for (const file of filesToUpload) {
      const uploaded = await uploadMedia(file);
      if (uploaded) {
        setMedia((prev) => [...prev, uploaded]);
      }
    }

    setIsLocallyUploading(false);
    event.target.value = "";
  };

  const removeAttachment = (index) => {
    setMedia((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (isCreating || isUploadingMedia || isLocallyUploading) return;

    if (body.trim().length === 0 && media.length === 0) {
      return;
    }

    const post = await createPost({
      body,
      visibility,
      media,
    });

    if (post) {
      setBody("");
      setMedia([]);
      setVisibility("public");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const isBusy = isCreating || isUploadingMedia || isLocallyUploading;
  const isDisabled = isBusy || (body.trim().length === 0 && media.length === 0);

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100/70 shadow-sm backdrop-blur">
      <div className="flex gap-3 p-5">
        <img
          src={authUser?.profilePic || "/avatar.png"}
          alt={authUser?.fullname || "User avatar"}
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
        />
        <div className="flex w-full flex-col gap-3">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share something with your network..."
            className="textarea textarea-bordered min-h-[120px] resize-y bg-base-100"
            maxLength={1000}
          />

          {media.length > 0 && (
            <div
              className={`grid gap-3 ${
                media.length === 1
                  ? "grid-cols-1"
                  : media.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2"
              }`}
            >
              {media.map((item, index) => (
                <div
                  key={`${item.url}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-base-300"
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
                      alt={`Attachment ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="btn btn-xs btn-circle absolute right-2 top-2 bg-base-100/80"
                    aria-label="Remove attachment"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <button
                type="button"
                className="btn btn-sm gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={remainingSlots === 0 || isLocallyUploading}
              >
                {isLocallyUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" /> Attach
                  </>
                )}
              </button>
              <span className="text-xs text-base-content/60">
                {remainingSlots} attachment{remainingSlots === 1 ? "" : "s"}{" "}
                left
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-base-content/60">Visibility</span>
                <select
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value)}
                  className="select select-sm select-bordered"
                >
                  {VISIBILITY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isDisabled}
                className="btn btn-primary btn-sm gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Share"
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-1 text-xs text-base-content/60">
            {VISIBILITY_OPTIONS.map(({ value, description, icon: Icon }) => (
              <div key={value} className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostComposer;
