import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockAdminUsers } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';

const Login: React.FC = () => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (loginType === 'admin') {
        // Check if it's an admin user from mock data
        const adminUser = mockAdminUsers.find(admin => admin.email === formData.email);
        
        if (adminUser && formData.password === 'admin123') {
          dispatch({ type: 'SET_USER', payload: adminUser });
          navigate('/admin');
          return;
        }

        // Also check localStorage for registered admin users
        const users = JSON.parse(localStorage.getItem('hg-bites-users') || '[]');
        const registeredAdmin = users.find((u: any) => u.email === formData.email && u.role === 'admin');

        if (registeredAdmin && registeredAdmin.password === formData.password) {
          const { password, ...userWithoutPassword } = registeredAdmin;
          dispatch({ type: 'SET_USER', payload: userWithoutPassword });
          navigate('/admin');
          return;
        }

        setError('Invalid admin credentials. Use admin@hgbites.com / admin123 or manager@hgbites.com / admin123');
      } else {
        // Check regular users from localStorage
        const users = JSON.parse(localStorage.getItem('hg-bites-users') || '[]');
        const user = users.find((u: any) => u.email === formData.email && u.role !== 'admin');

        if (user && user.password === formData.password) {
          const { password, ...userWithoutPassword } = user;
          dispatch({ type: 'SET_USER', payload: userWithoutPassword });
          navigate('/');
          return;
        }

        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <LoadingSpinner size="large" message="Signing you in..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-neutral-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-500 hover:text-primary-400">
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex bg-neutral-200 dark:bg-neutral-700 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setLoginType('user');
              setError('');
              setFormData({ email: '', password: '' });
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'user'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>User Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('admin');
              setError('');
              setFormData({ email: '', password: '' });
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'admin'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Login</span>
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-neutral-800"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-neutral-800"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <div className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Sign in as {loginType === 'admin' ? 'Admin' : 'User'}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Demo credentials:
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1">
              {loginType === 'admin' ? (
                <>
                  <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                    <div><strong>Admin:</strong> admin@hgbites.com / admin123</div>
                    <div><strong>Manager:</strong> manager@hgbites.com / admin123</div>
                  </div>
                </>
              ) : (
                <div>Create a new user account or use admin login</div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;