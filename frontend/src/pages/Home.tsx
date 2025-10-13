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

  return (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="container-padding mx-auto py-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-lg text-neutral-700 mb-1">
            Oh Hello paaji..
          </h1>
          <h2 className="text-xl font-semibold text-neutral-900">
            {isLunchTime ? 'Lunch Time!!' : 'Hello Vinay, Lunch Time!!'}
          </h2>
        </motion.div>

        {/* Hero Image with Person */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Craving some authentic homestyle meals?<br/>
                  We've got you covered with fresh,<br/>
                  delicious thalis made with love.<br/>
                  Perfect for students and working<br/>
                  professionals who miss home food.
                </p>
              </div>
              <div className="w-24 h-24 ml-4">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1"
                  alt="Chef"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meal Type Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-3 mb-6"
        >
          <Link to="/meal-builder/lunch" className="flex-1">
            <button className="w-full bg-neutral-800 text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-neutral-700 transition-colors">
              Lunch
            </button>
          </Link>
          <Link to="/meal-builder/dinner" className="flex-1">
            <button className="w-full bg-neutral-800 text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-neutral-700 transition-colors">
              Dinner
            </button>
          </Link>
        </motion.div>

        {/* Today's Fresh Meal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              Today's Fresh
            </h3>
            <h4 className="text-lg font-semibold text-primary-500">
              Home-Style Meal
            </h4>
            <p className="text-sm text-neutral-600 mt-2">
              Authentic Indian thali delivered to your hostel
            </p>
          </div>

          {/* Food Image */}
          <div className="relative mb-4">
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1"
              alt="Fresh Thali"
              className="w-full h-40 object-cover rounded-2xl"
            />
          </div>

          {/* Price and Details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold text-neutral-900">₹120</div>
              <div className="flex items-center space-x-1 text-sm text-neutral-600">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.8 (284 reviews)</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Clock className="h-4 w-4" />
                <span>30-40 min delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <span>🍽️</span>
                <span>Popular with students</span>
              </div>
            </div>

            <Link to="/meal-builder/lunch">
              <button className="w-full bg-primary-500 text-white py-3 px-6 rounded-full font-medium hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                <span>Build Your Thali</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Most Popular Combo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Most Popular Combo
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&dpr=1"
                alt="Combo 1"
                className="w-full h-20 object-cover rounded-lg mb-2"
              />
              <p className="text-sm font-medium text-neutral-900">₹120</p>
              <p className="text-xs text-neutral-600">Dal + Sabji</p>
            </div>
            
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&dpr=1"
                alt="Combo 2"
                className="w-full h-20 object-cover rounded-lg mb-2"
              />
              <p className="text-sm font-medium text-neutral-900">₹140</p>
              <p className="text-xs text-neutral-600">Special Thali</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;