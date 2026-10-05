import React from 'react';
import { ArrowLeft, Bell, ChevronRight, KeyRound, LogOut, Mail, ShieldCheck, Tags, UserRound } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';

interface AdminProfileScreenProps {
  onBack: () => void;
  onManageCategories: () => void;
  onLogout: () => void;
  showToast: (message: string) => void;
}

export const AdminProfileScreen: React.FC<AdminProfileScreenProps> = ({
  onBack,
  onManageCategories,
  onLogout,
  showToast,
}) => (
  <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shrink-0">
      <IOSStatusBar />
      <div className="h-14 px-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to admin login"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Admin Profile</h1>
      </div>
    </header>

    <main className="flex-1 px-5 pt-6 pb-8 space-y-5">
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={32} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Platform administrator</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">HomeMate Admin</h2>
            <p className="mt-1 text-sm text-slate-500 truncate">admin@homemate.com</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-600">Account status</span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />Active
          </span>
        </div>
      </section>

      <section aria-labelledby="admin-account-heading">
        <h2 id="admin-account-heading" className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
          Account details
        </h2>
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
          <div className="px-4 py-4 flex items-center gap-3">
            <UserRound size={18} className="text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Full name</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">HomeMate Admin</p>
            </div>
          </div>
          <div className="px-4 py-4 flex items-center gap-3">
            <Mail size={18} className="text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Email address</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 break-all">admin@homemate.com</p>
            </div>
          </div>
          <div className="px-4 py-4 flex items-center gap-3">
            <KeyRound size={18} className="text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Access level</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">Full platform access</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Admin profile settings" className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
        <button
          type="button"
          onClick={onManageCategories}
          className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50"
        >
          <Tags size={18} className="text-blue-700" />
          <span className="flex-1 text-sm font-semibold text-slate-800">Manage Categories</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => showToast('Security settings are up to date.')}
          className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50"
        >
          <KeyRound size={18} className="text-blue-700" />
          <span className="flex-1 text-sm font-semibold text-slate-800">Security & access</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => showToast('Admin notifications are enabled.')}
          className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50"
        >
          <Bell size={18} className="text-blue-700" />
          <span className="flex-1 text-sm font-semibold text-slate-800">Notifications</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="w-full min-h-12 px-4 flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white text-sm font-semibold text-rose-700 hover:bg-rose-50"
      >
        <LogOut size={18} />
        Log out
      </button>
    </main>
  </div>
);