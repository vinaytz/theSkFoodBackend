import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLunchMenu, useDinnerMenu } from '@/services/queries';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { MealBuilderStep } from '@/types';

const MealBuilder: React.FC = () => {
  const { mealType } = useParams<{ mealType: 'lunch' | 'dinner' }>();
  const navigate = useNavigate();
  const { addMealToCart } = useCart();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSabjis, setSelectedSabjis] = useState<string[]>([]);
  const [selectedBase, setSelectedBase] = useState<'roti' | 'roti+rice' | 'rice'>('roti');
  const [extraRoti, setExtraRoti] = useState(0);
  const [isSpecial, setIsSpecial] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: lunchMenu } = useLunchMenu();
  const { data: dinnerMenu } = useDinnerMenu();

  const currentMenu = mealType === 'lunch' ? lunchMenu?.[0] : dinnerMenu?.[0];
  const basePrice = currentMenu?.basePrice || 60;

  const steps = [
    { id: 1, title: 'Dishes', isCompleted: selectedSabjis.length > 0, isActive: currentStep === 1 },
    { id: 2, title: 'Base', isCompleted: currentStep > 2, isActive: currentStep === 2 },
    { id: 3, title: 'Extras', isCompleted: false, isActive: currentStep === 3 },
  ];

  const calculatePrice = () => {
    const specialPrice = isSpecial ? 20 : 0;
    const rotiPrice = extraRoti * 10;
    return basePrice + specialPrice + rotiPrice;
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedSabjis.length > 0;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleAddToCart = () => {
    if (!currentMenu) {
      toast.error('Menu not available', 'Please try again later');
      return;
    }

    addMealToCart(
      mealType!,
      selectedSabjis,
      selectedBase,
      extraRoti,
      isSpecial,
      basePrice,
      quantity
    );

    toast.success('Added to cart!', `${quantity} ${mealType} thali${quantity > 1 ? 's' : ''} added`);
    navigate('/');
  };

  if (!currentMenu) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="container-padding mx-auto">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-white font-bold text-sm">
                  SK
                </div>
                <span className="text-lg font-semibold text-neutral-900">SKFood</span>
              </div>
            </div>
            <h1 className="text-lg font-semibold text-neutral-900">
              Build Your Thali
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-neutral-200 py-4">
        <div className="container-padding mx-auto">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step.isCompleted 
                      ? 'bg-neutral-800 text-white' 
                      : step.isActive 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-neutral-200 text-neutral-500'
                    }
                  `}>
                    {step.isCompleted ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <span className={`
                    text-xs mt-1 font-medium
                    ${step.isActive ? 'text-neutral-900' : 'text-neutral-500'}
                  `}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px bg-neutral-200 mx-4 mt-[-16px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container-padding mx-auto py-6">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                      Choose Your Dishes
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Select up to 2 delicious dishes for your thali
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {currentMenu.listOfSabjis.slice(0, 4).map((sabji) => {
                      const isSelected = selectedSabjis.includes(sabji.name);
                      
                      return (
                        <div
                          key={sabji.name}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSabjis(selectedSabjis.filter(s => s !== sabji.name));
                            } else {
                              if (selectedSabjis.length >= 2) {
                                toast.warning('Maximum 2 dishes', 'You can select up to 2 dishes only');
                                return;
                              }
                              setSelectedSabjis([...selectedSabjis, sabji.name]);
                            }
                          }}
                          className={`
                            relative bg-white rounded-2xl p-4 cursor-pointer transition-all
                            ${isSelected 
                              ? 'ring-2 ring-neutral-800 shadow-lg' 
                              : 'shadow-sm hover:shadow-md'
                            }
                          `}
                        >
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          
                          <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-100">
                            <img
                              src={sabji.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'}
                              alt={sabji.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <h3 className="font-medium text-neutral-900 text-center text-sm">
                            {sabji.name}
                          </h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                      Choose Your Base
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Select your preferred combination
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'roti', name: 'Roti Only', desc: '5 fresh rotis', selected: selectedBase === 'roti' },
                      { id: 'roti+rice', name: 'Roti + Rice', desc: '3 rotis + rice bowl', selected: selectedBase === 'roti+rice' },
                      { id: 'rice', name: 'Rice Only', desc: 'Generous rice bowl', selected: selectedBase === 'rice' },
                    ].map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedBase(option.id as any)}
                        className={`
                          bg-white rounded-2xl p-4 cursor-pointer transition-all border-2
                          ${option.selected 
                            ? 'border-neutral-800 shadow-lg' 
                            : 'border-transparent shadow-sm hover:shadow-md'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-neutral-900">{option.name}</h3>
                            <p className="text-sm text-neutral-600">{option.desc}</p>
                          </div>
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${option.selected 
                              ? 'border-neutral-800 bg-neutral-800' 
                              : 'border-neutral-300'
                            }
                          `}>
                            {option.selected && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                      Your Custom Thali
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Freshly prepared with love
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <h3 className="font-medium text-neutral-900 mb-3">Your Selection</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Sabjis</span>
                        <span className="text-sm font-medium text-neutral-900">₹{basePrice}</span>
                      </div>
                      <p className="text-sm text-neutral-700">{selectedSabjis.join(', ')}</p>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">
                          {selectedBase === 'roti' ? 'Roti (5)' : 
                           selectedBase === 'roti+rice' ? 'Roti + Rice' : 'Rice Only'}
                        </span>
                      </div>

                      <div className="border-t border-neutral-200 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">Included Free</span>
                        </div>
                        <p className="text-sm text-neutral-600">Salad, Raita</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-white text-neutral-700 py-3 px-6 rounded-full font-medium border border-neutral-300 hover:bg-neutral-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="flex-1 bg-neutral-800 text-white py-3 px-6 rounded-full font-medium hover:bg-neutral-700 transition-colors"
                    >
                      Review Order →
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-neutral-500">
                      Pay Later (COD) - Coming Soon
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation */}
          {currentStep < 3 && (
            <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
              <button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="w-full bg-neutral-800 text-white py-3 px-6 rounded-full font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealBuilder;