import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { Booking, Specialist } from '../../types';

interface BookingsScreenProps {
  bookings: Booking[];
  onOpenChat: (specialist: Specialist) => void;
  onCancelBooking: (bookingId: string) => void;
  onRebook: (booking: Booking) => void;
  onBack?: () => void;
  showToast: (msg: string) => void;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  bookings,
  onOpenChat,
  onCancelBooking,
  onRebook,
  onBack,
  showToast,
}) => {
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  const activeBookings = bookings.filter((b) => b.status === 'transit' || b.status === 'scheduled' || b.status === 'in_progress');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

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
            <h1 className="text-lg font-bold text-slate-900">My Bookings</h1>
          </div>
          <button
            onClick={() => showToast('Help: HomeMate Emergency Hotline is 1990')}
            className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 cursor-pointer"
          >
            Need Help?
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pb-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTab('active')}
              className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                tab === 'active'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active ({activeBookings.length})
            </button>
            <button
              onClick={() => setTab('completed')}
              className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                tab === 'completed'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Past Completed ({completedBookings.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-5 pt-3 pb-6 flex flex-col gap-4">
        {tab === 'active' ? (
          activeBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-300">event_busy</span>
              <p className="text-xs text-slate-500 mt-2">No active bookings currently.</p>
            </div>
          ) : (
            activeBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">{booking.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-xs font-bold text-slate-800">{booking.categoryName}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                      booking.status === 'transit'
                        ? 'bg-cyan-100 text-cyan-900 animate-pulse'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {booking.status === 'transit' ? 'En Route (4 mins away)' : 'Scheduled'}
                  </span>
                </div>

                {/* Service Name & Pricing */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{booking.serviceTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">calendar_month</span>
                    <span>{booking.date}, {booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                    <span className="truncate">{booking.address}</span>
                  </div>
                </div>

                {/* Live GPS Tracker Box if in transit */}
                {booking.status === 'transit' && (
                  <div className="relative overflow-hidden rounded-xl bg-slate-900 text-white p-3.5 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-cyan-400 text-[20px] animate-spin">
                          autorenew
                        </span>
                        <span className="text-xs font-bold">Real-time GPS Tracking</span>
                      </div>
                      <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                        ETA 4 mins
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden my-2">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-3/4 rounded-full"></div>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      {booking.specialist.name} is on Havelock Road approaching your doorstep.
                    </p>
                  </div>
                )}

                {/* Specialist Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={booking.specialist.avatar}
                      alt={booking.specialist.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{booking.specialist.name}</h4>
                      <p className="text-[10px] text-slate-500">{booking.specialist.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => showToast(`Calling ${booking.specialist.name} at +94 77 889 9123...`)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                      title="Call"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                    </button>
                    <button
                      onClick={() => onOpenChat(booking.specialist)}
                      className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center cursor-pointer"
                      title="Direct Chat"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="font-bold text-slate-900">
                    Total: <span className="text-blue-600">LKR {booking.price.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => showToast(`Booking ${booking.id} receipt details sent to your email.`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : completedBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-300">history</span>
            <p className="text-xs text-slate-500 mt-2">No past completed jobs yet.</p>
          </div>
        ) : (
          completedBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-bold">{booking.id}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Completed
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{booking.serviceTitle}</h3>
              <p className="text-xs text-slate-500">Serviced on {booking.date} by {booking.specialist.name}</p>

              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">30-Day Warranty Active</span>
                <span className="text-blue-600 font-bold">LKR {booking.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => showToast('⭐ Review submitted! Thank you for rating.')}
                  className="text-xs font-semibold text-amber-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  Rate Specialist
                </button>
                <button
                  onClick={() => onRebook(booking)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  Book Again
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
