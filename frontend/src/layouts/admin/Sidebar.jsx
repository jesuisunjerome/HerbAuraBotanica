import {
  BadgePercentIcon,
  BoxIcon,
  CalculatorIcon,
  ChartNoAxesColumnIcon,
  CreditCardIcon,
  HeadsetIcon,
  LayoutDashboard,
  LogOutIcon,
  SettingsIcon,
  ShoppingCartIcon,
  XIcon,
} from "lucide-react";
import { Link, NavLink } from "react-router";

export default function Sidebar({ showNavMobile, handleToggleNav }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col transform ${
        showNavMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } transition-transform duration-200 ease-in-out z-50`}
    >
      <div className="flex justify-between md:justify-center border-b border-b-slate-100 px-4 py-3">
        <Link to="/admin/dashboard">
          <img
            loading="lazy"
            src="/logos/logo.png"
            alt="HerbAura Botanica Logo"
            className="h-14"
          />
        </Link>
        <button
          className="text-gray-500 hover:text-gray-700 md:hidden"
          onClick={handleToggleNav}
          aria-label="Close Navigation"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Menú
          </p>
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/order"
            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <span className="flex items-center gap-3">
              <ShoppingCartIcon className="h-4 w-4" />
              <span>Pedidos</span>
            </span>
            <span className="inline-flex items-center justify-center text-xs font-semibold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
              12
            </span>
          </NavLink>
          <NavLink
            to="/admin/products/all"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <BoxIcon className="h-4 w-4" />
            <span>Productos</span>
          </NavLink>
          {/* <NavLink
            to="/admin/customers"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <UsersIcon className="h-4 w-4" />
            <span>Clientes</span>
          </NavLink> */}
          <NavLink
            to="/admin/reports"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <ChartNoAxesColumnIcon className="h-4 w-4" />
            <span>Reportes</span>
          </NavLink>
        </div>

        <div className="mt-6">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Funciones Adicionales
          </p>
          <NavLink
            to="/admin/integration"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <CreditCardIcon className="h-4 w-4" />
            <span>Integración</span>
          </NavLink>
          <NavLink
            to="/admin/discount"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <BadgePercentIcon className="h-4 w-4" />
            <span>Descuento</span>
          </NavLink>
          <NavLink
            to="/admin/invoice"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <CalculatorIcon className="h-4 w-4" />
            <span>Factura</span>
          </NavLink>
        </div>
      </nav>

      <nav className="border-t border-slate-100 p-2">
        <div className="mt-6">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Soporte
          </p>
          <NavLink
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Ajustes</span>
          </NavLink>
          <NavLink
            to="/admin/support"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50"
          >
            <HeadsetIcon className="h-4 w-4" />
            <span>Soporte</span>
          </NavLink>
        </div>
        <button className="flex w-full items-center text-amber-700 gap-3 px-3 py-2 rounded-md hover:bg-slate-50 hover:translate-y-0">
          <LogOutIcon className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
