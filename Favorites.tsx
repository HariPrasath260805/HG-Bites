import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { FoodCard } from '../components/FoodCard';
import { Heart } from 'lucide-react';

export function Favorites() {
  const { user } = useAuth();
  const { foods } = useFood();

  if (!user) return null;

  const favoriteFoods = foods.filter(food => user.favorites.includes(food.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Your Favorites</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">All your loved dishes in one place</p>
        </div>

        {favoriteFoods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favoriteFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">No favorites yet</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-8">
              Start adding dishes to your favorites by clicking the heart icon on any dish.
            </p>
            <a
              href="/menu"
              className="inline-block bg-gradient-to-r from-black to-gray-800 dark:from-gray-700 dark:to-black text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-800 hover:to-black dark:hover:from-gray-600 dark:hover:to-gray-900 transition-all transform hover:scale-105"
            >
              Browse Menu
            </a>
          </div>
        )}
      </div>
    </div>
  );
}