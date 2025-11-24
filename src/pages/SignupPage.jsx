import React, { useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore';
import { User, Mail, Lock, LoaderIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const SignupPage = () => {
  const [formData, setformData] = useState({username:"" , email:"" , password:""});
  const{isSignedUp , signup} = useAuthStore();

  const handleSubmit = (e)=>{
    e.preventDefault();
    signup(formData);
  }
  
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-10">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-5">
              <div className="p-2 rounded-full bg-gradient-to-br from-cyan-50 to-blue-50">
                <img 
                  src="/a-minimalist-logo-design-featuring-the-b_cYwZJptSRSW2XvrBjqNfaA_PtarJfsfSGiboRLsNhJnug.jpeg" 
                  alt="Whisp Logo" 
                  className="h-14 w-14 object-contain"
                />
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">
              Join us and start connecting
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setformData({...formData, username: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white transition-all duration-200"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setformData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setformData({...formData, password: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white transition-all duration-200"
                  placeholder="Create a secure password"
                />
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isSignedUp}
              className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center mt-8"
            >
              {isSignedUp ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-cyan-500 hover:text-cyan-600 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
