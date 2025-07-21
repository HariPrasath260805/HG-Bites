import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface FoodContextType {
  foods: FoodItem[];
  categories: string[];
  addFood: (food: Omit<FoodItem, 'id'>) => void;
  updateFood: (id: string, food: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

const initialFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces',
    price: 299,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    category: 'Indian',
    rating: 4.8,
    isVeg: false,
    isAvailable: true,
    preparationTime: 25
  },
  {
    id: '2',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese in rich spiced tomato gravy',
    price: 249,
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    category: 'Indian',
    rating: 4.6,
    isVeg: true,
    isAvailable: true,
    preparationTime: 20
  },
  {
    id: '3',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with spiced chicken and herbs',
    price: 349,
    image: 'D:\zuvai website\project\biryani.jpeg',
    category: 'Biryani',
    rating: 4.9,
    isVeg: false,
    isAvailable: true,
    preparationTime: 35
  },
  {
    id: '4',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella, and basil',
    price: 199,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
    category: 'Pizza',
    rating: 4.5,
    isVeg: true,
    isAvailable: true,
    preparationTime: 15
  },
  {
    id: '5',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato curry',
    price: 129,
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    category: 'South Indian',
    rating: 4.7,
    isVeg: true,
    isAvailable: true,
    preparationTime: 12
  },
  {
    id: '6',
    name: 'Gulab Jamun',
    description: 'Sweet milk dumplings in cardamom-flavored syrup',
    price: 89,
    image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg',
    category: 'Desserts',
    rating: 4.8,
    isVeg: true,
    isAvailable: true,
    preparationTime: 5
  }
];

export function FoodProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    // Load foods from localStorage or use initial data
    const savedFoods = localStorage.getItem('zuvai_foods');
    if (savedFoods) {
      setFoods(JSON.parse(savedFoods));
    } else {
      setFoods(initialFoods);
      localStorage.setItem('zuvai_foods', JSON.stringify(initialFoods));
    }
  }, []);

  const saveFoods = (updatedFoods: FoodItem[]) => {
    setFoods(updatedFoods);
    localStorage.setItem('zuvai_foods', JSON.stringify(updatedFoods));
  };

  const categories = Array.from(new Set(foods.map(food => food.category)));

  const addFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: Date.now().toString()
    };
    const updatedFoods = [...foods, newFood];
    saveFoods(updatedFoods);
  };

  const updateFood = (id: string, updatedFood: Partial<FoodItem>) => {
    const updatedFoods = foods.map(food => 
      food.id === id ? { ...food, ...updatedFood } : food
    );
    saveFoods(updatedFoods);
  };

  const deleteFood = (id: string) => {
    const updatedFoods = foods.filter(food => food.id !== id);
    saveFoods(updatedFoods);
  };

  const toggleAvailability = (id: string) => {
    const updatedFoods = foods.map(food => 
      food.id === id ? { ...food, isAvailable: !food.isAvailable } : food
    );
    saveFoods(updatedFoods);
  };

  return (
    <FoodContext.Provider value={{
      foods,
      categories,
      addFood,
      updateFood,
      deleteFood,
      toggleAvailability
    }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
}