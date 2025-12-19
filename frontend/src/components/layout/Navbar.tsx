import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Settings, LogIn } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-white/10 px-3 py-1 text-lg font-semibold tracking-wide">NEON POS</div>
            <div className="hidden sm:flex items-center space-x-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/5'
                  }`
                }
              >
                <Home size={16} />
                <span>POS</span>
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/5'
                  }`
                }
              >
                <ShoppingCart size={16} />
                <span>Orders</span>
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/5'
                  }`
                }
              >
                <Settings size={16} />
                <span>Settings</span>
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/20"
            >
              <LogIn size={16} />
              <span>Sign in</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
