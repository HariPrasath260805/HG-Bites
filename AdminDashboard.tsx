import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import { 
  BarChart, 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  Upload,
  Clock,
  CheckCircle,
  Truck,
  Package
} from 'lucide-react';

export function AdminDashboard() {
  const { isAdmin, currentAdmin, allOrders, registeredUsers, updateOrderStatus } = useAuth();
  const { foods, addFood, updateFood, deleteFood, toggleAvailability } = useFood();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'foods' | 'orders' | 'users'>('overview');
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    rating: 4.0,
    isVeg: true,
    preparationTime: 15
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    addFood({
      ...newFood,
      isAvailable: true
    });
    setNewFood({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      rating: 4.0,
      isVeg: true,
      preparationTime: 15
    });
    setShowAddForm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFood({
          ...newFood,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  // Calculate stats
  const stats = {
    totalOrders: allOrders.length,
    totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0),
    totalCustomers: registeredUsers.length,
    totalFoods: foods.length,
    pendingOrders: allOrders.filter(order => order.status === 'pending').length,
    deliveredOrders: allOrders.filter(order => order.status === 'delivered').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'out-for-delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome, {currentAdmin?.name || 'Admin'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your premium food delivery platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart },
                { id: 'foods', label: 'Food Management', icon: ShoppingBag },
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'users', label: 'Users', icon: Users }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
                    <div className="flex items-center text-3xl font-bold text-gray-800 dark:text-gray-200">
                      <IndianRupee className="w-6 h-6" />
                      <span>{stats.totalRevenue}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.totalCustomers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Foods</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.totalFoods}</p>
                  </div>
                  <div className="w-12 h-12 bg-black dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {allOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items.length} items • ₹{order.total}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('-', ' ')}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Food Management Tab */}
        {activeTab === 'foods' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Food Management</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food</span>
              </button>
            </div>

            {/* Add Food Form */}
            {showAddForm && (
              <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Add New Food Item</h3>
                <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Food name"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    required
                  />
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      placeholder="Price in Rupees"
                      value={newFood.price}
                      onChange={(e) => setNewFood({ ...newFood, price: parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      required
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Preparation time (minutes)"
                    value={newFood.preparationTime}
                    onChange={(e) => setNewFood({ ...newFood, preparationTime: parseInt(e.target.value) })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    required
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Food Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>
                      {newFood.image && (
                        <img src={newFood.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                  </div>
                  <select
                    value={newFood.isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setNewFood({ ...newFood, isVeg: e.target.value === 'veg' })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                  <textarea
                    placeholder="Description"
                    value={newFood.description}
                    onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                    className="md:col-span-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    required
                  />
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Add Food</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Food List */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Food</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Category</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Price</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Status</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={food.image} 
                            alt={food.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{food.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{food.description.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-gray-800 dark:text-gray-200">{food.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center font-semibold text-gray-800 dark:text-gray-200">
                          <IndianRupee className="w-4 h-4" />
                          <span>{food.price}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          food.isAvailable 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {food.isAvailable ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleAvailability(food.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              food.isAvailable 
                                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900' 
                                : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900'
                            }`}
                            title={food.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                          >
                            {food.isAvailable ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteFood(food.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Order Management</h2>
            
            <div className="space-y-4">
              {allOrders.length > 0 ? (
                allOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Order #{order.id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Delivery: {order.deliveryAddress}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                          <IndianRupee className="w-5 h-5" />
                          <span>{order.total}</span>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 outline-none ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="out-for-delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Order Items:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-3">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                            <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">x{item.quantity}</span>
                          </div>
                          <div className="flex items-center text-gray-800 dark:text-gray-200">
                            <IndianRupee className="w-4 h-4" />
                            <span>{item.price * item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">User Management</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">User</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Email</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Orders</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Favorites</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-200">Wishlist</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.email}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.orders?.length || 0}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.favorites.length}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.wishlist.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {registeredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No registered users yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}