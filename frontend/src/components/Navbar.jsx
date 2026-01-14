import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import { Link, NavLink } from "react-router";
import { useCartStore } from "../store/useCartStore";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="navbar lg:px-20 md:px-5">
        <div className="md:hidden">
          <button>
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
        <div>
          <Link to="/">
            {/* <img loading="lazy"
              src="/logos/logo.jpeg"
              alt="HerbAura Botanica Logo"
              className="h-20"
            /> */}
            HerbAura Botanica
          </Link>
        </div>
        <ul className="md:flex flex-1 justify-end gap-4 items-center hidden">
          <li>
            <NavLink to="/">Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/products">Catálogo</NavLink>
          </li>
          <li>
            <NavLink to="/about">Acerca de</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contacto</NavLink>
          </li>
          <li>
            <NavLink to="/terms">Política</NavLink>
          </li>
          <li className="flex items-center">
            <CartLink />
          </li>
        </ul>
        <div className="flex items-center gap-3 lg:hidden">
          <CartLink />
        </div>
      </nav>
    </header>
  );
}

function CartLink() {
  const { cart } = useCartStore();
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <NavLink
      className="text-amber-600 relative"
      to="/cart"
      title="Carrito de Compras"
    >
      <span className="sr-only">Carrito de Compras</span>
      <ShoppingCartIcon className="w-6 h-6" />
      {cart.length > 0 && (
        <span className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {quantity}
        </span>
      )}
    </NavLink>
  );
}
