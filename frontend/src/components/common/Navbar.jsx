import {
  HandbagIcon,
  MenuIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { formatCurrency } from "../../lib/helper";
import { useCartStore } from "../../store/useCartStore";

export default function Navbar() {
  const { cart } = useCartStore();
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [showNav, setShowNav] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleToggleNav = () => {
    setShowCart(false);
    setShowNav(!showNav);
  };

  const handleToggleCart = () => {
    setShowNav(false);
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
            className={`md:block md:opacity-100 ${showNav ? "opacity-0" : "opacity-100"} transition-opacity`}
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
              <CartLink quantity={quantity} />
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

      <aside
        className={`md:hidden fixed top-0 h-dvh left-0 w-1/2 sm:w-2/5 bg-white z-50 border-r border-gray-100 flex flex-col transition-transform duration-300 shadow-lg ${
          showNav ? "translate-x-0" : "-translate-x-full"
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
            <NavLink
              to="/about"
              className="block py-2"
              onClick={handleToggleNav}
            >
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
            <NavLink
              to="/terms"
              className="block py-2"
              onClick={handleToggleNav}
            >
              Política
            </NavLink>
          </li>
        </ul>
      </aside>

      <CartLinkMobile showCart={showCart} handleToggleCart={handleToggleCart} />
    </>
  );
}

function CartLink({ quantity }) {
  return (
    <NavLink
      className="text-amber-600 relative"
      to="/cart"
      title="Carrito de Compras"
    >
      <span className="sr-only">Carrito de Compras</span>
      <HandbagIcon className="w-6 h-6" />
      {quantity > 0 && (
        <span className="absolute -top-1 -right-2 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {quantity}
        </span>
      )}
    </NavLink>
  );
}

function CartLinkMobile({ showCart, handleToggleCart }) {
  const { cart, removeFromCart, decreaseQuantity, addToCart } = useCartStore();

  return (
    <aside
      className={`fixed top-0 right-0 h-dvh flex flex-col border-l border-gray-100 bg-white z-50 w-3/4 sm:w-md md:hidden transition-transform duration-300 shadow-lg ${
        showCart ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between border-b border-b-gray-200 p-4">
        <h2 className="text-lg font-semibold">Carrito de Compras</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleToggleCart}
          aria-label="Close Cart"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="px-4 py-2 flex-1 overflow-auto">
        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          cart.map((item) => (
            <div
              className="flex items-center justify-between py-3 border-b gap-2 border-gray-100"
              key={item._id}
            >
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 overflow-hidden rounded-xl p-2 shrink-0">
                  <img
                    loading="lazy"
                    src={item.images[0]}
                    className="w-17 h-17 object-contain bg-gray-100 rounded-xl"
                    alt={item.name}
                  />
                </div>
                <div>
                  <p className="font-medium leading-tight text-sm">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-sm leading-tight">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>

                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="bg-gray-200 rounded-md p-1 h-6 w-6 flex items-center justify-center"
                    >
                      <MinusIcon className="h-3 w-3 text-gray-600" />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-gray-200 rounded-md p-1 h-6 w-6 flex items-center justify-center"
                    >
                      <PlusIcon className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="sticky bottom-0 border-t border-gray-100 p-4">
          <button className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition">
            Proceder al Pago
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center leading-tight tracking-tighter">
            Los gastos de envío se calcularán en la página de pago.
          </p>
        </div>
      )}
    </aside>
  );
}
