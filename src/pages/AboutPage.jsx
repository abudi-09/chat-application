import { Mail, MapPin, Rocket, Users } from "lucide-react";

const timeline = [
  {
    year: "2022",
    title: "Idea sparks",
    description:
      "We set out to design a chat experience that feels human, with privacy and community baked in from day one.",
  },
  {
    year: "2023",
    title: "Beta launches",
    description:
      "Early adopters from remote startups and creator collectives helped shape groups, channels, and stories.",
  },
  {
    year: "2024",
    title: "Scaling globally",
    description:
      "Chatty now powers conversations across 80+ countries with enterprise-grade reliability.",
  },
];

const team = [
  {
    name: "Amelia Chen",
    role: "Co-founder & CEO",
    bio: "Product strategist passionate about inclusive collaboration.",
    initials: "AC",
  },
  {
    name: "Diego Ramirez",
    role: "Co-founder & CTO",
    bio: "Built scalable messaging platforms for global teams and gamers alike.",
    initials: "DR",
  },
  {
    name: "Priya Desai",
    role: "Head of Design",
    bio: "Believes great design bridges technology and human connection.",
    initials: "PD",
  },
  {
    name: "Marcus Lee",
    role: "Security Lead",
    bio: "Keeps our encryption, compliance, and trust programs running.",
    initials: "ML",
  },
];

const AboutPage = () => {
  return (
    <main className="bg-base-200 pt-16">
      <section className="bg-base-100">
        <div className="container mx-auto px-4 py-20 text-center md:text-left">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                Our mission
              </p>
              <h1 className="text-4xl font-bold text-base-content sm:text-5xl">
                Communication should feel effortless and personal.
              </h1>
              <p className="text-lg text-base-content/70">
                Chatty was created to close the gap between intimate one-on-one
                chats and the broadcast power of communities. We help teams,
                creators, and customers feel heard—no matter where they are in
                the world.
              </p>
            </div>
            <div className="rounded-3xl border border-base-300 bg-base-200/80 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-base-content">
                The values that guide us
              </h2>
              <ul className="mt-6 space-y-4 text-base-content/80">
                <li>
                  ✨ Privacy and security are table stakes, not optional
                  add-ons.
                </li>
                <li>🤝 Communities thrive when everyone has a voice.</li>
                <li>
                  🚀 Speed matters—shipping improvements weekly keeps us honest.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
            Our story
          </h2>
          <p className="mt-3 text-base-content/70">
            What started as a passion project for remote friends is now a global
            platform that keeps people close and aligned.
          </p>
        </div>
        <div className="mt-14 space-y-8">
          {timeline.map(({ year, title, description }) => (
            <article
              key={year}
              className="relative grid gap-4 rounded-3xl border border-base-300 bg-base-100 p-8 shadow"
            >
              <span
                className="absolute inset-y-4 left-4 w-1 rounded-full bg-primary"
                aria-hidden="true"
              />
              <div className="pl-10">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
                  {year}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-base-content">
                  {title}
                </h3>
                <p className="mt-2 text-base-content/70">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-base-100">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
              Meet the team
            </h2>
            <p className="mt-3 text-base-content/70">
              The humans behind Chatty bring experience from communications,
              design, and security-first infrastructure.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map(({ name, role, bio, initials }) => (
              <article
                key={name}
                className="flex h-full flex-col rounded-3xl border border-base-300 bg-base-200/70 p-6 text-left shadow"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                    {initials}
                  </span>
                  <div>
                    <p className="font-semibold text-base-content">{name}</p>
                    <p className="text-sm text-base-content/70">{role}</p>
                  </div>
                </div>
                <p className="text-sm text-base-content/70">{bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-10 rounded-3xl border border-base-300 bg-base-100 p-8 shadow-lg md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-base-content">
              Stay in touch
            </h2>
            <p className="text-base-content/70">
              We love partnering with teams, creators, and customer champions.
              Reach out to explore collaborations, press inquiries, or support.
            </p>
            <div className="flex items-center gap-3 text-sm text-base-content/80">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>
                Distributed team with hubs in Toronto • Mexico City • Singapore
              </span>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl bg-base-200/80 p-6">
            <div className="flex items-center gap-3 text-base font-medium text-base-content">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              hello@chatty.app
            </div>
            <div className="flex items-center gap-3 text-base font-medium text-base-content">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              Join our community workspace
            </div>
            <p className="text-sm text-base-content/60">
              Prefer a direct line? DM us on X @chattyhq or LinkedIn /chatty.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
