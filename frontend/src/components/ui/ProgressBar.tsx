import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  className,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('w-full bg-neutral-200 rounded-full h-2', className)}>
      <motion.div
        className="h-2 bg-primary-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ProgressBar;