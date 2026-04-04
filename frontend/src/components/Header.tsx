import { Link, useLocation } from 'react-router';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import  toast  from 'react-hot-toast';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  const isAdmin = location.pathname === '/admin';

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/rewards', label: 'Rewards' },
    { to: '/coins-history', label: 'History' },
    { to: '/withdrawal', label: 'Withdraw' },
    { to: '/pricing', label: 'Pricing' },
  ];
// Add logout handler
const handleLogout = () => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully");
  window.location.href = "/login";
};
  if (isLanding || isAuth) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto backdrop-blur-xl bg-white/60 dark:bg-slate-900/40 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-xl">D</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
                Drawboxs
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {isLanding && (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto backdrop-blur-xl bg-white/60 dark:bg-slate-900/40 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-xl">D</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
              Drawboxs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : userLinks).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl transition-all ${
                  location.pathname === link.to
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
<button
  onClick={handleLogout}
  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 transition-all shadow-lg"
>
  Logout
</button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col gap-2">
                {(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : userLinks).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      location.pathname === link.to
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
