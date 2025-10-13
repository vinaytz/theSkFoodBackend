import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Sabji } from '@/types';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

interface SabjiSelectionProps {
  sabjis: Sabji[];
  selectedSabjis: string[];
  onSelectionChange: (sabjis: string[]) => void;
}

const SabjiSelection: React.FC<SabjiSelectionProps> = ({
  sabjis,
  selectedSabjis,
  onSelectionChange,
}) => {
  const { toast } = useToast();

  const handleSabjiToggle = (sabjiName: string) => {
    if (selectedSabjis.includes(sabjiName)) {
      // Remove sabji
      onSelectionChange(selectedSabjis.filter(s => s !== sabjiName));
    } else {
      // Add sabji (max 2)
      if (selectedSabjis.length >= 2) {
        toast.warning('Maximum 2 sabjis', 'You can select up to 2 sabjis only');
        return;
      }
      onSelectionChange([...selectedSabjis, sabjiName]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Choose Your Sabjis
        </h2>
        <p className="text-neutral-600">
          Select up to 2 sabjis for your thali
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sabjis.map((sabji, index) => {
          const isSelected = selectedSabjis.includes(sabji.name);
          
          return (
            <motion.div
              key={sabji.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'relative cursor-pointer transition-all duration-200 p-4',
                  isSelected
                    ? 'ring-2 ring-primary-500 shadow-card-selected'
                    : 'hover:shadow-card-hover hover:-translate-y-1'
                )}
                onClick={() => handleSabjiToggle(sabji.name)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}

                {/* Special Badge */}
                {sabji.isSpecial && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
                    Special
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-neutral-100">
                  <img
                    src={sabji.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'}
                    alt={sabji.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="font-medium text-neutral-900 text-center text-sm">
                  {sabji.name}
                </h3>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Status */}
      <div className="text-center">
        <p className="text-sm text-neutral-600">
          {selectedSabjis.length === 0 && 'Select at least 1 sabji to continue'}
          {selectedSabjis.length === 1 && 'You can select 1 more sabji'}
          {selectedSabjis.length === 2 && 'Perfect! You\'ve selected 2 sabjis'}
        </p>
        {selectedSabjis.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {selectedSabjis.map((sabji) => (
              <span
                key={sabji}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
              >
                {sabji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SabjiSelection;