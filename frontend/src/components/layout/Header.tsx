import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon } from 'lucide-react';
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="container-padding mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold">
              SK
            </div>
            <span className="text-xl font-bold text-neutral-900">Food</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-500',
                isActive('/') ? 'text-primary-500' : 'text-neutral-600'
              )}
            >
              Home
            </Link>
            <Link
              to="/orders"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-500',
                isActive('/orders') ? 'text-primary-500' : 'text-neutral-600'
              )}
            >
              Orders
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative p-2"
              aria-label={`Cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-medium text-white"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                </Button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg border border-neutral-200"
                  >
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-neutral-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={cn(
                  'text-sm font-medium',
                  isActive('/') ? 'text-primary-500' : 'text-neutral-600'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/orders"
                className={cn(
                  'text-sm font-medium',
                  isActive('/orders') ? 'text-primary-500' : 'text-neutral-600'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;