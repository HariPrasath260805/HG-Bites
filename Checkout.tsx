import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

const Checkout: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    phone: '',
    address: '',
    paymentMethod: 'cod' as 'cod' | 'online'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = state.cart.reduce((total, item) => total + item.totalPrice, 0);
  const tax = Math.round(subtotal * 0.05);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOrder: Order = {
        id: Date.now().toString(),
        userId: state.user!.id,
        items: state.cart,
        totalAmount: total,
        status: 'pending',
        deliveryAddress: formData.address,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        paymentMethod: formData.paymentMethod,
        customerName: formData.name,
        customerPhone: formData.phone
      };

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      dispatch({ type: 'CLEAR_CART' });

      // Simulate order status updates
      setTimeout(() => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: newOrder.id, status: 'confirmed' } });
      }, 5000);

      setTimeout(() => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: newOrder.id, status: 'preparing' } });
      }, 10000);

      setTimeout(() => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: newOrder.id, status: 'out-for-delivery' } });
      }, 20000);

      navigate('/orders');
    } catch (error) {
      console.error('Order processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (state.cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-neutral-400 w-5 h-5" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        placeholder="Enter your complete delivery address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <CreditCard className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-900 dark:text-white">Cash on Delivery</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      disabled
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <CreditCard className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-900 dark:text-white">Online Payment (Coming Soon)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing Order...' : `Place Order - ₹${total}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {state.cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-300">
                    {item.foodItem.name} x {item.quantity}
                  </span>
                  <span className="text-neutral-900 dark:text-white">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-300">Subtotal</span>
                <span className="text-neutral-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-300">GST (5%)</span>
                <span className="text-neutral-900 dark:text-white">₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-300">Delivery</span>
                <span className="text-neutral-900 dark:text-white">
                  {delivery === 0 ? 'Free' : `₹${delivery}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Total</span>
                <span className="text-primary-500">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;