import { FoodItem, User } from '../types';

export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
    price: 299,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pizza',
    rating: 4.8,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: '20-25 min',
    ingredients: ['Tomato sauce', 'Fresh mozzarella', 'Fresh basil', 'Olive oil'],
    calories: 220,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken breast with lettuce, tomato, and our special sauce',
    price: 249,
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Burgers',
    rating: 4.6,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: '15-20 min',
    ingredients: ['Chicken breast', 'Lettuce', 'Tomato', 'Special sauce', 'Brioche bun'],
    calories: 450,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing',
    price: 199,
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Salads',
    rating: 4.4,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: '10-15 min',
    ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing'],
    calories: 180,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Spicy Pad Thai',
    description: 'Traditional Thai stir-fried noodles with vegetables and spicy sauce',
    price: 279,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Asian',
    rating: 4.7,
    isVegetarian: false,
    isSpicy: true,
    preparationTime: '18-22 min',
    ingredients: ['Rice noodles', 'Vegetables', 'Spicy sauce', 'Herbs'],
    calories: 380,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Chocolate Lava Cake',
    description: 'Decadent chocolate cake with a molten center, served with vanilla ice cream',
    price: 149,
    image: 'https://images.pexels.com/photos/1639564/pexels-photo-1639564.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Desserts',
    rating: 4.9,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: '12-15 min',
    ingredients: ['Dark chocolate', 'Vanilla ice cream', 'Butter', 'Eggs'],
    calories: 320,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Fresh Fruit Smoothie',
    description: 'Blend of fresh seasonal fruits with yogurt and honey',
    price: 129,
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Beverages',
    rating: 4.5,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: '5-8 min',
    ingredients: ['Fresh fruits', 'Yogurt', 'Honey', 'Ice'],
    calories: 150,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'BBQ Ribs',
    description: 'Tender pork ribs with our signature BBQ sauce',
    price: 399,
    image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'BBQ',
    rating: 4.8,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: '30-35 min',
    ingredients: ['Pork ribs', 'BBQ sauce', 'Spices', 'Herbs'],
    calories: 520,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Seafood Pasta',
    description: 'Fresh seafood with linguine in a creamy white wine sauce',
    price: 349,
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pasta',
    rating: 4.6,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: '25-30 min',
    ingredients: ['Linguine', 'Fresh seafood', 'White wine sauce', 'Herbs'],
    calories: 480,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockAdminUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@hgbites.com',
    name: 'Head Chef Admin',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'admin2',
    email: 'manager@hgbites.com',
    name: 'Restaurant Manager',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const categories = [
  'All',
  'Pizza',
  'Burgers',
  'Salads',
  'Asian',
  'Desserts',
  'Beverages',
  'BBQ',
  'Pasta'
];