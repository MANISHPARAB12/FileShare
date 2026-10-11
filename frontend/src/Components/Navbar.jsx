
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const navigate = useNavigate();



  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "font-semibold text-purple-700"
        : "text-gray-600 hover:text-purple-700"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 ${
      isActive
        ? "bg-purple-50 font-semibold text-purple-700"
        : "text-gray-700 hover:bg-purple-50"
    }`;

  return (
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
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-gray-700 hover:bg-purple-50 md:hidden"
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

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="space-y-1 border-t border-purple-100 bg-white px-5 py-4 md:hidden">
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            About
          </NavLink>

          <NavLink
            to="/faq"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            FAQ
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;