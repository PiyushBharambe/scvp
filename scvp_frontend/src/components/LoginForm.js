import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const LoginForm = ({ onSuccess }) => {
  const { isDark } = useTheme();
  const { register, login, loading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!isLogin && password !== confirmPassword) {
      return;
    }

    const result = isLogin 
      ? await login(email, password)
      : await register(email, password, organizationName);
    if (result.success && onSuccess) {
      onSuccess('Login successful!');
      // Force immediate reload to trigger dashboard
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOrganizationName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className={`absolute top-10 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
            isDark ? 'bg-purple-600' : 'bg-purple-300'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className={`absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
            isDark ? 'bg-cyan-600' : 'bg-yellow-300'
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className={`absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
            isDark ? 'bg-pink-600' : 'bg-pink-300'
          }`}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div 
        className={`glass-effect p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border backdrop-blur-xl float-animation ${
          isDark 
            ? 'border-slate-700/50 bg-slate-800/30' 
            : 'border-white/20 bg-white/25'
        }`}
      >
        <div className="text-center mb-8">
          <motion.div 
            className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg ${
              isDark 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          </motion.div>
          <motion.h2 
            className={`text-4xl font-black mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </motion.h2>
          <motion.p 
            className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Supply Chain Visibility Platform
          </motion.p>
        </div>

        {error && (
          <motion.p 
            className={`p-3 rounded-md mb-4 text-center ${
              isDark 
                ? 'bg-red-900/50 text-red-300 border border-red-700/50' 
                : 'bg-red-100 text-red-700'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label
                className={`block text-sm font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}
                htmlFor="organizationName"
              >
                Organization Name
              </label>
              <input
                className={`shadow appearance-none border rounded-md w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/70 border-slate-500 text-white placeholder-slate-300 focus:ring-purple-500 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                }`}
                id="organizationName"
                type="text"
                placeholder="Your Company Name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required={!isLogin}
              />
            </motion.div>
          )}
          
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label
              className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded-md w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-700/70 border-slate-500 text-white placeholder-slate-300 focus:ring-purple-500 focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
              }`}
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          <div className="mb-6">
            <label
              className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className={`shadow appearance-none border rounded-md w-full py-3 px-4 pr-12 leading-tight focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/70 border-slate-500 text-white placeholder-slate-300 focus:ring-purple-500 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                }`}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label
                className={`block text-sm font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className={`shadow appearance-none border rounded-md w-full py-3 px-4 pr-12 leading-tight focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-700/70 border-slate-500 text-white placeholder-slate-300 focus:ring-purple-500 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                  } ${password !== confirmPassword && confirmPassword ? 'border-red-500' : ''}`}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {showConfirmPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </>
                    )}
                  </svg>
                </button>
                {password !== confirmPassword && confirmPassword && (
                  <div className="text-red-500 text-xs mt-1">Passwords do not match</div>
                )}
              </div>
            </div>
          )}

          <motion.div 
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              className={`font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition-all duration-300 w-full transform ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              } ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}`}
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Logging In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? "Login" : "Create Account"
              )}
            </motion.button>
          </motion.div>
        </form>

        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <button
            type="button"
            onClick={toggleMode}
            className={`text-sm font-medium transition-colors duration-300 ${
              isDark 
                ? 'text-purple-400 hover:text-purple-300' 
                : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </motion.div>


      </div>
    </div>
  );
};

export default LoginForm;