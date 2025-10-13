import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const Header: React.FC = () => {
  const location = useLocation();
  const { getTotalItems, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
      <div className="container-padding mx-auto">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-white font-bold text-sm">
              SK
            </div>
            <span className="text-lg font-semibold text-neutral-900">SKFood</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Login Button or User Menu */}
            {isAuthenticated ? (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                {user?.name || 'User'}
              </button>
            ) : (
              <Link to="/login">
                <button className="text-sm text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg">
                  LOGIN
                </button>
              </Link>
            )}

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              <MenuIcon className="h-5 w-5 text-neutral-600" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-neutral-200 py-4"
          >
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-sm text-neutral-700 hover:text-neutral-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/orders"
                className="text-sm text-neutral-700 hover:text-neutral-900"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-sm text-neutral-700 hover:text-neutral-900 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;