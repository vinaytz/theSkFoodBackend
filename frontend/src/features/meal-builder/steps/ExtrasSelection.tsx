import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface ExtrasSelectionProps {
  isSpecial: boolean;
  quantity: number;
  totalPrice: number;
  onSpecialChange: (isSpecial: boolean) => void;
  onQuantityChange: (quantity: number) => void;
  selectedSabjis: string[];
  selectedBase: 'roti' | 'roti+rice' | 'rice';
  extraRoti: number;
}

const ExtrasSelection: React.FC<ExtrasSelectionProps> = ({
  isSpecial,
  quantity,
  totalPrice,
  onSpecialChange,
  onQuantityChange,
  selectedSabjis,
  selectedBase,
  extraRoti,
}) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(5, quantity + delta));
    onQuantityChange(newQuantity);
  };

  const getBaseDescription = () => {
    switch (selectedBase) {
      case 'roti':
        return `${5 + extraRoti} Rotis`;
      case 'roti+rice':
        return `${3 + extraRoti} Rotis + Rice`;
      case 'rice':
        return '1 Rice Bowl';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Extras & Summary
        </h2>
        <p className="text-neutral-600">
          Add extras and review your order
        </p>
      </div>

      {/* Special Paneer Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          className={cn(
            'cursor-pointer transition-all duration-200 p-4',
            isSpecial
              ? 'ring-2 ring-primary-500 shadow-card-selected'
              : 'hover:shadow-card-hover'
          )}
          onClick={() => onSpecialChange(!isSpecial)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🧀</div>
              <div>
                <h3 className="font-semibold text-neutral-900">Special Paneer</h3>
                <p className="text-sm text-neutral-600">
                  Upgrade to premium paneer sabji
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-primary-600">+₹20</span>
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center',
                isSpecial
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-neutral-300'
              )}>
                {isSpecial && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Always Included Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">Always Included</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="text-lg">🥗</div>
              <span className="text-sm text-green-800">Fresh Salad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-lg">🥛</div>
              <span className="text-sm text-green-800">Raita</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quantity Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Quantity
            </h3>
            <p className="text-sm text-neutral-600">
              How many thalis do you want?
            </p>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity === 1}
              className="w-10 h-10 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="text-center min-w-[80px]">
              <div className="text-2xl font-bold text-neutral-900">{quantity}</div>
              <div className="text-sm text-neutral-600">Thali{quantity > 1 ? 's' : ''}</div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity === 5}
              className="w-10 h-10 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-neutral-500">
            Maximum 5 thalis per order
          </div>
        </Card>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-neutral-50">
          <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Sabjis:</span>
              <span className="text-neutral-900">{selectedSabjis.join(', ')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Base:</span>
              <span className="text-neutral-900">{getBaseDescription()}</span>
            </div>
            
            {isSpecial && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Special Paneer:</span>
                <span className="text-primary-600">+₹20</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Quantity:</span>
              <span className="text-neutral-900">{quantity} thali{quantity > 1 ? 's' : ''}</span>
            </div>
            
            <div className="border-t border-neutral-200 pt-3 flex justify-between font-semibold">
              <span className="text-neutral-900">Total:</span>
              <span className="text-primary-600 text-lg">{formatPrice(totalPrice * quantity)}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Helpful Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-xs text-neutral-500">
          💡 Most students order 1 thali
        </p>
      </motion.div>
    </div>
  );
};

export default ExtrasSelection;