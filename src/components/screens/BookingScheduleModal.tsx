import React, { useState } from 'react';
import { ServiceItem } from '../../types';

interface BookingScheduleModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDetails: {
    serviceId: string;
    serviceTitle: string;
    categoryName: string;
    date: string;
    timeSlot: string;
    address: string;
    price: number;
    promoCode?: string;
  }) => void | Promise<void>;
  showToast: (msg: string) => void;
}

export const BookingScheduleModal: React.FC<BookingScheduleModalProps> = ({
  service,
  isOpen,
  onClose,
  onConfirm,
  showToast,
}) => {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('2:30 PM - 4:30 PM');
  const [address, setAddress] = useState('14/2 Alfred House Gardens, Colombo 03');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !service) return null;

  const days = [
    { label: 'Today', date: '27 Sep' },
    { label: 'Tomorrow', date: '28 Sep' },
    { label: 'Mon', date: '29 Sep' },
    { label: 'Tue', date: '30 Sep' },
  ];

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:30 AM - 1:30 PM',
    '2:30 PM - 4:30 PM',
    '5:00 PM - 7:00 PM',
  ];

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      if (promoCode.trim().toUpperCase() === 'HOMECOOL20') {
        const disc = Math.round(service.price * 0.2);
        setDiscount(disc);
        showToast('🎉 Promo applied! 20% discount granted.');
      } else {
        showToast('Invalid promo code. Try "HOMECOOL20"');
      }
    }, 400);
  };

  const finalTotal = Math.max(0, service.price - discount);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[414px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar animate-slide-up">
        {/* iOS Native Bottom Sheet Drag Handle */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                event_available
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Schedule Service</h3>
              <p className="text-[11px] text-slate-500">Pick preferred appointment slot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Selected Service Card */}
        <div className="my-3 p-3 bg-slate-50 rounded-xl flex items-center gap-3">
          <img src={service.image} alt={service.title} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{service.title}</h4>
            <span className="text-[11px] text-slate-500">{service.categoryName} • {service.duration}</span>
          </div>
          <span className="text-xs font-bold text-blue-600">LKR {service.price.toLocaleString()}</span>
        </div>

        {/* Select Date */}
        <div className="mt-2">
          <label className="block text-xs font-bold text-slate-700 mb-2">Select Date</label>
          <div className="grid grid-cols-4 gap-2">
            {days.map((day) => {
              const isSelected = selectedDay === day.label;
              return (
                <button
                  key={day.label}
                  type="button"
                  onClick={() => setSelectedDay(day.label)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold block">{day.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {day.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Time Slot */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">Available Time Window</label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{slot}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-blue-600">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Address */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Service Address</label>
          <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">location_on</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Have a Coupon?</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="e.g. HOMECOOL20"
              className="flex-1 uppercase font-mono text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-blue-600"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={isApplying || !promoCode}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {discount > 0 && (
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              ✓ Promo HOMECOOL20 active: Saved LKR {discount.toLocaleString()}!
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Service Base Rate:</span>
            <span className="font-semibold text-slate-800">LKR {service.price.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Special Discount (20%):</span>
              <span>- LKR {discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Safety & Diagnostic Fee:</span>
            <span className="font-semibold text-emerald-600">FREE</span>
          </div>
          <div className="border-t border-slate-200 pt-1.5 flex justify-between text-sm font-bold text-slate-900">
            <span>Estimated Total:</span>
            <span className="text-blue-600 font-extrabold">LKR {finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || isApplying}
            onClick={async () => {
              if (saving) return;
              setSaving(true);
              try {
              await onConfirm({
                serviceId: service.id,
                serviceTitle: service.title,
                categoryName: service.categoryName,
                date: selectedDay,
                timeSlot: selectedSlot,
                address,
                price: finalTotal,
                promoCode: discount > 0 ? 'HOMECOOL20' : '',
              });
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Unable to save booking');
              } finally { setSaving(false); }
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            {saving ? 'Saving...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};
