import { useMemo, useState } from "react";
import { FileText, Gavel, Mail, Search, ShieldCheck } from "lucide-react";

const policySections = [
  {
    id: "introduction",
    title: "Introduction",
    description:
      "Your privacy is important to us. This policy explains what information we collect, how we use it, and the options you have to control your data.",
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    items: [
      "Account details such as name, email address, and profile photo.",
      "Content you share including messages, posts, stories, and uploaded files.",
      "Usage data like device information, login timestamps, and feature interactions to keep Chatty reliable.",
      "Optional integrations (calendar, CRM, support tools) when you authorize them explicitly.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "How we use data",
    items: [
      "Provide, maintain, and improve Chatty’s services, including personalization and feature enhancements.",
      "Deliver customer support and respond to inquiries.",
      "Monitor platform health, detect abuse, and keep your data secure.",
      "Send product updates and announcements—only when you opt in.",
    ],
  },
  {
    id: "data-sharing",
    title: "Data sharing",
    description:
      "We never sell your personal information. We share data only when necessary to operate the service or when we are legally required to do so.",
    items: [
      "Infrastructure partners that power storage, analytics, and real-time messaging (for example, Cloudinary for media).",
      "Trusted vendors that provide fraud prevention, customer support tools, and product analytics.",
      "Regulators or law enforcement when required by applicable law, with appropriate safeguards.",
    ],
  },
  {
    id: "user-rights",
    title: "Your rights",
    items: [
      "Access a copy of your personal data or export conversation history.",
      "Request corrections or deletion, subject to contractual or legal obligations.",
      "Manage notification preferences and revoke permissions for third-party integrations at any time.",
      "Appeal decisions related to automated moderation.",
    ],
  },
  {
    id: "data-security",
    title: "Data security",
    description:
      "We implement organizational and technical safeguards to protect your information from unauthorized access, disclosure, alteration, and destruction.",
    items: [
      "End-to-end TLS encryption in transit and database encryption at rest.",
      "Role-based access controls and mandatory security training for employees.",
      "Regular penetration testing and third-party audits to validate our controls.",
      "Automated monitoring and alerting for suspicious login activity.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & tracking",
    items: [
      "Essential cookies that keep you logged in and secure.",
      "Performance cookies to understand usage patterns and improve reliability.",
      "Preference cookies to remember settings like theme, language, and notification choices.",
      "You can adjust cookie preferences through your browser or in-app settings.",
    ],
  },
  {
    id: "terms",
    title: "Terms of service overview",
    description:
      "For the full contractual terms, please review the Terms of Service available in your workspace settings. Below is a friendly summary of key commitments.",
    items: [
      "You retain ownership of the content you create while granting Chatty a license to deliver the service.",
      "You agree not to misuse the platform, attempt to access other users’ data, or violate applicable laws.",
      "Service availability is provided on a best-effort basis with scheduled maintenance windows communicated in advance.",
      "Payment terms (when applicable) renew automatically unless canceled before the end of the billing cycle.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    description:
      "Questions about this policy or your data? Our privacy team is here to help.",
    items: [
      "Email: privacy@chatty.app",
      "Mailing address: Chatty HQ, 100 Market Street, Toronto, ON",
    ],
  },
];

const PrivacyPolicyPage = () => {
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    if (!query.trim()) return policySections;
    return policySections.filter(({ title, description, items }) => {
      const lowercaseQuery = query.toLowerCase();
      const baseMatch = title.toLowerCase().includes(lowercaseQuery);
      const descMatch = description?.toLowerCase().includes(lowercaseQuery);
      const itemsMatch = items?.some((item) =>
        item.toLowerCase().includes(lowercaseQuery)
      );
      return baseMatch || descMatch || itemsMatch;
    });
  }, [query]);

  return (
    <main className="bg-base-200 pt-16">
      <section className="bg-base-100">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Privacy first, always
            </div>
            <h1 className="mt-6 text-4xl font-bold text-base-content sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base text-base-content/70">
              We are committed to being transparent about how Chatty collects,
              uses, and protects your personal information. This page was last
              updated on <strong>August 10, 2025</strong>.
            </p>
          </div>
          <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3">
            <Search
              className="h-5 w-5 text-base-content/60"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the policy for a keyword (e.g. cookies, access, deletion)"
              className="flex-1 bg-transparent text-sm outline-none"
              aria-label="Search privacy policy"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          {filteredSections.length === 0 && (
            <p className="rounded-3xl border border-base-300 bg-base-100 p-8 text-center text-base text-base-content/70">
              We couldn’t find any sections that match “{query}”. Try another
              search term or explore the sections below.
            </p>
          )}

          {filteredSections.map(({ id, title, description, items }) => (
            <details
              key={id}
              className="group rounded-3xl border border-base-300 bg-base-100 shadow"
              open
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                <h2 className="text-lg font-semibold text-base-content">
                  {title}
                </h2>
                <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70">
                  {items
                    ? `${items.length} bullet${items.length > 1 ? "s" : ""}`
                    : "Overview"}
                </span>
              </summary>
              <div className="space-y-4 border-t border-base-300 px-6 py-6 text-sm text-base-content/75">
                {description && <p>{description}</p>}
                {items && (
                  <ul className="list-disc space-y-2 pl-4">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-base-100">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-16 text-center">
          <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-base-content">
            Need something specific?
          </h2>
          <p className="max-w-2xl text-sm text-base-content/70">
            For data access, portability, or deletion requests, email our
            privacy team with the subject line “Privacy Request”. We respond
            within 7 business days and usually sooner.
          </p>
          <a className="btn btn-primary" href="mailto:privacy@chatty.app">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact privacy team
          </a>
          <p className="text-xs text-base-content/60">
            If you’re located in the EU/EEA or UK, you can also contact our Data
            Protection Officer at dpo@chatty.app.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
            <Gavel className="h-4 w-4" aria-hidden="true" />
            We comply with GDPR, CPRA, PIPEDA, and other global regulations.
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
