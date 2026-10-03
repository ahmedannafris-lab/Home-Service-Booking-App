import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { LOGO_URL } from '../../data/mockData';

interface RegisterScreenProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
  onLogIn: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBack,
  onRegisterSuccess,
  onLogIn,
}) => {
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('(555) 012-3456');
  const [password, setPassword] = useState('SecurePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate password strength
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-600', 'bg-emerald-600'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!agreed) {
      setErrorMsg('Please accept the Terms of Service to continue');
      return;
    }
    setErrorMsg(null);
    onRegisterSuccess();
  };

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-full bg-white overflow-hidden flex-1">
      {/* Top Bar */}
      <div className="w-full shrink-0">
        <IOSStatusBar />
        <header className="px-6 pt-1 pb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 cursor-pointer"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Step 1 of 2</span>
          <div className="w-9"></div>
        </header>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-1 pb-6 flex-1 flex flex-col justify-start overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Brand & Title Block */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl p-1 bg-white shadow-md flex items-center justify-center">
              <img alt="HomeMate Brand Logo" className="w-10 h-10 object-contain" src={LOGO_URL} />
            </div>
          </div>
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1.5">
            HomeMate Services
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Create Account</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
            Fill in your details below to get started with trusted services
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
            <div className="relative flex rounded-xl border border-slate-200 bg-slate-50/50 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden shadow-sm">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100/70 border-r border-slate-200 text-xs font-medium text-slate-700"
              >
                <span>🇱🇰</span>
                <span>+94</span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
              </button>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="77 123 4567"
                className="w-full border-0 bg-transparent py-2.5 pl-3 pr-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Password with Strength Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-700">Password</label>
              <span className={`text-[11px] font-semibold text-emerald-600`}>
                {strengthLabels[strengthScore - 1] || 'Weak'}
              </span>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create strong password"
                required
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {/* Strength bars */}
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    step <= strengthScore
                      ? strengthColors[strengthScore - 1] || 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2.5 block text-xs text-slate-600 leading-snug cursor-pointer select-none">
              I agree to HomeMate's{' '}
              <span className="font-medium text-blue-600 hover:underline">Terms of Service</span> and{' '}
              <span className="font-medium text-blue-600 hover:underline">Privacy Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition duration-150 shadow-lg shadow-blue-500/25 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Social */}
        <div className="mt-5">
          <div className="relative flex justify-center text-xs mb-3">
            <span className="px-3 bg-white text-slate-400 font-medium">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onRegisterSuccess}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z" fill="#4285F4" />
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853" />
                <path d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z" fill="#FBBC05" />
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={onRegisterSuccess}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.82 1.11-1.96.99-3.11-1 .04-2.15.65-2.82 1.44-.59.69-1.12 1.83-.98 2.95 1.11.09 2.16-.48 2.81-1.28" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-6 pt-3 px-6 text-center border-t border-slate-100 bg-slate-50/50 shrink-0">
        <p className="text-xs text-slate-600">
          Already have an account?{' '}
          <button
            onClick={onLogIn}
            className="font-bold text-blue-600 hover:text-blue-700 ml-1 hover:underline cursor-pointer"
          >
            Log In
          </button>
        </p>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <span className="material-symbols-outlined text-[14px] text-emerald-500">verified_user</span>
          <span>Verified Identity &amp; Data Protection</span>
        </div>

        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-3"></div>
      </footer>
    </div>
  );
};
