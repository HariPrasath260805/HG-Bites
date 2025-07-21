import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Star, Clock, Leaf, Flame, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories, mockFoodItems } from '../data/mockData';
import { FoodItem } from '../types';

const Menu: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  // Load food items from localStorage or mock data
  useEffect(() => {
    const savedItems = localStorage.getItem('hg-bites-food-items');
    if (savedItems) {
      setFoodItems(JSON.parse(savedItems));
    } else {
      // If no saved items, load from mock data and save to localStorage
      setFoodItems(mockFoodItems);
      localStorage.setItem('hg-bites-food-items', JSON.stringify(mockFoodItems));
    }
  }, []);

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, foodItems]);

  const handleAddToCart = (foodItem: FoodItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: { foodItem, quantity: 1 } });
  };

  const handleToggleWishlist = (foodItem: FoodItem) => {
    const isInWishlist = state.wishlist.some(item => item.foodItem.id === foodItem.id);
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: foodItem.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: foodItem });
    }
  };

  const isInWishlist = (foodItemId: string) => {
    return state.wishlist.some(item => item.foodItem.id === foodItemId);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Discover our delicious selection of carefully crafted dishes made with the finest ingredients.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex space-x-1">
                  {item.isVegetarian && (
                    <span className="bg-green-500 text-white p-1 rounded-full">
                      <Leaf className="w-4 h-4" />
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="bg-red-500 text-white p-1 rounded-full">
                      <Flame className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleToggleWishlist(item)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-md hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isInWishlist(item.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-neutral-400'
                    }`} 
                  />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.rating}
                    </span>
                  </div>
                </div>

                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <Clock className="w-4 h-4" />
                    <span>{item.preparationTime}</span>
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.calories} cal
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-500">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              No dishes found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;