import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { UserRole } from '../../types';

interface RoleSelectionScreenProps {
  onBack: () => void;
  onContinue: (role: UserRole) => void;
  onPartnerClick: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onBack,
  onContinue,
  onPartnerClick,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-full bg-white overflow-hidden flex-1">
      {/* Top Bar */}
      <div className="w-full shrink-0">
        <IOSStatusBar />
        <header className="px-6 pt-1 pb-2 flex items-center">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 text-slate-700 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-2 pb-4 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Select Your Role</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Choose how you want to experience and use HomeMate today.
          </p>
        </div>

        <div className="space-y-4">
          {/* Customer Role Card */}
          <div
            onClick={() => setSelectedRole('customer')}
            className={`group relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer ${
              selectedRole === 'customer'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5 pr-2">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">home</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">I need a Service / User</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Book trusted home professionals, track service in real time, and make secure seamless payments.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-100/70 text-blue-700">
                      <span className="material-symbols-outlined text-[14px] mr-1">schedule</span>
                      Instant Booking
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-100/70 text-blue-700">
                      <span className="material-symbols-outlined text-[14px] mr-1">verified_user</span>
                      Transparent Rates
                    </span>
                  </div>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'customer'
                    ? 'border-blue-600 bg-blue-600 shadow-sm'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedRole === 'customer' && (
                  <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                )}
              </div>
            </div>
          </div>

          {/* Provider Role Card */}
          <div
            onClick={() => setSelectedRole('provider')}
            className={`group relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer ${
              selectedRole === 'provider'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5 pr-2">
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                  <span className="material-symbols-outlined text-[22px]">work</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">
                    I am a Service Provider / Specialist
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Grow your business, manage customer bookings, receive verified jobs, and get paid directly.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                      <span className="material-symbols-outlined text-[14px] mr-1">bolt</span>
                      Receive Job Leads
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                      <span className="material-symbols-outlined text-[14px] mr-1">payments</span>
                      Weekly Payouts
                    </span>
                  </div>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'provider'
                    ? 'border-blue-600 bg-blue-600 shadow-sm'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedRole === 'provider' && (
                  <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                )}
              </div>
            </div>
          </div>

          {/* Admin Role Card */}
          <div
            onClick={() => setSelectedRole('admin')}
            className={`group relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer ${
              selectedRole === 'admin'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5 pr-2">
                <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-violet-600">
                  <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">
                    I am an Admin / Operations Manager
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Monitor platform performance, oversee service quality, manage teams, and control access across the system.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-violet-100 text-violet-700">
                      <span className="material-symbols-outlined text-[14px] mr-1">insights</span>
                      Track Metrics
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-violet-100 text-violet-700">
                      <span className="material-symbols-outlined text-[14px] mr-1">groups</span>
                      Manage Teams
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'admin'
                    ? 'border-blue-600 bg-blue-600 shadow-sm'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedRole === 'admin' && (
                  <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 pt-3 pb-6 bg-white border-t border-slate-100 shrink-0">
        <button
          disabled={selectedRole === null}
          onClick={() => { if (selectedRole) onContinue(selectedRole); }}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <span>
            {selectedRole === null && 'Select a role to continue'}
            {selectedRole === 'customer' && 'Continue as HomeMate User'}
            {selectedRole === 'provider' && 'Continue as Service Provider'}
            {selectedRole === 'admin' && 'Continue as Admin'}
          </span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Want to register a company or team?{' '}
            <button
              onClick={onPartnerClick}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Partner with us
            </button>
          </p>
        </div>

        <div className="mt-3 text-center">
          <p className="text-[11px] text-slate-400">
            By continuing, you agree to HomeMate's{' '}
            <span className="text-slate-600 font-medium">Terms of Service</span> &amp;{' '}
            <span className="text-slate-600 font-medium">Privacy Policy</span>.
          </p>
        </div>

        <div className="mt-3 flex justify-center">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
};
