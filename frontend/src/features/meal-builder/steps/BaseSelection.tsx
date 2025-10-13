import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface BaseSelectionProps {
  selectedBase: 'roti' | 'roti+rice' | 'rice';
  extraRoti: number;
  onBaseChange: (base: 'roti' | 'roti+rice' | 'rice') => void;
  onExtraRotiChange: (count: number) => void;
}

const BaseSelection: React.FC<BaseSelectionProps> = ({
  selectedBase,
  extraRoti,
  onBaseChange,
  onExtraRotiChange,
}) => {
  const baseOptions = [
    {
      id: 'roti' as const,
      name: 'Only Roti',
      description: '5 Fresh Rotis',
      defaultRoti: 5,
      icon: '🫓',
    },
    {
      id: 'roti+rice' as const,
      name: 'Roti + Rice',
      description: '3 Rotis + Rice Bowl',
      defaultRoti: 3,
      icon: '🍚',
    },
    {
      id: 'rice' as const,
      name: 'Only Rice',
      description: '1 Rice Bowl',
      defaultRoti: 0,
      icon: '🍛',
    },
  ];

  const selectedOption = baseOptions.find(option => option.id === selectedBase);
  const maxExtraRoti = selectedOption ? selectedOption.defaultRoti + 3 : 3;

  const handleExtraRotiChange = (delta: number) => {
    const newCount = Math.max(0, Math.min(maxExtraRoti - (selectedOption?.defaultRoti || 0), extraRoti + delta));
    onExtraRotiChange(newCount);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Choose Your Base
        </h2>
        <p className="text-neutral-600">
          Select your preferred combination
        </p>
      </div>

      {/* Base Options */}
      <div className="grid gap-4">
        {baseOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-200 p-4',
                selectedBase === option.id
                  ? 'ring-2 ring-primary-500 shadow-card-selected'
                  : 'hover:shadow-card-hover'
              )}
              onClick={() => onBaseChange(option.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{option.name}</h3>
                  <p className="text-sm text-neutral-600">{option.description}</p>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  selectedBase === option.id
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-neutral-300'
                )}>
                  {selectedBase === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Extra Roti Section */}
      {selectedBase !== 'rice' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Extra Rotis
              </h3>
              <p className="text-sm text-neutral-600">
                Add more rotis to your meal (+₹10 per roti)
              </p>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtraRotiChange(-1)}
                disabled={extraRoti === 0}
                className="w-10 h-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="text-center min-w-[120px]">
                <div className="text-2xl font-bold text-neutral-900">
                  {(selectedOption?.defaultRoti || 0) + extraRoti}
                </div>
                <div className="text-sm text-neutral-600">
                  Total Rotis
                </div>
                {extraRoti > 0 && (
                  <div className="text-xs text-primary-600 font-medium">
                    +₹{extraRoti * 10}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtraRotiChange(1)}
                disabled={extraRoti >= maxExtraRoti - (selectedOption?.defaultRoti || 0)}
                className="w-10 h-10 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 text-center text-xs text-neutral-500">
              Max {maxExtraRoti} rotis total
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default BaseSelection;