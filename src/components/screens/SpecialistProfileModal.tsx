import React from 'react';
import { Specialist } from '../../types';

interface SpecialistProfileModalProps {
  specialist: Specialist | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (specialist: Specialist) => void;
  showToast: (msg: string) => void;
}

export const SpecialistProfileModal: React.FC<SpecialistProfileModalProps> = ({
  specialist,
  isOpen,
  onClose,
  onSendMessage,
  showToast,
}) => {
  if (!isOpen || !specialist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[414px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar animate-slide-up">
        {/* iOS Native Bottom Sheet Drag Handle */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">badge</span>
            <span className="text-sm font-bold text-slate-900">Verified Specialist Profile</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="py-4 flex flex-col items-center text-center border-b border-slate-100">
          <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2 ring-4 ring-blue-100 shadow-md">
            <img src={specialist.avatar} alt={specialist.name} className="w-full h-full object-cover" />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <h3 className="text-lg font-bold text-slate-900">{specialist.name}</h3>
            <span className="material-symbols-outlined text-blue-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">{specialist.title} • {specialist.experience}</p>

          <div className="flex items-center gap-3 mt-3">
            <div className="bg-amber-50 px-3 py-1 rounded-xl text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-900">
                <span className="material-symbols-outlined text-[15px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {specialist.rating}
              </div>
              <span className="text-[10px] text-amber-700">Rating</span>
            </div>

            <div className="bg-blue-50 px-3 py-1 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-900 block">{specialist.jobsCompleted}+</span>
              <span className="text-[10px] text-blue-700">Jobs Done</span>
            </div>

            <div className="bg-emerald-50 px-3 py-1 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-900 block">100%</span>
              <span className="text-[10px] text-emerald-700">Vetted</span>
            </div>
          </div>
        </div>

        {/* Bio & Skills */}
        <div className="py-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">About Specialist</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{specialist.bio}</p>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-3 mb-1.5">Expertise & Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {specialist.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Credentials badge */}
          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">verified_user</span>
            <div>
              <h5 className="text-xs font-bold text-emerald-900">HomeMate Background Check Passed</h5>
              <p className="text-[10px] text-emerald-700">Police clearance, identity verification & insurance active</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              onClose();
              onSendMessage(specialist);
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Send Message
          </button>
          <button
            onClick={() => showToast(`Calling ${specialist.name}...`)}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
