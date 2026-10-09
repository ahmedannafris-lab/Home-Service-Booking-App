import React, { useState, useEffect } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { Booking } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || '';

interface AdminBookingsScreenProps {
  onBack?: () => void;
  showToast: (msg: string) => void;
}

type FilterTab = 'all' | 'active' | 'completed';

export const AdminBookingsScreen: React.FC<AdminBookingsScreenProps> = ({
  onBack,
  showToast,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>('all');

  // Load bookings from backend
  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.log('Failed to load bookings', error);
      showToast('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Update booking status
  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        showToast(`✅ Status updated to ${status.replace('_', ' ')}`);
        loadBookings();
      } else {
        showToast('Failed to update status');
      }
    } catch (error) {
      showToast('Network error');
    }
  };

  // Delete booking
  const deleteBooking = async (id: string) => {
    if (!window.confirm('Delete this booking permanently?')) return;

    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('🗑️ Booking deleted successfully');
        loadBookings();
      } else {
        showToast('Failed to delete booking');
      }
    } catch (error) {
      showToast('Network error');
    }
  };

  // Filter bookings
  const activeBookings = bookings.filter(
    (b) => b.status === 'transit' || b.status === 'scheduled' || b.status === 'in_progress'
  );
  const completedBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayedBookings =
    tab === 'all' ? bookings : tab === 'active' ? activeBookings : completedBookings;

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
            <h1 className="text-lg font-bold text-slate-900">All Bookings</h1>
          </div>
          <button
            onClick={loadBookings}
            className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh
          </button>
        </div>

        {/* Tab switch (same as BookingsScreen) */}
        <div className="px-5 pb-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTab('all')}
              className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                tab === 'all'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({bookings.length})
            </button>
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
              Past ({completedBookings.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-5 pt-3 pb-6 flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-300 animate-spin">
              autorenew
            </span>
            <p className="text-xs text-slate-500 mt-2">Loading bookings...</p>
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-300">event_busy</span>
            <p className="text-xs text-slate-500 mt-2">No bookings found</p>
          </div>
        ) : (
          displayedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {booking.id.slice(-8)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-xs font-bold text-slate-800">
                    {booking.categoryName}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    booking.status === 'transit'
                      ? 'bg-cyan-100 text-cyan-900 animate-pulse'
                      : booking.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : booking.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : booking.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {booking.status === 'transit'
                    ? 'En Route'
                    : booking.status === 'in_progress'
                    ? 'In Progress'
                    : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {/* Service Name & Details */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">{booking.serviceTitle}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">
                    calendar_month
                  </span>
                  <span>
                    {booking.date}, {booking.timeSlot}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    location_on
                  </span>
                  <span className="truncate">{booking.address}</span>
                </div>
              </div>

              {/* Specialist Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src={booking.specialist?.avatar || ''}
                    alt={booking.specialist?.name || 'Specialist'}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {booking.specialist?.name || 'Unknown'}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {booking.specialist?.title || 'Specialist'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      showToast(`Calling ${booking.specialist?.name || 'specialist'}...`)
                    }
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                    title="Call"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </button>
                  <button
                    onClick={() => showToast(`Chat with ${booking.specialist?.name || 'specialist'}`)}
                    className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center cursor-pointer"
                    title="Chat"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                  </button>
                </div>
              </div>

              {/* Status Update Section (Admin only) */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Update Status
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['scheduled', 'transit', 'in_progress', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(booking.id, s)}
                      disabled={booking.status === s}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                        booking.status === s
                          ? 'bg-blue-600 text-white cursor-not-allowed'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100">
                <div className="font-bold text-slate-900">
                  Total:{' '}
                  <span className="text-blue-600">
                    LKR {(booking.price || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      showToast(`Booking ${booking.id.slice(-8)} details viewed`)
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
