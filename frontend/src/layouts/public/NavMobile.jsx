import { XIcon } from "lucide-react";
import { Link, NavLink } from "react-router";

export default function NavMobile({ showNavMobile, handleToggleNav }) {
  return (
    <aside
      className={`md:hidden fixed top-0 h-dvh left-0 w-1/2 sm:w-2/5 bg-white z-50 border-r border-gray-100 flex flex-col transition-transform duration-300 shadow-lg ${
        showNavMobile ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between border-b border-b-gray-200 pb-2 p-4 mb-4">
        <Link to="/" onClick={handleToggleNav}>
          <img
            loading="lazy"
            src="/logos/logo.png"
            alt="HerbAura Botanica Logo"
            className="h-15"
          />
        </Link>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleToggleNav}
          aria-label="Close Navigation"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <ul className="flex flex-col gap-2 px-4 overflow-auto">
        <li>
          <NavLink to="/" className="block py-2" onClick={handleToggleNav}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className="block py-2"
            onClick={handleToggleNav}
          >
            Catálogo
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="block py-2" onClick={handleToggleNav}>
            Acerca de
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className="block py-2"
            onClick={handleToggleNav}
          >
            Contacto
          </NavLink>
        </li>
        <li>
          <NavLink to="/terms" className="block py-2" onClick={handleToggleNav}>
            Política
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
