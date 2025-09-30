import { Link } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const features = [
  {
    title: "Private Conversations",
    description:
      "Encrypted one-to-one chats with disappearing messages, read receipts, and media sharing.",
    icon: ShieldCheck,
  },
  {
    title: "Next-Level Channels",
    description:
      "Host curated discussions for your community with roles, moderation tools, and highlights.",
    icon: Video,
  },
  {
    title: "Collaborative Groups",
    description:
      "Bring teams together with invite links, shared files, and real-time decisions in one place.",
    icon: Users,
  },
  {
    title: "Stories & Posts",
    description:
      "Share updates that spark engagement—time-bound stories or permanent posts with reactions.",
    icon: Sparkles,
  },
];

const steps = [
  {
    label: "Create your account",
    detail:
      "Sign up in seconds with email or social login and customize your profile.",
  },
  {
    label: "Invite your people",
    detail:
      "Spin up channels or private groups, then share invite links or QR codes.",
  },
  {
    label: "Start the conversation",
    detail:
      "Chat, share files, post updates, and go live with stories from any device.",
  },
];

const testimonials = [
  {
    quote:
      "Chatty lets our remote team feel connected. Stories and channels keep everyone in sync without endless meetings.",
    name: "Bianca Summers",
    role: "Head of Operations, Lumen Labs",
  },
  {
    quote:
      "The onboarding was effortless and our community loves the channels. Engagement has doubled in a month.",
    name: "Quinn Harper",
    role: "Community Lead, BuildGuild",
  },
  {
    quote:
      "Secure private chats plus group collaboration in one place? It’s a dream for customer support teams like ours.",
    name: "Leon Morales",
    role: "Customer Success, NovaDesk",
  },
];

const HomePage = () => {
  return (
    <main className="min-h-screen bg-base-200 pt-16">
      <section className="relative overflow-hidden bg-gradient-to-b from-base-100 via-base-200 to-base-200">
        <div className="container mx-auto px-4 py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                New: Stories & Channel Highlights
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-base-content sm:text-5xl lg:text-6xl">
                Chat smarter. Connect faster.
              </h1>
              <p className="text-lg text-base-content/70">
                Chatty brings private messages, powerful channels, vibrant
                groups, and time-sensitive stories together so your people never
                miss a moment.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/signup" className="btn btn-primary btn-lg shadow-lg">
                  Get Started — It’s Free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">
                  Login to your workspace
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-base-content/60">
                <div className="flex -space-x-2">
                  {["BS", "QH", "LM"].map((initials) => (
                    <span
                      key={initials}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary shadow-inner"
                      aria-hidden="true"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <span>Trusted by 2,500+ teams and communities</span>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 -translate-x-6 -translate-y-6 rounded-3xl bg-primary/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative rounded-3xl border border-base-300 bg-base-100/80 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-primary/10 text-lg font-semibold flex items-center justify-center text-primary">
                      CS
                    </span>
                    <div>
                      <p className="font-semibold text-base-content">
                        Community Space
                      </p>
                      <p className="text-sm text-base-content/70">
                        Channel • 128 online
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary">Join live</button>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-base-200 p-4">
                    <p className="text-sm font-semibold text-base-content">
                      Announcements
                    </p>
                    <p className="mt-1 text-sm text-base-content/70">
                      Weekly highlights, trending stories, and upcoming events
                      in one tidy feed.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/30 p-4 text-sm text-primary">
                    <p className="font-medium">Launch your first story</p>
                    <p className="mt-1 text-base-content/70">
                      Drop a quick video update, spotlight a teammate, or share
                      a customer win.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-base-200/80 p-4">
                  <PlayCircle
                    className="h-10 w-10 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-base-content">
                      See Chatty in action
                    </p>
                    <p className="text-sm text-base-content/70">
                      2-minute product walkthrough
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
            Everything you need to keep momentum
          </h2>
          <p className="mt-3 text-base text-base-content/70">
            Build lively communities, collaborate with teammates, and nurture
            customer relationships with powerful tools designed for modern
            messaging.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="group rounded-3xl border border-base-300 bg-base-100 p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-base-content">
                {title}
              </h3>
              <p className="mt-3 text-base-content/70">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-base-100">
        <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-base-content/70">
              No clunky onboarding or complicated setup—Chatty is ready for your
              next big conversation right away.
            </p>
            <div className="mt-8 space-y-6">
              {steps.map(({ label, detail }, index) => (
                <div key={label} className="flex gap-4">
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-base-content">{label}</h3>
                    <p className="text-sm text-base-content/70">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-base-300 bg-base-200/80 p-8 shadow-lg">
              <p className="text-lg font-semibold text-base-content">
                Launch a channel in under 60 seconds
              </p>
              <ul className="mt-6 space-y-4 text-sm text-base-content/80">
                <li className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  Pick a template for teams, communities, or events.
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  Auto-generate invite codes with advanced permissions.
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  Schedule stories or posts to highlight key updates.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
            Loved by teams worldwide
          </h2>
          <p className="mt-3 text-base-content/70">
            From startups to enterprise support squads, customers celebrate
            Chatty for its velocity and human touch.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map(({ quote, name, role }) => (
            <blockquote
              key={name}
              className="rounded-3xl border border-base-300 bg-base-100 p-8 text-left shadow"
            >
              <p className="text-base text-base-content/80">“{quote}”</p>
              <footer className="mt-6">
                <p className="font-semibold text-base-content">{name}</p>
                <p className="text-sm text-base-content/60">{role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-base-100">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-20 text-center">
          <h2 className="max-w-2xl text-3xl font-bold text-base-content sm:text-4xl">
            Ready to level up your conversations?
          </h2>
          <p className="max-w-2xl text-base-content/70">
            Create a free workspace, invite your team, and see how effortless
            communication can be.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="btn btn-primary btn-lg shadow-lg">
              Create your free account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              I already have an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
