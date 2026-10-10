import React, { useState } from 'react';
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!agreed) {
      setErrorMsg('Please accept the Terms of Service to continue');
      return;
    }
    const digits = phone.replace(/[\s()-]/g, '');
    const normalizedPhone = digits.startsWith('+94')
      ? digits
      : digits.startsWith('94') && digits.length === 11
        ? `+${digits}`
        : digits.startsWith('0') && digits.length === 10
          ? `+94${digits.slice(1)}`
          : `+94${digits}`;

    if (!/^\+94[0-9]{9}$/.test(normalizedPhone)) {
      setErrorMsg('Enter a valid Sri Lankan phone number, e.g. 77 123 4567');
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least 8 characters and one number');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:5000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: normalizedPhone,
          password,
          role: 'customer',
          acceptedTerms: agreed,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        const details = data.errors?.map((error: { message: string }) => error.message).join(' ');
        setErrorMsg(details || data.message || 'Unable to create account');
        return;
      }
      onRegisterSuccess();
    } catch {
      setErrorMsg('Unable to reach the backend. Check that it is running on port 5000.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="homemate-register w-full flex flex-col h-full min-h-0 bg-[#F7F9FB] overflow-hidden flex-1">
      <style>{`
        .homemate-register { color: #424754; }
        .homemate-register { font-size: 16px; line-height: 1.5; }
        .homemate-register header { padding: 4px 20px 8px; }
        .homemate-register > .overflow-y-auto { width: 100%; max-width: 440px; margin-inline: auto; padding: 12px 20px 24px; overscroll-behavior-y: contain; scroll-padding-block: 16px; }
        .homemate-register h1 { font-size: 28px; line-height: 1.2; color: #20242D; }
        .homemate-register form label { font-size: 13px; line-height: 1.5; }
        .homemate-register input:not([type="checkbox"]) { height: 52px; min-height: 52px; padding-block: 12px; padding-left: 44px; padding-right: 12px; border-radius: 12px; background: #FFFFFF; border: 1px solid #E0E3E5; color: #424754; font-size: 16px; line-height: 24px; font-weight: 400; }
        .homemate-register input[autocomplete="new-password"] { padding-right: 52px; }
        .homemate-register form .absolute .material-symbols-outlined { font-size: 20px; }
        .homemate-register form button.absolute { width: 48px; min-height: 48px; padding: 0; justify-content: center; }
        .homemate-register form button[type="submit"] { min-height: 52px; font-size: 15px; }
        .homemate-register input[type="checkbox"] { width: 20px; height: 20px; flex-shrink: 0; accent-color: #0058BE; }
        .homemate-register label[for="terms"] { min-height: 44px; padding-block: 2px; font-size: 12px; line-height: 1.6; }
        .homemate-register input::placeholder { color: #727785; opacity: 1; }
        .homemate-register input:focus { --tw-ring-color: #4285F4; }
        .homemate-register .shadow-sm { box-shadow: none; }
        .homemate-register .text-slate-400 { color: #727785; }
        .homemate-register label { color: #424754; }
        .homemate-register .text-blue-600 { color: #0058BE; }
        .homemate-register button:focus-visible { outline: 2px solid #4285F4; outline-offset: 3px; }
        .homemate-register footer { background: transparent; border: 0; margin-top: 20px; padding: 8px 0 max(16px, env(safe-area-inset-bottom, 0px)); }
        .homemate-register footer button { min-height: 44px; }
        .homemate-register footer > div { display: none; }
      `}</style>
      {/* Top Bar */}
      <div className="w-full shrink-0">
        <header className="px-6 pt-1 pb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <span aria-hidden="true" className="w-11" />
        </header>
      </div>

      {/* Main Content */}
      <div className="px-5 pt-4 pb-6 min-h-0 flex-1 flex flex-col justify-start overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Brand & Title Block */}
        <div className="text-left mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg p-1 bg-[#0058BE] flex items-center justify-center">
              <img alt="HomeMate Brand Logo" className="w-7 h-7 object-contain" src={LOGO_URL} />
            </div>
            <span className="text-sm font-bold text-[#0058BE]">HomeMate</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Create Account</h1>
          <p className="text-sm text-[#727785] mt-2 max-w-sm leading-relaxed">
            Join HomeMate and book trusted home services in minutes.
          </p>
        </div>

        {errorMsg && (
          <div role="alert" className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="register-name" className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <input
                type="text"
                id="register-name"
                minLength={2}
                maxLength={100}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                placeholder="Full Name"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="register-email" className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </div>
              <input
                type="email"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Enter your email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="register-phone" className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
            <div className="relative rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#4285F4] overflow-hidden">
              <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute left-3.5 top-4 text-lg text-[#727785]">call</span>
              <input
                type="tel"
                id="register-phone"
                inputMode="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="(+94) 77 123 4567"
                className="w-full border-0 py-2.5 pl-10 pr-3 text-sm focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Password with Strength Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="register-password" className="block text-xs font-medium text-slate-700">Password</label>
              <span className="hidden">
                {strengthLabels[strengthScore - 1] || 'Weak'}
              </span>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                minLength={8}
                aria-describedby="register-password-help"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Create a strong password"
                required
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {/* Strength bars */}
            <div className="hidden">
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
            <p id="register-password-help" className="mt-2 flex items-center gap-1 text-xs leading-relaxed text-[#727785]">
              <span aria-hidden="true" className="material-symbols-outlined text-sm text-[#4285F4]">info</span>
              Must be at least 8 characters with 1 number
            </p>
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
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full min-h-12 mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#0058BE] hover:bg-blue-700 shadow-sm cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
            <span aria-hidden="true" className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        {/* Social */}
        <div className="hidden">
          <div className="relative flex justify-center text-xs mb-3">
            <span className="px-3 bg-white text-slate-400 font-medium">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setErrorMsg('Google signup is not available yet. Please use the form above.')}
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
              onClick={() => setErrorMsg('Apple signup is not available yet. Please use the form above.')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.82 1.11-1.96.99-3.11-1 .04-2.15.65-2.82 1.44-.59.69-1.12 1.83-.98 2.95 1.11.09 2.16-.48 2.81-1.28" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>
      {/* Footer */}
      <footer className="text-center">
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
    </div>
  );
};
