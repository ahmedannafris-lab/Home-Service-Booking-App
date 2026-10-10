import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';

interface ManageUserScreenProps {
  userId?: string;
  onBack: () => void;
  showToast: (message: string) => void;
}

export const ManageUserScreen: React.FC<ManageUserScreenProps> = ({ userId, onBack, showToast }) => {
  // Using dummy data since AdminContext isn't connected to Vite yet.
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50 shrink-0">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Manage User</h1>
          <div className="w-11 h-11" /> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 px-5 pt-4 pb-24 space-y-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-base font-semibold text-slate-800">User Profile</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Edit user details
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <img 
              src="https://i.pravatar.cc/150?u=1" 
              alt="Kamal Perera" 
              className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-100 shrink-0"
            />
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-slate-900 truncate">Kamal Perera</h3>
              <p className="text-sm font-medium text-slate-800 mt-1">0712347683</p>
              <p className="text-sm text-slate-500 mt-0.5">kamal.p@example.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3 px-1">Account Status</h2>
          {isActive ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-emerald-800">
                Active since 12 Aug 2026 - 10:00 AM
              </p>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <AlertCircle size={16} className="text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                Account Suspended
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-3 px-1">Assigned Branch & Address</h2>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-sm items-start">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={18} className="text-blue-600" />
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              No 24, Rajapihilla Rd, Kurunegala
            </p>
          </div>
        </section>

        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 flex gap-2.5 items-start">
          <AlertCircle size={16} className="text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Changing account status will immediately affect the user's ability to access the platform. Please verify details before confirming.
          </p>
        </div>
      </main>

      <footer className="sticky bottom-0 left-0 right-0 p-5 bg-slate-50/80 backdrop-blur-md border-t border-slate-200 space-y-3 z-50 mt-auto">
        <button 
          onClick={() => {
            setIsActive(true);
            showToast('Account activated successfully');
          }}
          className="w-full h-12 flex items-center justify-center rounded-xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Activate / Update
        </button>
        <button 
          onClick={() => {
            setIsActive(false);
            showToast('Account suspended');
          }}
          className="w-full h-12 flex items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold hover:bg-red-100 active:bg-red-200 transition-colors"
        >
          Suspend Account
        </button>
      </footer>
    </div>
  );
};
