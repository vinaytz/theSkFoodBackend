import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Navigation, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/hooks/useToast';
import { formatPrice } from '@/utils/formatters';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartSummary, clearCart } = useCart();
  const { coords, isLoading: locationLoading, getCurrentLocation } = useGeolocation();
  const { toast } = useToast();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { grandTotal } = getCartSummary();

  const savedAddresses = [
    { id: 'hostel-a', name: 'Hostel A', address: 'Hostel A, Room 101' },
    { id: 'hostel-b', name: 'Hostel B', address: 'Hostel B, Room 205' },
  ];

  const handleLocationDelivery = () => {
    if (!coords) {
      getCurrentLocation();
      return;
    }
    processOrder();
  };

  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      toast.success('Order placed!', 'Your delicious meal is being prepared');
      navigate('/orders');
    } catch (error) {
      toast.error('Payment failed', 'Please try again');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-neutral-900 mb-4">Your cart is empty</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-neutral-800 text-white py-2 px-6 rounded-full"
          >
            Browse Menu
          </button>
        </div>
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
                onClick={() => navigate(-1)}
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
              Delivery Address
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container-padding mx-auto py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Use Current Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={handleLocationDelivery}
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <Navigation className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-neutral-900">Use My Current Location</h3>
                <p className="text-sm text-neutral-600">We'll detect your location automatically</p>
              </div>
            </button>
          </motion.div>

          {/* Or Divider */}
          <div className="text-center">
            <span className="text-sm text-neutral-500">or</span>
          </div>

          {/* Add Address Manually */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <Plus className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-neutral-900">Add Address Manually</h3>
              </div>
            </button>
          </motion.div>

          {/* Saved Addresses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900">Saved Addresses</h3>
            
            {savedAddresses.map((address) => (
              <button
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
                className={`
                  w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left
                  ${selectedAddress === address.id ? 'ring-2 ring-neutral-800' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">{address.name}</h4>
                    <p className="text-sm text-neutral-600">{address.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Proceed Button */}
          <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
            <button
              onClick={processOrder}
              disabled={isProcessing || (!coords && !selectedAddress)}
              className="w-full bg-neutral-800 text-white py-3 px-6 rounded-full font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;