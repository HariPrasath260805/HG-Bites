import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Cart: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const handleCheckout = () => {
    if (!state.user) {
      navigate('/login');
      return;
    }
    setIsCheckingOut(true);
    navigate('/checkout');
  };

  const subtotal = state.cart.reduce((total, item) => total + item.totalPrice, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + delivery;

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
              Add some delicious items to your cart to get started.
            </p>
            <Link
              to="/menu"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>Browse Menu</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.cart.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 flex items-center space-x-4"
              >
                <img
                  src={item.foodItem.image}
                  alt={item.foodItem.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {item.foodItem.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    ₹{item.foodItem.price} each
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-neutral-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                    ₹{item.totalPrice}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-300">Subtotal</span>
                <span className="text-neutral-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-300">GST (5%)</span>
                <span className="text-neutral-900 dark:text-white">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-300">Delivery</span>
                <span className="text-neutral-900 dark:text-white">
                  {delivery === 0 ? 'Free' : `₹${delivery}`}
                </span>
              </div>
              {subtotal < 500 && (
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Add ₹{500 - subtotal} more for free delivery
                </div>
              )}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">Total</span>
                  <span className="text-lg font-semibold text-primary-500">₹{total}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors mt-6 disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <Link
              to="/menu"
              className="block text-center text-primary-500 hover:text-primary-600 transition-colors mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;