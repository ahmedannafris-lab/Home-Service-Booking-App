import React from 'react';
import { ArrowLeft, Bell, Users, Briefcase, Calendar, CheckCircle2, Calendar as CalendarIcon, UserPlus, ChevronRight } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { ScreenId } from '../../types';

interface AdminPortalScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  showToast: (message: string) => void;
}

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({ onBack, onNavigate, showToast }) => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shrink-0">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 -ml-2"
          >
            <ArrowLeft size={22} />
          </button>
          
          <h1 className="text-lg font-bold text-slate-900">Admin Portal</h1>
          
          <button
            type="button"
            onClick={() => showToast('No new critical system notifications at this time.')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 -mr-2 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-24 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Admin"
            className="w-14 h-14 rounded-full object-cover bg-slate-100 border border-slate-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900">Kamal kumara</h2>
            <p className="text-xs text-slate-500 mt-0.5">0712347683</p>
            <p className="text-xs text-slate-500">kamal@gmail.com</p>
          </div>
          <button
            onClick={() => onNavigate('admin-profile')}
            className="text-sm font-semibold text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            Edit
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          <button
            onClick={() => onNavigate('admin-users')}
            className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Manage user
          </button>
          <button
            onClick={() => onNavigate('admin-categories')}
            className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Manage Categories
          </button>
          <button
            onClick={() => onNavigate('admin-providers')}
            className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Manage providers
          </button>
        </div>

        {/* Overview Metrics */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3">Overview Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            
            {/* Total Users */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500">Total Users</span>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
                  <Users size={14} className="text-slate-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">1,245</h3>
              <div className="inline-flex self-start px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600">
                +12% vs last mo
              </div>
            </div>

            {/* Providers */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500">Providers</span>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
                  <Briefcase size={14} className="text-slate-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">84</h3>
              <div className="inline-flex self-start px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-semibold text-amber-600">
                12 pending approval
              </div>
            </div>

            {/* Bookings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500">Bookings</span>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
                  <Calendar size={14} className="text-slate-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">342</h3>
              <div className="inline-flex self-start px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600">
                +8% vs last week
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500">Completed</span>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">290</h3>
              <div className="inline-flex self-start px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600">
                92% completion rate
              </div>
            </div>

          </div>
        </section>

        {/* Recent Activities */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
            <button onClick={() => showToast('Full activity audit trail coming soon.')} className="text-sm font-semibold text-blue-600">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <CalendarIcon size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">New Booking</h4>
                  <span className="text-[9px] font-bold tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">NEW BOOKING</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">Kasun Perera booked Plumbing Repair</p>
                <p className="text-[10px] text-slate-400 font-medium">16 Oct 2026 • 10:30 AM</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <UserPlus size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">Provider Registration</h4>
                  <span className="text-[9px] font-bold tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">NEW PROVIDER</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">Silva Electrical Services registered as provider</p>
                <p className="text-[10px] text-slate-400 font-medium">15 Oct 2026 • 02:00 PM</p>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};
