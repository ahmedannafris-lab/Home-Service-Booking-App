import React from 'react';
import { Booking } from '../../types';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  showToast,
}) => {
  if (!isOpen || !booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'transit':
        return 'bg-cyan-100 text-cyan-900';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-900';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[414px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar animate-slide-up">
        {/* Drag Handle */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                receipt_long
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Booking Details
              </h3>
              <p className="text-[11px] text-slate-500">
                Booking #{booking.id.slice(-8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Status
          </span>
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(
              booking.status
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        {/* Service Card */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl">
          <h4 className="text-sm font-bold text-slate-900">{booking.serviceTitle}</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">{booking.categoryName}</p>
        </div>

        {/* Details List */}
        <div className="mt-4 space-y-3">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                calendar_month
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Date & Time
              </p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {booking.date}
              </p>
              <p className="text-[11px] text-slate-500">{booking.timeSlot}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                location_on
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Service Address
              </p>
              <p className="text-xs font-medium text-slate-700 mt-0.5 leading-snug">
                {booking.address}
              </p>
            </div>
          </div>

          {/* Specialist */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                engineering
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Assigned Specialist
              </p>
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={booking.specialist?.avatar || ''}
                  alt={booking.specialist?.name || 'Specialist'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {booking.specialist?.name || 'Unknown'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {booking.specialist?.title || 'Specialist'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                schedule
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Booked On
              </p>
              <p className="text-xs font-medium text-slate-700 mt-0.5">
                {booking.createdAt || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wide">
              Total Amount
            </span>
            <span className="text-[10px] text-blue-100">LKR</span>
          </div>
          <div className="text-2xl font-extrabold mt-1">
            {(booking.price || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-blue-100 mt-1">
            Includes all service charges & warranty
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              showToast(`📧 Receipt for ${booking.id.slice(-8)} sent to your email`);
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
