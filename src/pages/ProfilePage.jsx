import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import {
  Activity,
  Camera,
  ChevronRight,
  Edit3,
  Loader2,
  Lock,
  PlusCircle,
  ShieldHalf,
  Sparkles,
} from "lucide-react";

const DEFAULT_NOTIFICATIONS = {
  mentions: true,
  directMessages: true,
  channelHighlights: true,
};

const buildLinkSlots = (links = []) => {
  const normalized = Array.isArray(links) ? links : [];
  return Array.from({ length: 3 }, (_, idx) => ({
    label: normalized[idx]?.label || "",
    url: normalized[idx]?.url || "",
    isPrimary: normalized[idx]?.isPrimary ?? idx === 0,
  }));
};

const tabs = [
  { id: "profile", label: "Profile info" },
  { id: "preferences", label: "Preferences" },
  { id: "security", label: "Security" },
];

const ProfilePage = () => {
  const fileInputRef = useRef(null);
  const { authUser } = useAuthStore();
  const {
    profile,
    metrics,
    recentStories,
    recentPosts,
    isLoading,
    isSavingProfile,
    isSavingPreferences,
    isChangingPassword,
    isUploadingAvatar,
    fetchProfile,
    saveProfile,
    savePreferences,
    changePassword,
    uploadAvatar,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    fullname: "",
    username: "",
    bio: "",
    statusMessage: "",
    pronouns: "",
    timezone: "UTC",
    role: "Member",
  });
  const [socialLinks, setSocialLinks] = useState(buildLinkSlots());
  const [preferencesForm, setPreferencesForm] = useState({
    theme: "system",
    accentColor: "#2563EB",
    language: "en",
    density: "comfortable",
    notifications: { ...DEFAULT_NOTIFICATIONS },
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const source = profile || authUser;
    if (!source) return;

    setProfileForm({
      fullname: source.fullname || "",
      username: source.username || "",
      bio: source.bio || "",
      statusMessage: source.statusMessage || "",
      pronouns: source.pronouns || "",
      timezone: source.timezone || "UTC",
      role: source.role || "Member",
    });

    setSocialLinks(buildLinkSlots(source.socialLinks));

    const preferences = source.preferences || {};
    setPreferencesForm({
      theme: preferences.theme || "system",
      accentColor: preferences.accentColor || "#2563EB",
      language: preferences.language || "en",
      density: preferences.density || "comfortable",
      notifications: {
        mentions:
          preferences.notifications?.mentions ?? DEFAULT_NOTIFICATIONS.mentions,
        directMessages:
          preferences.notifications?.directMessages ??
          DEFAULT_NOTIFICATIONS.directMessages,
        channelHighlights:
          preferences.notifications?.channelHighlights ??
          DEFAULT_NOTIFICATIONS.channelHighlights,
      },
    });
  }, [profile, authUser]);

  const currentProfile = profile || authUser || {};
  const displayName = currentProfile.fullname || "Guest";
  const username = currentProfile.username || "username";
  const email = currentProfile.email || "user@example.com";
  const profilePic = currentProfile.profilePic || "/avatar.png";
  const joinedAt = currentProfile.createdAt
    ? new Date(currentProfile.createdAt).toLocaleDateString()
    : "2025";
  const bio =
    currentProfile.bio || "Add a short bio so people know what you’re up to.";
  const statusMessage = currentProfile.statusMessage || "Share a quick update";
  const lastActive = currentProfile.lastActiveAt
    ? new Date(currentProfile.lastActiveAt).toLocaleString()
    : "just now";

  const metricCards = useMemo(
    () => [
      {
        label: "Messages sent",
        value: metrics?.messagesSent,
        helper: "All-time total",
      },
      {
        label: "Groups joined",
        value: metrics?.groupsJoined,
        helper: "Current memberships",
      },
      {
        label: "Channels followed",
        value: metrics?.channelsFollowed,
        helper: "Subscribed channels",
      },
      {
        label: "Story views",
        value: metrics?.storyViews,
        helper: "Across last stories",
      },
      {
        label: "Posts published",
        value: metrics?.postsPublished,
        helper: "All-time posts",
      },
    ],
    [metrics]
  );

  const formatMetricValue = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value.toLocaleString();
    }
    if (typeof value === "string" && value.trim()) {
      const numeric = Number(value);
      return Number.isNaN(numeric) ? value : numeric.toLocaleString();
    }
    return "0";
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (index, field, value) => {
    setSocialLinks((prev) => {
      const next = prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      return next;
    });
  };

  const markPrimaryLink = (index) => {
    setSocialLinks((prev) =>
      prev.map((link, idx) => ({ ...link, isPrimary: idx === index }))
    );
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!profileForm.fullname.trim()) {
      toast.error("Full name is required");
      return;
    }

    const cleanedLinks = socialLinks
      .map((link) => ({
        label: link.label.trim(),
        url: link.url.trim(),
        isPrimary: link.isPrimary,
      }))
      .filter((link) => link.label || link.url);

    if (
      cleanedLinks.length > 0 &&
      !cleanedLinks.some((link) => link.isPrimary)
    ) {
      cleanedLinks[0].isPrimary = true;
    }

    const success = await saveProfile({
      ...profileForm,
      socialLinks: cleanedLinks,
    });

    if (success) {
      setSocialLinks(buildLinkSlots(cleanedLinks));
    }
  };

  const handlePreferencesChange = (field, value) => {
    setPreferencesForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleNotification = (field) => {
    setPreferencesForm((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }));
  };

  const handlePreferencesSubmit = async (event) => {
    event.preventDefault();
    await savePreferences({
      theme: preferencesForm.theme,
      accentColor: preferencesForm.accentColor,
      language: preferencesForm.language,
      density: preferencesForm.density,
      notifications: preferencesForm.notifications,
    });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Enter both current and new password");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const success = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (success) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      event.target.value = "";
      return;
    }

    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 5) {
      toast.error("Please choose an image under 5 MB");
      event.target.value = "";
      return;
    }

    const success = await uploadAvatar(file);
    if (success) {
      event.target.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-base-200 pt-20">
      <section className="border-b border-base-300 bg-base-100">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative mx-auto h-28 w-28 sm:mx-0 sm:h-32 sm:w-32">
              <img
                src={profilePic}
                alt={`${displayName} avatar`}
                className="h-full w-full rounded-3xl border border-base-300 object-cover shadow-lg"
              />
              <button
                type="button"
                onClick={handleAvatarButtonClick}
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg"
                aria-label="Update profile photo"
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {currentProfile.role || "Team member"}
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-base-content">
                {displayName}
              </h1>
              <p className="text-base-content/70">@{username}</p>
              <p className="mt-3 max-w-xl text-base-content/70">{bio}</p>
              <p className="mt-2 text-sm text-base-content/60">
                {statusMessage}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                <span className="badge badge-outline badge-sm">
                  Joined {joinedAt}
                </span>
                <span className="badge badge-outline badge-sm">{email}</span>
                <span className="badge badge-outline badge-sm">
                  Last active • {lastActive}
                </span>
                <span className="badge badge-outline badge-sm">
                  Timezone • {currentProfile.timezone || "UTC"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 sm:justify-end">
            <button
              className="btn btn-ghost gap-2"
              type="button"
              onClick={() => setActiveTab("security")}
            >
              <ShieldHalf className="h-4 w-4" />
              Privacy controls
            </button>
            <button
              className="btn btn-primary gap-2"
              type="button"
              onClick={() => setActiveTab("profile")}
            >
              <Edit3 className="h-4 w-4" />
              Edit profile
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6 self-start lg:sticky lg:top-24">
          <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow">
            <h2 className="text-lg font-semibold text-base-content">
              Quick actions
            </h2>
            <div className="mt-4 space-y-3 text-sm text-base-content/70">
              <button
                className="btn btn-sm btn-outline w-full justify-between"
                type="button"
              >
                Update status
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                className="btn btn-sm btn-outline w-full justify-between"
                type="button"
              >
                Manage connections
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                className="btn btn-sm btn-outline w-full justify-between"
                type="button"
              >
                Share profile
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow">
            <h2 className="text-lg font-semibold text-base-content">
              Theme & appearance
            </h2>
            <p className="mt-2 text-sm text-base-content/70">
              Customize theme, accent color, and layout density in Preferences.
            </p>
            <div className="mt-4 grid gap-2 text-sm text-base-content/70">
              <p>
                Theme:{" "}
                <span className="font-medium">{preferencesForm.theme}</span>
              </p>
              <p>
                Accent:{" "}
                <span className="font-medium">
                  {preferencesForm.accentColor}
                </span>
              </p>
              <p>
                Density:{" "}
                <span className="font-medium">{preferencesForm.density}</span>
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow">
            <h2 className="text-lg font-semibold text-base-content">
              Security
            </h2>
            <p className="mt-2 text-sm text-base-content/70">
              Manage password, two-factor authentication, and backup codes.
            </p>
            <button
              className="btn btn-sm btn-ghost gap-2 text-error"
              type="button"
              onClick={() => setActiveTab("security")}
            >
              <Lock className="h-4 w-4" />
              View security center
            </button>
          </section>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metricCards.map((metric) => (
              <article
                key={metric.label}
                className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow"
              >
                <p className="text-sm font-medium text-base-content/60">
                  {metric.label}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold text-base-content">
                    {formatMetricValue(metric.value)}
                  </span>
                  <span className="text-xs font-semibold text-primary/70">
                    {metric.helper}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-base-content">
                Stories
              </h2>
              <button className="btn btn-sm btn-primary gap-2" type="button">
                <PlusCircle className="h-4 w-4" />
                New story
              </button>
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {recentStories && recentStories.length > 0 ? (
                recentStories.map((story) => (
                  <div
                    key={story._id}
                    className="flex min-w-[160px] flex-col gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4"
                  >
                    <p className="text-sm font-semibold text-base-content">
                      {story.caption || "Untitled story"}
                    </p>
                    <span className="text-xs text-base-content/60">
                      {new Date(story.createdAt).toLocaleString()}
                    </span>
                    <span className="badge badge-outline badge-xs">
                      {story.viewersCount} views
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-base-200 bg-base-100/90 px-6 py-10 text-center text-sm text-base-content/70">
                  No stories yet. Share your first update!
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-base-content">
                Recent posts
              </h2>
              <button className="btn btn-sm btn-outline gap-2" type="button">
                <Activity className="h-4 w-4" />
                View all
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {recentPosts && recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <article
                    key={post._id}
                    className="rounded-2xl border border-base-200 bg-base-100/90 p-4 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="text-xs text-base-content/60">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-base-content/70">
                      Visibility: {post.visibility}
                    </p>
                    <p className="mt-2 text-sm text-base-content/80">
                      {post.excerpt || post.body}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-base-content/60">
                      <span>👍 {post.reactionsCount}</span>
                      <span>💬 {post.commentsCount}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-base-200 bg-base-100/90 px-6 py-10 text-center text-sm text-base-content/70">
                  You haven’t shared any posts yet. Start the conversation!
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow">
            <div
              role="tablist"
              className="tabs tabs-boxed w-fit bg-base-200/60"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-base-300 bg-base-100/60 p-6">
              {activeTab === "profile" && (
                <form className="space-y-6" onSubmit={handleProfileSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="form-control">
                      <span className="label-text">Full name</span>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileForm.fullname}
                        onChange={(event) =>
                          handleProfileChange("fullname", event.target.value)
                        }
                        placeholder="Your full name"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Username</span>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileForm.username}
                        onChange={(event) =>
                          handleProfileChange("username", event.target.value)
                        }
                        placeholder="username"
                      />
                    </label>
                    <label className="form-control md:col-span-2">
                      <span className="label-text">Bio</span>
                      <textarea
                        className="textarea textarea-bordered"
                        rows={3}
                        value={profileForm.bio}
                        onChange={(event) =>
                          handleProfileChange("bio", event.target.value)
                        }
                        placeholder="Add a short bio so people know what you’re up to."
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Status message</span>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileForm.statusMessage}
                        onChange={(event) =>
                          handleProfileChange(
                            "statusMessage",
                            event.target.value
                          )
                        }
                        placeholder="What’s new?"
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Pronouns</span>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileForm.pronouns}
                        onChange={(event) =>
                          handleProfileChange("pronouns", event.target.value)
                        }
                        placeholder="e.g. she/her"
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Timezone</span>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileForm.timezone}
                        onChange={(event) =>
                          handleProfileChange("timezone", event.target.value)
                        }
                        placeholder="UTC"
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Role / title</span>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={profileForm.role}
                        onChange={(event) =>
                          handleProfileChange("role", event.target.value)
                        }
                        placeholder="Team member"
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-base-content">
                        Social links
                      </h3>
                      <span className="text-xs text-base-content/60">
                        Share up to 3 links
                      </span>
                    </div>

                    {socialLinks.map((link, index) => (
                      <div
                        key={`link-${index}`}
                        className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                      >
                        <label className="form-control">
                          <span className="label-text">Label</span>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={link.label}
                            onChange={(event) =>
                              handleLinkChange(
                                index,
                                "label",
                                event.target.value
                              )
                            }
                            placeholder="Website"
                          />
                        </label>
                        <label className="form-control">
                          <span className="label-text">URL</span>
                          <input
                            type="url"
                            className="input input-bordered"
                            value={link.url}
                            onChange={(event) =>
                              handleLinkChange(index, "url", event.target.value)
                            }
                            placeholder="https://example.com"
                          />
                        </label>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            link.isPrimary ? "btn-primary" : "btn-outline"
                          }`}
                          onClick={() => markPrimaryLink(index)}
                        >
                          {link.isPrimary ? "Primary" : "Make primary"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save changes"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "preferences" && (
                <form className="space-y-6" onSubmit={handlePreferencesSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="form-control">
                      <span className="label-text">Theme</span>
                      <select
                        className="select select-bordered"
                        value={preferencesForm.theme}
                        onChange={(event) =>
                          handlePreferencesChange("theme", event.target.value)
                        }
                      >
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="contrast">High contrast</option>
                      </select>
                    </label>
                    <label className="form-control">
                      <span className="label-text">Accent color</span>
                      <input
                        type="color"
                        className="input input-bordered h-12"
                        value={preferencesForm.accentColor}
                        onChange={(event) =>
                          handlePreferencesChange(
                            "accentColor",
                            event.target.value
                          )
                        }
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Language</span>
                      <select
                        className="select select-bordered"
                        value={preferencesForm.language}
                        onChange={(event) =>
                          handlePreferencesChange(
                            "language",
                            event.target.value
                          )
                        }
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </label>
                    <label className="form-control">
                      <span className="label-text">Density</span>
                      <select
                        className="select select-bordered"
                        value={preferencesForm.density}
                        onChange={(event) =>
                          handlePreferencesChange("density", event.target.value)
                        }
                      >
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                      </select>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-base-content">
                      Notifications
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(preferencesForm.notifications).map(
                        ([key, value]) => (
                          <label key={key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="checkbox"
                              checked={value}
                              onChange={() => toggleNotification(key)}
                            />
                            <span className="text-sm capitalize text-base-content/80">
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSavingPreferences}
                    >
                      {isSavingPreferences ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save preferences"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="form-control">
                      <span className="label-text">Current password</span>
                      <input
                        type="password"
                        className="input input-bordered"
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">New password</span>
                      <input
                        type="password"
                        className="input input-bordered"
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="form-control md:col-span-2">
                      <span className="label-text">Confirm new password</span>
                      <input
                        type="password"
                        className="input input-bordered"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                  </div>

                  <div className="rounded-xl border border-base-200 bg-base-100/80 p-4 text-sm text-base-content/70">
                    <p className="font-semibold text-base-content">
                      Security tips
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Use a unique password you haven’t used elsewhere.</li>
                      <li>
                        Consider enabling two-factor authentication for extra
                        protection.
                      </li>
                      <li>
                        Update your password regularly after key projects or
                        handoffs.
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="btn btn-error"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update password"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-base-300 bg-base-100/70 p-4 text-sm text-base-content/70">
              <Loader2 className="h-4 w-4 animate-spin" />
              Refreshing profile data...
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
