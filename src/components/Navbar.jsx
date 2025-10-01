import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  AlignJustify,
  LogOut,
  MessageSquare,
  Settings,
  User,
  UserPlus,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Privacy", to: "/privacy" },
];

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const publicLinks = authUser ? [] : navLinks;
  const brandDestination = authUser ? "/posts" : "/";

  return (
    <header className="fixed top-0 z-40 w-full border-b border-base-300 bg-base-100/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to={brandDestination}
          className="flex items-center gap-2.5 text-base-content transition hover:opacity-90"
          onClick={closeMenu}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <MessageSquare
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
          </div>
          <span className="text-lg font-bold">Chatty</span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation"
        >
          {publicLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-primary ${
                  isActive ? "text-primary" : "text-base-content/70"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {authUser && (
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-primary ${
                  isActive ? "text-primary" : "text-base-content/70"
                }`
              }
            >
              Posts
            </NavLink>
          )}
          {authUser && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-primary ${
                  isActive ? "text-primary" : "text-base-content/70"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-ghost md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <AlignJustify className="h-4 w-4" />
            )}
          </button>

          {authUser ? (
            <>
              <Link to="/settings" className="btn btn-sm gap-2">
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <Link to="/profile" className="btn btn-sm gap-2">
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button
                className="btn btn-sm btn-ghost gap-2"
                onClick={logout}
                type="button"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary gap-2">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <nav
          className="border-t border-base-300 bg-base-100 shadow-sm md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto flex flex-col gap-2 px-4 py-4 text-sm font-medium">
            {publicLinks.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/70 hover:bg-base-200"
                  }`
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
            {authUser && (
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/70 hover:bg-base-200"
                  }`
                }
                onClick={closeMenu}
              >
                Posts
              </NavLink>
            )}
            {authUser && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/70 hover:bg-base-200"
                  }`
                }
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            )}
            <div className="mt-2 flex flex-col gap-2">
              {authUser ? (
                <>
                  <Link
                    to="/settings"
                    className="btn btn-sm"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/profile"
                    className="btn btn-sm"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-sm btn-ghost"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-sm btn-primary"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
