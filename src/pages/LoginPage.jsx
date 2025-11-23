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
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      {/* Main Container with Border Animation */}
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Animated Border Container */}
        <div className="relative backdrop-blur-xl bg-slate-800/40 border-2 border-slate-700/50 rounded-3xl shadow-2xl animate-fade-in overflow-hidden border-animated">
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="flex-1 p-8 lg:p-12 lg:border-r lg:border-slate-700/50">
              {/* Whisp Branding */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <img 
                      src="/a-minimalist-logo-design-featuring-the-b_cYwZJptSRSW2XvrBjqNfaA_PtarJfsfSGiboRLsNhJnug.jpeg" 
                      alt="Whisp Logo" 
                      className="relative h-24 w-24 lg:h-32 lg:w-32 object-contain animate-logo-float filter brightness-110 contrast-110 drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8 space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-slate-400 text-sm">
                  Sign in to continue your journey
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setformData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 hover:border-slate-600"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setformData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 hover:border-slate-600"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoggedIn}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoggedIn ? (
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </span>
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-slate-400 text-sm">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Divider Line (visible on mobile) */}
            <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mx-8"></div>

            {/* Right Side - Image */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-slate-900/20 min-h-[400px] lg:min-h-[600px]">
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src="/login.png" 
                  alt="Login illustration" 
                  className="w-full h-auto max-w-full max-h-[500px] lg:max-h-[700px] object-contain animate-fade-in"
                />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
