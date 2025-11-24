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
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Clean White Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="flex-1 p-8 lg:p-12 lg:border-r lg:border-gray-200">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <img 
                    src="/a-minimalist-logo-design-featuring-the-b_cYwZJptSRSW2XvrBjqNfaA_PtarJfsfSGiboRLsNhJnug.jpeg" 
                    alt="Whisp Logo" 
                    className="h-16 w-16 lg:h-20 lg:w-20 object-contain"
                  />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8 space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-gray-500 text-sm">
                  Join us and start your journey
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setformData({...formData, username: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setformData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setformData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isSignedUp}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSignedUp ? (
                    <LoaderIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Divider Line (visible on mobile) */}
            <div className="lg:hidden h-px bg-gray-200 mx-8"></div>

            {/* Right Side - Image */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50 min-h-[400px] lg:min-h-[600px]">
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src="/signup.png" 
                  alt="Signup illustration" 
                  className="w-full h-auto max-w-full max-h-[500px] lg:max-h-[700px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
