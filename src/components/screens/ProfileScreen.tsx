import React from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { USER_AVATAR } from '../../data/mockData';
import { UserRole } from '../../types';

interface ProfileScreenProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  onBack?: () => void;
  showToast: (msg: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentRole,
  onSwitchRole,
  onLogout,
  onBack,
  showToast,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 pb-6 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xs shrink-0">
        <IOSStatusBar />

        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 cursor-pointer"
                aria-label="Go Back"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
            )}
            <h1 className="text-lg font-bold text-slate-900">Account Profile</h1>
          </div>
          <button
            onClick={() => showToast('Profile settings saved successfully!')}
            className="text-xs font-semibold text-blue-600 cursor-pointer"
          >
            Edit
          </button>
        </div>
      </header>

      {/* User Card */}
      <div className="px-5 pt-4 pb-6 flex flex-col gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
          <div className="relative">
            <img
              src={USER_AVATAR}
              alt="Ahmed"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-white">edit</span>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 leading-tight">Ahmed Al-Mansoori</h2>
            <p className="text-xs text-slate-500 mt-0.5">ahmed.mansoori@example.com</p>
            <span className="inline-block mt-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full capitalize">
              Role: {currentRole}
            </span>
          </div>
        </div>

        {/* Role Switcher Pill Bar */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 mb-2">Switch Active View Mode</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {(['customer', 'provider', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  onSwitchRole(r);
                  showToast(`Switched view to ${r} mode`);
                }}
                className={`py-2 text-center rounded-lg capitalize transition-all cursor-pointer ${
                  currentRole === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
          <button
            onClick={() => showToast('Saved Address: 14/2 Alfred House Gardens, Colombo 03')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-blue-600">home</span>
              <span className="font-semibold text-slate-800">Saved Addresses</span>
            </div>
            <span className="text-slate-400">1 Saved &gt;</span>
          </button>

          <button
            onClick={() => showToast('Payment Methods: Visa card ending in •••• 4242 & Cash On Delivery active')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-blue-600">credit_card</span>
              <span className="font-semibold text-slate-800">Payment & Escrow Methods</span>
            </div>
            <span className="text-slate-400">Visa •• 4242 &gt;</span>
          </button>

          <button
            onClick={() => showToast('HomeCare Protection Guarantee is 100% active on all your booked services')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-blue-600">verified_user</span>
              <span className="font-semibold text-slate-800">HomeCare 30-Day Protection</span>
            </div>
            <span className="text-emerald-600 font-bold">Active &gt;</span>
          </button>

          <button
            onClick={() => showToast('Notifications enabled for technician tracking & discounts')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-blue-600">notifications_active</span>
              <span className="font-semibold text-slate-800">Push Notifications & SMS</span>
            </div>
            <span className="text-blue-600 font-bold">Enabled &gt;</span>
          </button>
        </div>

        {/* Support & Logout */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
          <button
            onClick={() => showToast('HomeMate 24/7 Hotline: +94 11 234 5678')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-slate-600">support_agent</span>
              <span className="font-semibold text-slate-800">24/7 Customer Support Hotline</span>
            </div>
            <span className="text-slate-400">&gt;</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full px-4 py-3 flex items-center justify-between text-left text-rose-600 hover:bg-rose-50 cursor-pointer font-bold"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Log Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
