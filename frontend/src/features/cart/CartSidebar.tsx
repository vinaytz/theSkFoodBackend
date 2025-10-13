import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const CartSidebar: React.FC = () => {
  const { 
    items, 
    isOpen, 
    setCartOpen, 
    updateQuantity, 
    removeItem, 
    getCartSummary 
  } = useCart();

  const { totalItems, subtotal, deliveryFee, tax, grandTotal } = getCartSummary();

  const getBaseDescription = (base: string, extraRoti: number) => {
    switch (base) {
      case 'roti':
        return `${5 + extraRoti} Rotis`;
      case 'roti+rice':
        return `${3 + extraRoti} Rotis + Rice`;
      case 'rice':
        return '1 Rice Bowl';
      default:
        return base;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 0.9, 0.33, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary-500" />
                <h2 className="text-lg font-semibold text-neutral-900">
                  Your Cart ({totalItems})
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCartOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Add some delicious meals to get started
                  </p>
                  <Link to="/" onClick={() => setCartOpen(false)}>
                    <Button>Browse Menu</Button>
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900 capitalize mb-1">
                            {item.mealType} Thali
                          </h3>
                          <div className="text-sm text-neutral-600 space-y-1">
                            <p>Sabjis: {item.sabjisSelected.join(', ')}</p>
                            <p>Base: {getBaseDescription(item.base, item.extraRoti)}</p>
                            {item.isSpecial && (
                              <p className="text-primary-600">+ Special Paneer</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity === 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity === 5}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-900">
                            {formatPrice(item.totalPrice * item.quantity)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatPrice(item.totalPrice)} each
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Delivery Fee</span>
                    <span className="text-neutral-900">{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax (5%)</span>
                    <span className="text-neutral-900">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-2 flex justify-between font-semibold">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-primary-600 text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full flex items-center justify-center space-x-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Trust Badge */}
                <div className="text-center">
                  <p className="text-xs text-neutral-500">
                    🔒 Secure payment with Razorpay
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;