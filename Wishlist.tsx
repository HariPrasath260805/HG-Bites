import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Wishlist: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleRemoveFromWishlist = (foodItemId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: foodItemId });
  };

  const handleAddToCart = (foodItem: any) => {
    dispatch({ type: 'ADD_TO_CART', payload: { foodItem, quantity: 1 } });
  };

  if (state.wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
              Save your favorite dishes to your wishlist for easy ordering later.
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
          Your Wishlist ({state.wishlist.length} items)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.wishlist.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div className="relative">
                <img
                  src={item.foodItem.image}
                  alt={item.foodItem.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.foodItem.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-md hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {item.foodItem.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
                  {item.foodItem.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-500">
                    ₹{item.foodItem.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item.foodItem)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;