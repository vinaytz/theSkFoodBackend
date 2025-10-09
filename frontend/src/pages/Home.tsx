import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useLunchMenu, useDinnerMenu } from '@/services/queries';
import { formatPrice } from '@/utils/formatters';

const Home: React.FC = () => {
  const { data: lunchMenu, isLoading: lunchLoading } = useLunchMenu();
  const { data: dinnerMenu, isLoading: dinnerLoading } = useDinnerMenu();

  const currentHour = new Date().getHours();
  const isLunchTime = currentHour >= 11 && currentHour < 16;
  const isDinnerTime = currentHour >= 18 && currentHour < 23;

  const getCurrentMeal = () => {
    if (isLunchTime) return 'lunch';
    if (isDinnerTime) return 'dinner';
    return currentHour < 11 ? 'lunch' : 'dinner';
  };

  const currentMeal = getCurrentMeal();
  const currentMenu = currentMeal === 'lunch' ? lunchMenu?.[0] : dinnerMenu?.[0];

  return (
    <div className="container-padding mx-auto py-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          Today's Fresh{' '}
          <span className="text-primary-500">
            {currentMeal === 'lunch' ? 'Lunch' : 'Dinner'}
          </span>
        </h1>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          Delicious, home-style meals prepared fresh daily. Choose your favorites and get it delivered hot to your doorstep.
        </p>

        {/* Time indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Clock className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-neutral-700">
            {isLunchTime && 'Lunch time (11 AM - 4 PM)'}
            {isDinnerTime && 'Dinner time (6 PM - 11 PM)'}
            {!isLunchTime && !isDinnerTime && 'Order for next meal'}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/meal-builder/lunch">
            <Button size="lg" className="w-full sm:w-auto">
              Build Lunch Thali
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/meal-builder/dinner">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Build Dinner Thali
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Today's Menu Preview */}
      {currentMenu && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Today's {currentMeal === 'lunch' ? 'Lunch' : 'Dinner'} Menu
            </h2>
            <p className="text-neutral-600">
              Fresh ingredients, authentic flavors
            </p>
          </div>

          <Card className="p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Menu Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Available Sabjis
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-neutral-600">Fresh today</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentMenu.listOfSabjis.slice(0, 4).map((sabji, index) => (
                    <motion.div
                      key={sabji.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50"
                    >
                      <img
                        src={sabji.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                        alt={sabji.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {sabji.name}
                        </p>
                        {sabji.isSpecial && (
                          <span className="text-xs text-primary-600 font-medium">
                            Special
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Starting from</p>
                    <p className="text-2xl font-bold text-primary-500">
                      {formatPrice(currentMenu.basePrice)}
                    </p>
                  </div>
                  <Link to={`/meal-builder/${currentMeal}`}>
                    <Button>
                      Customize Thali
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 p-8 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1"
                    alt="Fresh Thali"
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Fresh Today
                </div>
              </div>
            </div>
          </Card>
        </motion.section>
      )}

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-primary-500" />
          </div>
          <h3 className="font-semibold text-neutral-900 mb-2">Quick Delivery</h3>
          <p className="text-sm text-neutral-600">
            Fresh meals delivered within 30 minutes to your location
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-primary-500" />
          </div>
          <h3 className="font-semibold text-neutral-900 mb-2">Fresh Ingredients</h3>
          <p className="text-sm text-neutral-600">
            Made with the freshest ingredients sourced daily from local markets
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="h-6 w-6 text-primary-500" />
          </div>
          <h3 className="font-semibold text-neutral-900 mb-2">Easy Ordering</h3>
          <p className="text-sm text-neutral-600">
            Simple 3-step process to customize and order your perfect thali
          </p>
        </Card>
      </motion.section>
    </div>
  );
};

export default Home;