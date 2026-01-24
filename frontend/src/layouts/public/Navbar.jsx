import { HandbagIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import CartInfo from "../../components/public/checkout/CartInfo";
import { useCartStore } from "../../store/useCartStore";
import NavMobile from "./NavMobile";

export default function Navbar() {
  const { cart } = useCartStore();
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [showNavMobile, setShowNavMobile] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleToggleNav = () => {
    setShowCart(false);
    setShowNavMobile(!showNavMobile);
  };

  const handleToggleCart = () => {
    setShowNavMobile(false);
    setShowCart(!showCart);
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        <nav className="navbar lg:px-20 md:px-5 py-1">
          <div className="md:hidden">
            <button onClick={handleToggleNav} aria-label="Toggle Navigation">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
          <div
            className={`md:block md:opacity-100 ${showNavMobile ? "opacity-0" : "opacity-100"} transition-opacity`}
          >
            <Link to="/">
              <img
                loading="lazy"
                src="/logos/logo.png"
                alt="HerbAura Botanica Logo"
                className="h-14"
              />
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
              <button
                className="text-amber-600 relative"
                onClick={handleToggleCart}
                aria-label="Toggle Cart"
              >
                <HandbagIcon className="w-6 h-6" />
                {quantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {quantity}
                  </span>
                )}
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-3 md:hidden">
            <button
              className="text-amber-600 relative"
              onClick={handleToggleCart}
              aria-label="Toggle Cart"
            >
              <HandbagIcon className="w-6 h-6" />
              {quantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {quantity}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <NavMobile
        showNavMobile={showNavMobile}
        handleToggleNav={handleToggleNav}
      />
      <CartInfo showCart={showCart} handleToggleCart={handleToggleCart} />
    </>
  );
}
