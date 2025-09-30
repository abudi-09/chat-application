import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/privacy#terms" },
  { label: "Contact", to: "/about#contact" },
];

const socialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com/chattyhq",
    icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/chatty",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/chatty",
    icon: Github,
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="container mx-auto flex flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-lg font-semibold text-base-content">Chatty</p>
          <p className="text-sm text-base-content/70">
            © {new Date().getFullYear()} Chatty. All rights reserved.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-4 text-sm text-base-content/70"
        >
          {footerLinks.map(({ label, to }) => (
            <Link key={label} to={to} className="hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex justify-center gap-4">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-ghost"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
