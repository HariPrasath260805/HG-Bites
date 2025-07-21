import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Eye, EyeOff, Mail, Lock, Shield, UserPlus } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  
  // Registration form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [regError, setRegError] = useState('');
  
  const { adminLogin, adminRegister, registeredAdmins } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await adminLogin(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegError('');

    if (regData.password !== regData.confirmPassword) {
      setRegError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (regData.password.length < 8) {
      setRegError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const result = await adminRegister({
        name: regData.name,
        email: regData.email,
        password: regData.password
      });
      
      if (result.success) {
        setShowRegister(false);
        setRegData({ name: '', email: '', password: '', confirmPassword: '' });
        setError('Admin registered successfully! You can now login.');
      } else {
        setRegError(result.message);
      }
    } catch (err) {
      setRegError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {isLoading && <LoadingSpinner />}
      
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-black to-gray-800 dark:from-gray-700 dark:to-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {showRegister ? 'Register Admin' : 'Zuvai Admin Portal'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {showRegister ? 'Create new admin account' : 'Secure administrative access'}
            </p>
          </div>

          {!showRegister ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Admin email address"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className={`text-sm text-center p-3 rounded-lg ${
                  error.includes('successfully') 
                    ? 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-200' 
                    : 'text-red-500 bg-red-50 dark:bg-red-900'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-black to-gray-800 dark:from-gray-700 dark:to-black text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-black dark:hover:from-gray-600 dark:hover:to-gray-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                Access Admin Panel
              </button>
            </form>
          ) : (
            // Registration Form
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="Admin full name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="Admin email address"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  placeholder="Password (min 8 characters)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>

              {regError && (
                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900 p-3 rounded-lg">
                  {regError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || registeredAdmins.length >= 2}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {registeredAdmins.length >= 2 ? 'Admin Slots Full' : 'Register Admin'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            {registeredAdmins.length < 2 && (
              <button
                onClick={() => {
                  setShowRegister(!showRegister);
                  setError('');
                  setRegError('');
                }}
                className="flex items-center space-x-2 mx-auto text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>{showRegister ? 'Back to Login' : 'Register New Admin'}</span>
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              ← Back to User Login
            </Link>
          </div>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Admin Slots: {registeredAdmins.length}/2 Used
              </p>
              <div className="text-xs bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-1">
                {registeredAdmins.map((admin, index) => (
                  <p key={admin.id}>
                    <strong>Admin {index + 1}:</strong> {admin.email}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}