import { BellIcon, MenuIcon, MessageCircle, SearchIcon } from "lucide-react";
import { formatLongDateToString } from "../../lib/helper";

export default function Navbar({ handleToggleNav }) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-slate-200 px-3 lg:px-8 py-2 flex items-center justify-between">
      <div className="md:hidden">
        <button onClick={handleToggleNav} aria-label="Toggle Navigation">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="hidden md:flex flex-col">
        <p className="text-lg font-medium leading-tight">Dashboard</p>
        <span className="text-sm text-gray-500">
          {formatLongDateToString(new Date())}
        </span>
        {/* <Link to="/admin/dashboard">
          <img
            loading="lazy"
            src="/logos/logo.png"
            alt="HerbAura Botanica Logo"
            className="h-14"
          />
        </Link> */}
      </div>
      <div className="flex items-center gap-1 lg:gap-3">
        <div className="relative hidden lg:block">
          <input
            className="w-64 max-w-[50vw] rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            placeholder="Buscar..."
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon className="w-4 h-4" />
          </span>
        </div>
        <button className="relative rounded-lg p-3 bg-gray-50 hover:bg-gray-100">
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </button>
        <button className="relative rounded-lg p-3 bg-gray-50 hover:bg-gray-100">
          <BellIcon className="w-5 h-5 text-gray-600" />
          {/* <BellDotIcon className="w-5 h-5 text-amber-600" /> */}
        </button>
        <div className="flex items-center gap-1">
          <div className="h-9 w-9 rounded-lg bg-gray-100">
            <img
              src="https://i.pravatar.cc/150"
              alt="Profile"
              className="h-9 w-9 object-cover rounded-lg"
            />
          </div>
          <div className="hidden lg:flex flex-col text-sm">
            <p className="font-medium leading-tight">Karyo</p>
            <span className="text-gray-500 leading-tight">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
