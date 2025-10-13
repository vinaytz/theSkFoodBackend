import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CircleCheck as CheckCircle, RotateCcw, Copy } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useMyOrders } from '@/services/queries';
import { formatPrice, formatDateTime } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'delivered'>('active');
  const { data: orders = [], isLoading } = useMyOrders();
  const { toast } = useToast();

  const activeOrders = orders.filter(order => order.status !== 'delivered');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'on-the-way':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'Order Confirmed';
      case 'on-the-way':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'on-the-way':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const copyOTP = (otp: string) => {
    navigator.clipboard.writeText(otp);
    toast.success('OTP Copied!', 'Share this with the delivery person');
  };

  const handleReorder = (order: any) => {
    // This would typically add the same items to cart
    toast.info('Reorder feature', 'Coming soon!');
  };

  if (isLoading) {
    return (
      <div className="container-padding mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-padding mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            My Orders
          </h1>
          <p className="text-neutral-600">
            Track your orders and view history
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
              activeTab === 'active'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            On the Way ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={cn(
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
              activeTab === 'delivered'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            Delivered ({deliveredOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {activeTab === 'active' && (
            <>
              {activeOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No active orders
                  </h3>
                  <p className="text-neutral-600">
                    Your current orders will appear here
                  </p>
                </Card>
              ) : (
                activeOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(order.status)}
                            <span className={cn(
                              'text-sm font-medium px-2 py-1 rounded-full border',
                              getStatusColor(order.status)
                            )}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-neutral-900">
                            {formatPrice(order.totalPrice)}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Qty: {order.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-neutral-900">
                          <span className="font-medium">Sabjis:</span> {order.sabjisSelected.join(', ')}
                        </p>
                        <p className="text-sm text-neutral-900">
                          <span className="font-medium">Base:</span> {order.base}
                          {order.extraRoti > 0 && ` + ${order.extraRoti} extra roti`}
                        </p>
                        {order.isSpecial && (
                          <p className="text-sm text-primary-600">
                            + Special Paneer
                          </p>
                        )}
                      </div>

                      {/* OTP for on-the-way orders */}
                      {order.status === 'on-the-way' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-900">
                                Delivery OTP
                              </p>
                              <p className="text-xs text-orange-700">
                                Share this with delivery person
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-orange-600 font-mono">
                                {order.otp}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyOTP(order.otp)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-neutral-600">
                          <p>📍 {order.address.label}</p>
                          <p>{order.address.address}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                          className="flex items-center space-x-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Reorder</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </>
          )}

          {activeTab === 'delivered' && (
            <>
              {deliveredOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No delivered orders
                  </h3>
                  <p className="text-neutral-600">
                    Your order history will appear here
                  </p>
                </Card>
              ) : (
                deliveredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(order.status)}
                            <span className={cn(
                              'text-sm font-medium px-2 py-1 rounded-full border',
                              getStatusColor(order.status)
                            )}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-neutral-900">
                            {formatPrice(order.totalPrice)}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Qty: {order.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-neutral-900">
                          <span className="font-medium">Sabjis:</span> {order.sabjisSelected.join(', ')}
                        </p>
                        <p className="text-sm text-neutral-900">
                          <span className="font-medium">Base:</span> {order.base}
                          {order.extraRoti > 0 && ` + ${order.extraRoti} extra roti`}
                        </p>
                        {order.isSpecial && (
                          <p className="text-sm text-primary-600">
                            + Special Paneer
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-neutral-600">
                          <p>📍 {order.address.label}</p>
                          <p>{order.address.address}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                          className="flex items-center space-x-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Reorder</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Orders;