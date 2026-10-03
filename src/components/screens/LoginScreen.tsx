import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { LOGO_URL } from '../../data/mockData';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: (role: UserRole) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onLoginSuccess,
  onForgotPassword,
  onSignUp,
}) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [identifier, setIdentifier] = useState('name@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(role);
    }, 500);
  };

  const handleFaceId = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(role);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-full bg-white overflow-hidden flex-1">
      {/* Top Header */}
      <div className="w-full shrink-0">
        <IOSStatusBar />
        <header className="px-6 pt-1 pb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95 transition text-slate-700 cursor-pointer"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">HOMEMATE AUTH</span>
          <div className="w-8"></div>
        </header>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 px-6 pb-6 pt-1 flex flex-col justify-start overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Brand & Greeting */}
        <div className="flex flex-col items-center text-center mt-1 mb-5">
          <div className="w-14 h-14 mb-3.5 rounded-2xl p-1 bg-white shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <img alt="HomeMate Brand Logo" className="w-12 h-12 object-contain" src={LOGO_URL} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-[240px]">Log in to manage your bookings and services</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-5 bg-slate-100 p-1 rounded-xl flex items-center justify-between text-xs font-medium text-slate-600">
          {(['customer', 'provider', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-center rounded-lg capitalize transition-all cursor-pointer ${
                role === r
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Email or Phone Number</label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">alternate_email</span>
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-3 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 border-0 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 border-0 focus:outline-none focus:ring-0 tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center space-x-2 text-slate-600 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 transition cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Log In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
            >
              <span>{loading ? 'Logging in...' : 'Log In'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Face ID / Biometrics */}
          <div>
            <button
              type="button"
              onClick={handleFaceId}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-[0.99] text-slate-700 font-medium text-xs rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-blue-600 text-[18px]">face</span>
              <span>Login with Face ID</span>
            </button>
          </div>
        </form>

        {/* Social Login */}
        <div className="mt-6 text-center">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs tracking-wider uppercase font-medium">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={() => onLoginSuccess(role)}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition active:scale-95 bg-white shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" fill="#4285F4" />
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.37 7.33 24 12 24z" fill="#34A853" />
                <path d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.42l4.02-3.13z" fill="#FBBC05" />
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z" fill="#EA4335" />
              </svg>
              <span className="text-xs font-semibold text-slate-700">Google</span>
            </button>

            <button
              type="button"
              onClick={() => onLoginSuccess(role)}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition active:scale-95 bg-white shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.93-12.23-14.56-6.19-9.16-11.12-19.9-14.79-32.22-3.67-12.33-5.51-23.75-5.51-34.28 0-14.92 3.8-27.42 11.41-37.5 7.61-10.08 17.1-15.23 28.46-15.46 4.93 0 10.22 1.34 15.87 4.02 5.66 2.68 9.38 4.08 11.18 4.2 1.63-.12 5.56-1.6 11.79-4.43 6.23-2.83 11.73-4.08 16.5-3.77 12.63.74 22.82 5.48 30.56 14.22-10.96 6.64-16.32 15.68-16.08 27.13.25 9.04 3.75 16.66 10.51 22.86 6.76 6.2 14.85 9.87 24.28 11.01-2.12 6.53-4.66 12.92-7.62 19.17zM119.22 33.15c0-6.9 2.52-13.43 7.57-19.58 5.05-6.15 11.37-10.14 18.96-11.97.74 1.77 1.11 3.65 1.11 5.64 0 6.9-2.6 13.56-7.79 19.98-5.19 6.42-11.64 10.36-19.35 11.83-.12-1.77-.5-3.74-.5-5.9z" />
              </svg>
              <span className="text-xs font-semibold text-slate-700">Apple</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 pt-3 pb-6 text-center bg-white border-t border-slate-100 shrink-0">
        <p className="text-xs text-slate-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSignUp}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1 cursor-pointer"
          >
            Sign Up
          </button>
        </p>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <span className="material-symbols-outlined text-[14px] text-emerald-500">lock</span>
          <span>256-Bit SSL Encrypted &amp; Protected</span>
        </div>

        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-3"></div>
      </footer>
    </div>
  );
};
