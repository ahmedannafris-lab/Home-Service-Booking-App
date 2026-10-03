import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { ServiceItem, Specialist } from '../../types';
import { SPECIALISTS } from '../../data/mockData';

interface ServiceDetailScreenProps {
  service: ServiceItem;
  onBack: () => void;
  onScheduleBooking: (service: ServiceItem) => void;
  onViewSpecialist: (specialist: Specialist) => void;
  showToast: (msg: string) => void;
}

export const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({
  service,
  onBack,
  onScheduleBooking,
  onViewSpecialist,
  showToast,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const specialist: Specialist =
    SPECIALISTS[service.specialistId || 'kamal'] || SPECIALISTS.kamal;

  const defaultIncludes = [
    'New high-grade water pipe installation',
    'Drainage pipe alignment & secure connection',
    'Bathroom and kitchen sink pipe resolution',
    'Installation of new fittings, valves, & O-rings',
    'Precision leak testing & pressure gauge check',
    'Replacement of rusted or damaged segments',
    'General home plumbing safety & seal inspection',
  ];

  const includesList = service.includesList || defaultIncludes;

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 pb-4 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xs shrink-0">
        <IOSStatusBar />

        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 cursor-pointer"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-base font-bold text-slate-900">Service Details</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Notifications: No pending service alerts')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col w-full pb-6">
        {/* Hero Visual Image Card */}
        <section className="px-5 pt-3">
          <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-md bg-slate-200">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            {/* Top Pills */}
            <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
              <span className="text-[11px] font-bold text-slate-900">Verified Specialist</span>
            </div>

            <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFavorited(!isFavorited);
                  showToast(isFavorited ? 'Removed from favorites' : 'Saved to favorites');
                }}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-500 active:scale-90 transition-all cursor-pointer shadow-xs"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isFavorited ? 'text-rose-500' : 'text-slate-700'
                  }`}
                  style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Service link copied to clipboard!');
                }}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-blue-600 active:scale-90 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>

            {/* Bottom Duration Badge */}
            <div className="absolute bottom-3.5 left-3.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>{service.duration}</span>
            </div>
          </div>
        </section>

        {/* Title, Rating & Pricing Header */}
        <section className="px-5 pt-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {service.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="text-xs font-bold text-slate-900">{service.rating}</span>
                <span className="text-xs text-slate-500">({service.reviewCount} verified reviews)</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-lg font-extrabold text-blue-600 block">
                LKR {service.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400">Base service rate</span>
            </div>
          </div>
        </section>

        {/* 30-Day Peace of Mind Warranty Card */}
        <section className="px-5 py-2">
          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">30-Day Peace of Mind Warranty</h3>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Complimentary prompt rework and complete pressure check if any leak or valve issue arises within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="px-5 py-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {service.description} Our certified technicians plan clean layouts, assemble durable connections, and install fittings with rigorous pressure leak testing to ensure continuous worry-free plumbing.
          </p>
        </section>

        {/* Service Includes Checklist */}
        <section className="px-5 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Includes</h2>
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
                {includesList.length} Key Items
              </span>
            </div>
            <button
              onClick={() => showToast('Detailed scope PDF available upon booking confirmation')}
              className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              View Summary
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
            {includesList.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-xs text-slate-700 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Assigned Specialist */}
        <section className="px-5 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Specialist</h2>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Available Today
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 ring-2 ring-blue-100">
                <img src={specialist.avatar} alt={specialist.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{specialist.name}</h3>
                <p className="text-[11px] text-slate-500 truncate">
                  {specialist.title} • {specialist.experience}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-amber-500 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-xs font-bold text-slate-900">{specialist.rating}</span>
                  <span className="text-[10px] text-slate-400">({specialist.jobsCompleted} jobs completed)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewSpecialist(specialist)}
              className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold shrink-0 cursor-pointer"
            >
              Profile
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Booking Bar */}
      <footer className="sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 px-5 py-3 shadow-xl z-30 flex items-center justify-between gap-4 shrink-0">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            ESTIMATED TOTAL
          </span>
          <span className="text-lg font-black text-blue-600">
            LKR {service.price.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => onScheduleBooking(service)}
          className="flex-1 h-12 px-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Select Date & Time</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
