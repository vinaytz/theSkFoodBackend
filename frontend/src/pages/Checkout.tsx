import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCart } from '@/hooks/useCart';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/hooks/useToast';
import { formatPrice } from '@/utils/formatters';
import { isWithinDeliveryRadius } from '@/utils/validators';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartSummary, clearCart } = useCart();
  const { coords, isLoading: locationLoading, getCurrentLocation } = useGeolocation();
  const { toast } = useToast();

  const [deliveryMode, setDeliveryMode] = useState<'location' | 'manual'>('location');
  const [manualAddress, setManualAddress] = useState({
    hostel: '',
    room: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { grandTotal } = getCartSummary();

  const handleLocationDelivery = () => {
    if (!coords) {
      getCurrentLocation();
      return;
    }

    // Check delivery radius
    if (!isWithinDeliveryRadius(coords.lat, coords.lng)) {
      toast.error('Outside delivery area', 'We currently deliver within 2km radius only');
      return;
    }

    processOrder();
  };

  const handleManualDelivery = () => {
    if (!manualAddress.hostel.trim() || !manualAddress.room.trim() || !manualAddress.phone.trim()) {
      toast.error('Missing information', 'Please fill all delivery details');
      return;
    }

    processOrder();
  };

  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect
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
      <div className="container-padding mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/')}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-padding mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Checkout
            </h1>
            <p className="text-neutral-600">
              Complete your order details
            </p>
          </div>

          {/* Delivery Location */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-500" />
              Delivery Location
            </h2>

            <div className="space-y-4">
              {/* Location Mode Toggle */}
              <div className="flex space-x-4">
                <Button
                  variant={deliveryMode === 'location' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setDeliveryMode('location')}
                  className="flex items-center space-x-2"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Use My Location</span>
                </Button>
                <Button
                  variant={deliveryMode === 'manual' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setDeliveryMode('manual')}
                >
                  Manual Entry
                </Button>
              </div>

              {/* Location Mode */}
              {deliveryMode === 'location' && (
                <div className="space-y-4">
                  {coords ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-800">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">Location detected</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Within delivery radius
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={getCurrentLocation}
                      isLoading={locationLoading}
                      className="w-full"
                    >
                      {locationLoading ? 'Getting Location...' : 'Get My Location'}
                    </Button>
                  )}
                </div>
              )}

              {/* Manual Mode */}
              {deliveryMode === 'manual' && (
                <div className="space-y-4">
                  <Input
                    label="Hostel/Building"
                    value={manualAddress.hostel}
                    onChange={(e) => setManualAddress(prev => ({ ...prev, hostel: e.target.value }))}
                    placeholder="e.g., Hostel A, PG Name"
                  />
                  <Input
                    label="Room/Floor"
                    value={manualAddress.room}
                    onChange={(e) => setManualAddress(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., Room 201, Floor 2"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={manualAddress.phone}
                    onChange={(e) => setManualAddress(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your contact number"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900 capitalize">
                      {item.mealType} Thali × {item.quantity}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {item.sabjisSelected.join(', ')}
                    </p>
                  </div>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(item.totalPrice * item.quantity)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-neutral-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span>₹20</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax (5%)</span>
                  <span>₹{Math.round(grandTotal * 0.05)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-neutral-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary-500" />
              Payment
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-primary-200 bg-primary-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-primary-900">Pay with Razorpay</h3>
                    <p className="text-sm text-primary-700">Secure online payment</p>
                  </div>
                  <div className="text-primary-600 font-bold">
                    {formatPrice(grandTotal)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-100 rounded-lg opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-700">Cash on Delivery</h3>
                    <p className="text-sm text-neutral-600">Pay when delivered</p>
                  </div>
                  <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Time */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Estimated delivery: 25-30 minutes
              </span>
            </div>
          </Card>

          {/* Place Order Button */}
          <Button
            onClick={deliveryMode === 'location' ? handleLocationDelivery : handleManualDelivery}
            isLoading={isProcessing}
            disabled={isProcessing || (deliveryMode === 'location' && !coords)}
            className="w-full h-12 text-lg"
          >
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(grandTotal)} - Razorpay`}
          </Button>

          <div className="text-center text-xs text-neutral-500">
            🔒 Your payment information is secure and encrypted
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;