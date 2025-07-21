import React, { useState } from 'react';
import { Heart, Bookmark, Clock, Star, IndianRupee, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Cart } from './Cart';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number;
}

interface FoodCardProps {
  food: FoodItem;
  showActions?: boolean;
}

export function FoodCard({ food, showActions = true }: FoodCardProps) {
  const { user, addToFavorites, removeFromFavorites, addToWishlist, removeFromWishlist } = useAuth();
  const [showCart, setShowCart] = useState(false);
  
  const isFavorite = user?.favorites.includes(food.id) || false;
  const isInWishlist = user?.wishlist.includes(food.id) || false;

  const handleFavoriteToggle = () => {
    if (!user) return;
    
    if (isFavorite) {
      removeFromFavorites(food.id);
    } else {
      addToFavorites(food.id);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) return;
    
    if (isInWishlist) {
      removeFromWishlist(food.id);
    } else {
      addToWishlist(food.id);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    setShowCart(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <img 
            src={food.image} 
            alt={food.name}
            className="w-full h-48 object-cover"
          />
          {!food.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              food.isVeg ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {food.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>
          {showActions && user && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-500'
                }`}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full transition-colors ${
                  isInWishlist 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-500'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{food.name}</h3>
            <div className="flex items-center text-xl font-bold text-black dark:text-white">
              <IndianRupee className="w-5 h-5" />
              <span>{food.price}</span>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{food.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{food.rating}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{food.preparationTime} min</span>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {food.category}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
              food.isAvailable
                ? 'bg-gradient-to-r from-black to-gray-800 dark:from-gray-700 dark:to-black text-white hover:from-gray-800 hover:to-black dark:hover:from-gray-600 dark:hover:to-gray-900'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            disabled={!food.isAvailable}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{food.isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}