import React from 'react';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Orders: React.FC = () => {
  const { state } = useApp();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'out-for-delivery':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'preparing':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'out-for-delivery':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'delivered':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (state.orders.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              No Orders Yet
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Your order history will appear here once you place your first order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
          Your Orders
        </h1>

        <div className="space-y-6">
          {state.orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Order #{order.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-300">
                        {item.foodItem.name} x {item.quantity}
                      </span>
                      <span className="text-neutral-900 dark:text-white">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    <p>Delivery to: {order.deliveryAddress}</p>
                    <p>Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary-500">₹{order.totalAmount}</p>
                    {order.status !== 'delivered' && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Est. delivery: {new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;