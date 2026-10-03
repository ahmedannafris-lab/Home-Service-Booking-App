import React from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { Booking } from '../../types';

interface HistoryScreenProps {
  bookings: Booking[];
  onRebook: (booking: Booking) => void;
  onBack?: () => void;
  showToast: (msg: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  bookings,
  onRebook,
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
            <h1 className="text-lg font-bold text-slate-900">Service History</h1>
          </div>
          <button
            onClick={() => showToast('Exporting complete year-to-date PDF statement...')}
            className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export All
          </button>
        </div>
      </header>

      {/* History List */}
      <div className="px-5 pt-3 pb-6 flex flex-col gap-3.5">
        <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-800 block">Total Services Received</span>
            <span className="text-slate-500">All covered under 30-day warranty</span>
          </div>
          <span className="text-base font-extrabold text-blue-600">{bookings.length} Orders</span>
        </div>

        {bookings.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 font-bold">{item.id}</span>
              <span className="text-slate-400">{item.createdAt}</span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.serviceTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.categoryName} • Specialist {item.specialist.name}</p>
              </div>
              <span className="text-sm font-extrabold text-slate-900 shrink-0">
                LKR {item.price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => showToast(`Receipt #${item.id}.pdf downloaded`)}
                className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">receipt</span>
                Invoice
              </button>

              <button
                onClick={() => onRebook(item)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Re-Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
