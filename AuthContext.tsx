import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  addresses: Address[];
  favorites: string[];
  wishlist: string[];
  orders: Order[];
}

interface Address {
  id: string;
  title: string;
  fullAddress: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'out-for-delivery' | 'delivered';
  orderDate: string;
  deliveryAddress: string;
  estimatedTime: number;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  currentAdmin: Admin | null;
  registeredUsers: User[];
  registeredAdmins: Admin[];
  allOrders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminRegister: (adminData: { email: string; password: string; name: string }) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<User>) => void;
  addToFavorites: (itemId: string) => void;
  removeFromFavorites: (itemId: string) => void;
  addToWishlist: (itemId: string) => void;
  removeFromWishlist: (itemId: string) => void;
  placeOrder: (items: OrderItem[], total: number, address: string) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Admin Credentials - Only 2 slots available
const INITIAL_ADMINS: Admin[] = [
  { 
    id: '1', 
    email: 'owner1@zuvai.com', 
    password: 'zuvai2024@owner1', 
    name: 'Zuvai Owner 1',
    registeredAt: new Date().toISOString()
  },
  { 
    id: '2', 
    email: 'owner2@zuvai.com', 
    password: 'zuvai2024@owner2', 
    name: 'Zuvai Owner 2',
    registeredAt: new Date().toISOString()
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [registeredAdmins, setRegisteredAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedUser = localStorage.getItem('zuvai_user');
    const savedAdmin = localStorage.getItem('zuvai_admin');
    const savedCurrentAdmin = localStorage.getItem('zuvai_current_admin');
    const savedUsers = localStorage.getItem('zuvai_registered_users');
    const savedAdmins = localStorage.getItem('zuvai_registered_admins');
    const savedOrders = localStorage.getItem('zuvai_all_orders');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdmin) {
      setIsAdmin(JSON.parse(savedAdmin));
    }
    if (savedCurrentAdmin) {
      setCurrentAdmin(JSON.parse(savedCurrentAdmin));
    }
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
    if (savedAdmins) {
      setRegisteredAdmins(JSON.parse(savedAdmins));
    } else {
      localStorage.setItem('zuvai_registered_admins', JSON.stringify(INITIAL_ADMINS));
    }
    if (savedOrders) {
      setAllOrders(JSON.parse(savedOrders));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in registered users
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
      // In a real app, you'd verify the password here
      setUser(existingUser);
      localStorage.setItem('zuvai_user', JSON.stringify(existingUser));
      return true;
    }

    // Demo user fallback
    if (email === 'user@demo.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo-1',
        name: 'Demo User',
        email: 'user@demo.com',
        addresses: [{
          id: '1',
          title: 'Home',
          fullAddress: '123 Demo Street, Demo City, 12345',
          isDefault: true
        }],
        favorites: [],
        wishlist: [],
        orders: []
      };
      setUser(demoUser);
      localStorage.setItem('zuvai_user', JSON.stringify(demoUser));
      return true;
    }
    
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const emailExists = registeredUsers.some(u => u.email === userData.email);
    if (emailExists) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      profilePhoto: userData.profilePhoto,
      addresses: userData.addresses || [],
      favorites: [],
      wishlist: [],
      orders: []
    };
    
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('zuvai_registered_users', JSON.stringify(updatedUsers));
    
    setUser(newUser);
    localStorage.setItem('zuvai_user', JSON.stringify(newUser));
    return true;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const admin = registeredAdmins.find(
      admin => admin.email === email && admin.password === password
    );
    
    if (admin) {
      setIsAdmin(true);
      setCurrentAdmin(admin);
      localStorage.setItem('zuvai_admin', 'true');
      localStorage.setItem('zuvai_current_admin', JSON.stringify(admin));
      return true;
    }
    return false;
  };

  const adminRegister = async (adminData: { email: string; password: string; name: string }): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if already 2 admins registered
    if (registeredAdmins.length >= 2) {
      return { success: false, message: 'Maximum admin limit reached. Only 2 admins allowed.' };
    }
    
    // Check if email already exists
    const emailExists = registeredAdmins.some(admin => admin.email === adminData.email);
    if (emailExists) {
      return { success: false, message: 'Admin with this email already exists.' };
    }
    
    const newAdmin: Admin = {
      id: Date.now().toString(),
      email: adminData.email,
      password: adminData.password,
      name: adminData.name,
      registeredAt: new Date().toISOString()
    };
    
    const updatedAdmins = [...registeredAdmins, newAdmin];
    setRegisteredAdmins(updatedAdmins);
    localStorage.setItem('zuvai_registered_admins', JSON.stringify(updatedAdmins));
    
    return { success: true, message: 'Admin registered successfully!' };
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentAdmin(null);
    localStorage.removeItem('zuvai_user');
    localStorage.removeItem('zuvai_admin');
    localStorage.removeItem('zuvai_current_admin');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('zuvai_user', JSON.stringify(updatedUser));
      
      // Update in registered users list
      const updatedUsers = registeredUsers.map(u => 
        u.id === user.id ? updatedUser : u
      );
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('zuvai_registered_users', JSON.stringify(updatedUsers));
    }
  };

  const addToFavorites = (itemId: string) => {
    if (user && !user.favorites.includes(itemId)) {
      const updatedUser = {
        ...user,
        favorites: [...user.favorites, itemId]
      };
      updateProfile(updatedUser);
    }
  };

  const removeFromFavorites = (itemId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        favorites: user.favorites.filter(id => id !== itemId)
      };
      updateProfile(updatedUser);
    }
  };

  const addToWishlist = (itemId: string) => {
    if (user && !user.wishlist.includes(itemId)) {
      const updatedUser = {
        ...user,
        wishlist: [...user.wishlist, itemId]
      };
      updateProfile(updatedUser);
    }
  };

  const removeFromWishlist = (itemId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        wishlist: user.wishlist.filter(id => id !== itemId)
      };
      updateProfile(updatedUser);
    }
  };

  const placeOrder = (items: OrderItem[], total: number, address: string): string => {
    if (!user) return '';
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total,
      status: 'pending',
      orderDate: new Date().toISOString(),
      deliveryAddress: address,
      estimatedTime: 30 + Math.floor(Math.random() * 20) // 30-50 minutes
    };
    
    // Add to user's orders
    const updatedUser = {
      ...user,
      orders: [...user.orders, newOrder]
    };
    updateProfile(updatedUser);
    
    // Add to all orders for admin
    const updatedAllOrders = [...allOrders, { ...newOrder, userId: user.id, userName: user.name }];
    setAllOrders(updatedAllOrders);
    localStorage.setItem('zuvai_all_orders', JSON.stringify(updatedAllOrders));
    
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    // Update in all orders
    const updatedAllOrders = allOrders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setAllOrders(updatedAllOrders);
    localStorage.setItem('zuvai_all_orders', JSON.stringify(updatedAllOrders));
    
    // Update in user's orders if current user has this order
    if (user) {
      const updatedUser = {
        ...user,
        orders: user.orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      };
      updateProfile(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      currentAdmin,
      registeredUsers,
      registeredAdmins,
      allOrders,
      login,
      register,
      logout,
      adminLogin,
      adminRegister,
      updateProfile,
      addToFavorites,
      removeFromFavorites,
      addToWishlist,
      removeFromWishlist,
      placeOrder,
      updateOrderStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}