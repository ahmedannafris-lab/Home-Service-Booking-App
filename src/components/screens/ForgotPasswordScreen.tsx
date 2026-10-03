import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { LOGO_URL } from '../../data/mockData';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onCodeSent: (channel: 'email' | 'phone', target: string) => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onCodeSent,
  onBackToLogin,
}) => {
  const [channel, setChannel] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('john.doe@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onCodeSent(channel, value);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-full bg-white overflow-hidden flex-1">
      {/* Top Bar */}
      <div className="w-full shrink-0">
        <IOSStatusBar />
        <header className="px-6 pt-1 pb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-100/90 active:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            aria-label="Go back to Login"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="text-base font-semibold text-slate-800">Forgot Password</h1>
          <div className="w-10"></div>
        </header>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-3 pb-4 flex flex-col justify-start no-scrollbar">
        {/* Brand & Title */}
        <div className="flex flex-col items-center mt-2 mb-4 text-center">
          <div className="relative flex items-center justify-center mb-3">
            <div className="absolute w-24 h-24 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="relative w-20 h-20 rounded-2xl p-1 bg-white shadow-xl shadow-blue-500/20 flex items-center justify-center">
              <img alt="HomeMate Logo" className="w-14 h-14 object-contain" src={LOGO_URL} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Your Password</h2>
          <p className="text-xs leading-relaxed text-slate-500 mt-2 max-w-[290px]">
            Enter the email address or mobile number associated with your account, and we will send you a 4-digit verification code.
          </p>
        </div>

        {/* Channel Selector */}
        <div className="mt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Select contact channel</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setChannel('email');
                setValue('john.doe@example.com');
              }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                channel === 'email'
                  ? 'bg-white shadow-sm text-blue-600 font-semibold border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>Email</span>
              {channel === 'email' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 ml-1"></span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setChannel('phone');
                setValue('+94 77 123 4567');
              }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                channel === 'phone'
                  ? 'bg-white shadow-sm text-blue-600 font-semibold border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
              <span>Phone SMS</span>
              {channel === 'phone' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 ml-1"></span>}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {channel === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">
                  {channel === 'email' ? 'alternate_email' : 'phone'}
                </span>
              </div>
              <input
                type={channel === 'email' ? 'email' : 'tel'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 border-none focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-slate-600 text-xs">
            <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              info
            </span>
            <p className="leading-relaxed">
              Check your spam or junk folder if you don't receive an {channel === 'email' ? 'email' : 'SMS'} within 2 minutes.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-70"
          >
            <span>{isSubmitting ? 'Sending Code...' : 'Send Reset Code'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="shrink-0 px-6 pb-8 pt-2 text-center">
        <p className="text-xs text-slate-500 font-normal">
          Remember your password?{' '}
          <button
            onClick={onBackToLogin}
            className="ml-1 text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Back to Login
          </button>
        </p>
        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-5"></div>
      </footer>
    </div>
  );
};
