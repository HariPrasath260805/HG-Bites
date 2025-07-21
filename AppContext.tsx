import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, User, CartItem, FoodItem, Order, WishlistItem } from '../types';

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_TO_CART'; payload: { foodItem: FoodItem; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: FoodItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } };

const initialState: AppState = {
  user: null,
  cart: [],
  wishlist: [],
  orders: [],
  theme: 'light',
  isLoading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => {} });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.foodItem.id === action.payload.foodItem.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.foodItem.id === action.payload.foodItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity, totalPrice: (item.quantity + action.payload.quantity) * item.foodItem.price }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, {
          id: Date.now().toString(),
          foodItem: action.payload.foodItem,
          quantity: action.payload.quantity,
          totalPrice: action.payload.quantity * action.payload.foodItem.price
        }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity, totalPrice: action.payload.quantity * item.foodItem.price }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_TO_WISHLIST':
      const existingWishlistItem = state.wishlist.find(item => item.foodItem.id === action.payload.id);
      if (existingWishlistItem) return state;
      return {
        ...state,
        wishlist: [...state.wishlist, {
          id: Date.now().toString(),
          foodItem: action.payload,
          addedAt: new Date().toISOString()
        }]
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.foodItem.id !== action.payload)
      };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved data on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('hg-bites-user');
    const savedCart = localStorage.getItem('hg-bites-cart');
    const savedWishlist = localStorage.getItem('hg-bites-wishlist');
    const savedOrders = localStorage.getItem('hg-bites-orders');
    const savedTheme = localStorage.getItem('hg-bites-theme');

    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      cart.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: { foodItem: item.foodItem, quantity: item.quantity } });
      });
    }
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      wishlist.forEach((item: WishlistItem) => {
        dispatch({ type: 'ADD_TO_WISHLIST', payload: item.foodItem });
      });
    }
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      orders.forEach((order: Order) => {
        dispatch({ type: 'ADD_ORDER', payload: order });
      });
    }
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme as 'light' | 'dark' });
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('hg-bites-user', JSON.stringify(state.user));
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('hg-bites-cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('hg-bites-wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem('hg-bites-orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem('hg-bites-theme', state.theme);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};