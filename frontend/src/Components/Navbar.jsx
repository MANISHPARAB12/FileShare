
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Desktop navigation styles
  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "font-semibold text-purple-700"
        : "text-gray-600 hover:text-purple-700"
    }`;

  // Mobile navigation styles
  const mobileLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 transition-colors duration-200 ${
      isActive
        ? "bg-purple-50 font-semibold text-purple-700"
        : "text-gray-700 hover:bg-purple-50"
    }`;

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-purple-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0L8 8m4-4 4 4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
                />
              </svg>
            </div>

            <span className="text-xl font-bold tracking-tight text-gray-900">
              File<span className="text-purple-600">Share</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/faq" className={navLinkClass}>
              FAQ
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="rounded-lg p-2 text-gray-700 transition hover:bg-purple-50 md:hidden"
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar and Overlay */}
      <div
       className={`fixed inset-0 z-[100] md:hidden ${
          menuOpen
            ? "visible"
            : "invisible pointer-events-none"
        }`}
      >
        {/* Dark Background Overlay */}
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right Sidebar */}
        <aside
          id="mobile-navigation"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-purple-100 p-5">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16V4m0 0L8 8m4-4 4 4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
                  />
                </svg>
              </div>

              <span className="text-lg font-bold text-gray-900">
                File<span className="text-purple-600">Share</span>
              </span>
            </Link>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close sidebar"
              tabIndex={menuOpen ? 0 : -1}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-purple-50 hover:text-purple-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation Links */}
          <div className="space-y-2 p-4">
            

            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
              tabIndex={menuOpen ? 0 : -1}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
              tabIndex={menuOpen ? 0 : -1}
            >
              About
            </NavLink>

            <NavLink
              to="/faq"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
              tabIndex={menuOpen ? 0 : -1}
            >
              FAQ
            </NavLink>
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto border-t border-purple-100 p-5">
            <p className="text-sm text-gray-500">
              Share files anywhere, anytime.
            </p>

            <p className="mt-2 text-xs text-purple-600">
              © {new Date().getFullYear()} FileShare
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;

