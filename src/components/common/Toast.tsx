import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, icon = 'check_circle' }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 text-white shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-bounce-short border border-slate-700/60 max-w-[90%]">
      <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
      <span className="text-xs font-semibold tracking-wide text-slate-100 truncate">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-1 p-0.5 text-xs">
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
