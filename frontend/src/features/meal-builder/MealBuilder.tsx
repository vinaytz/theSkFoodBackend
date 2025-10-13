import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import SabjiSelection from './steps/SabjiSelection';
import BaseSelection from './steps/BaseSelection';
import ExtrasSelection from './steps/ExtrasSelection';
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

  const steps: MealBuilderStep[] = [
    { id: 1, title: 'Choose Sabjis', isCompleted: selectedSabjis.length > 0, isActive: currentStep === 1 },
    { id: 2, title: 'Select Base & Roti', isCompleted: currentStep > 2, isActive: currentStep === 2 },
    { id: 3, title: 'Extras & Summary', isCompleted: false, isActive: currentStep === 3 },
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

  const stepVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? '100%' : '-30%',
      opacity: direction < 0 ? 0 : 0.3,
    }),
  };

  const transition = {
    duration: 0.4,
    ease: [0.22, 0.9, 0.33, 1],
  };

  if (!currentMenu) {
    return (
      <div className="container-padding mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Progress Bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-neutral-200 py-4">
        <div className="container-padding mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Menu</span>
            </button>
            <h1 className="text-lg font-semibold text-neutral-900 capitalize">
              Build {mealType} Thali
            </h1>
            <div className="w-20" /> {/* Spacer */}
          </div>
          <ProgressBar currentStep={currentStep} totalSteps={3} />
          <div className="flex justify-between mt-2 text-xs text-neutral-500">
            {steps.map((step) => (
              <span
                key={step.id}
                className={step.isActive ? 'text-primary-500 font-medium' : ''}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container-padding mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden min-h-[600px]">
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0"
              >
                {currentStep === 1 && (
                  <SabjiSelection
                    sabjis={currentMenu.listOfSabjis}
                    selectedSabjis={selectedSabjis}
                    onSelectionChange={setSelectedSabjis}
                  />
                )}
                {currentStep === 2 && (
                  <BaseSelection
                    selectedBase={selectedBase}
                    extraRoti={extraRoti}
                    onBaseChange={setSelectedBase}
                    onExtraRotiChange={setExtraRoti}
                  />
                )}
                {currentStep === 3 && (
                  <ExtrasSelection
                    isSpecial={isSpecial}
                    quantity={quantity}
                    totalPrice={calculatePrice()}
                    onSpecialChange={setIsSpecial}
                    onQuantityChange={setQuantity}
                    selectedSabjis={selectedSabjis}
                    selectedBase={selectedBase}
                    extraRoti={extraRoti}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <div className="text-center">
              <p className="text-sm text-neutral-600">Step {currentStep} of 3</p>
              <p className="text-lg font-semibold text-primary-500">
                ₹{calculatePrice() * quantity}
              </p>
            </div>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                className="flex items-center space-x-2"
              >
                <span>Add to Cart</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealBuilder;