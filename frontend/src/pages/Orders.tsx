import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, RotateCcw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMyOrders } from '@/services/queries';
import { formatPrice, formatTime } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'delivered'>('active');
  const [showOTP, setShowOTP] = useState<string | null>(null);
  const { data: orders = [], isLoading } = useMyOrders();
  const { toast } = useToast();

  const activeOrders = orders.filter(order => order.status !== 'delivered');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'on-the-way':
        return 'text-orange-600 bg-orange-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'Preparing';
      case 'on-the-way':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const toggleOTP = (orderId: string) => {
    setShowOTP(showOTP === orderId ? null : orderId);
  };

  const handleReorder = () => {
    toast.info('Reorder feature', 'Coming soon!');
  };

  if (isLoading) {
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
                onClick={() => navigate('/')}
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
              My Orders
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container-padding mx-auto py-6">
        <div className="max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-white p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'active'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              🕐 On the way ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={cn(
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'delivered'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              ✅ Delivered ({deliveredOrders.length})
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {activeTab === 'active' && (
              <>
                {activeOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No active orders
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      Your current orders will appear here
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-neutral-800 text-white py-2 px-6 rounded-full text-sm"
                    >
                      Order Now
                    </button>
                  </div>
                ) : (
                  activeOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-neutral-900">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Today at {formatTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            'text-xs font-medium px-2 py-1 rounded-full',
                            getStatusColor(order.status)
                          )}>
                            {getStatusText(order.status)}
                          </span>
                          <p className="text-lg font-bold text-neutral-900 mt-1">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Items</span>
                          <span className="font-medium">{order.quantity} Thali(s)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Sabjis</span>
                          <span className="text-neutral-900">{order.sabjisSelected.join(', ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Delivery ETA</span>
                          <span className="text-orange-600 font-medium">06:01 PM</span>
                        </div>
                      </div>

                      {/* OTP Section */}
                      {order.status === 'on-the-way' && (
                        <div className="bg-blue-50 rounded-xl p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-900">Delivery OTP</p>
                              <p className="text-xs text-blue-700">Show this to delivery partner</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600 font-mono">
                                {showOTP === order._id ? order.otp : '••••'}
                              </span>
                              <button
                                onClick={() => toggleOTP(order._id)}
                                className="p-1 hover:bg-blue-100 rounded"
                              >
                                {showOTP === order._id ? 
                                  <EyeOff className="h-4 w-4 text-blue-600" /> : 
                                  <Eye className="h-4 w-4 text-blue-600" />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleReorder}
                        className="w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reorder</span>
                      </button>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {activeTab === 'delivered' && (
              <>
                {deliveredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No delivered orders
                    </h3>
                    <p className="text-neutral-600">
                      Your order history will appear here
                    </p>
                  </div>
                ) : (
                  deliveredOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-neutral-900">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Today at {formatTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
                            Delivered
                          </span>
                          <p className="text-lg font-bold text-neutral-900 mt-1">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Items</span>
                          <span className="font-medium">{order.quantity} Thali(s)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Sabjis</span>
                          <span className="text-neutral-900">{order.sabjisSelected.join(', ')}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleReorder}
                        className="w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reorder</span>
                      </button>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </div>

          {/* New Order Button */}
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => navigate('/')}
              className="w-12 h-12 bg-neutral-800 text-white rounded-full shadow-lg hover:bg-neutral-700 transition-colors flex items-center justify-center"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;