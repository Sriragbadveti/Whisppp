import React, { useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { Mail, Lock, LoaderIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [formData, setformData] = useState({email:"" , password:""})
  const{isLoggedIn , login}  = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  }
  
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/a-minimalist-logo-design-featuring-the-b_cYwZJptSRSW2XvrBjqNfaA_PtarJfsfSGiboRLsNhJnug.jpeg" 
                alt="Whisp Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setformData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setformData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggedIn}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggedIn ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-2">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
