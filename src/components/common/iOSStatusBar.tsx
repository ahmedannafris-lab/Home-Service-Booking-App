import React from 'react';

interface IOSStatusBarProps {
  dark?: boolean;
  showIsland?: boolean;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ dark = false, showIsland = true }) => {
  const textColor = dark ? 'text-white' : 'text-slate-900';
  const fillColor = dark ? 'fill-white' : 'fill-slate-900';
  const borderColor = dark ? 'border-white' : 'border-slate-900';
  const bgCurrent = dark ? 'bg-white' : 'bg-slate-900';

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-2 pb-1 text-xs font-semibold tracking-tight select-none z-40 ${textColor} relative shrink-0`}>
      {/* Clock */}
      <span className="text-[13px] font-semibold tracking-tight w-12 text-left">9:41</span>
      
      {/* Real iPhone Dynamic Island */}
      {showIsland && <div className="h-6 w-24 bg-black rounded-full shadow-inner flex items-center justify-between px-2.5 mx-auto pointer-events-none transition-all duration-300">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800/80 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-950/70"></div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900/90"></div>
      </div>}

      {/* Cellular / WiFi / Battery */}
      <div className="flex items-center space-x-1.5 w-12 justify-end">
        {/* Cellular Signal */}
        <svg className={`w-3.5 h-2.5 ${fillColor}`} viewBox="0 0 17 11">
          <rect height="3" rx="0.5" width="2.5" x="0" y="8" />
          <rect height="5.5" rx="0.5" width="2.5" x="4" y="5.5" />
          <rect height="8" rx="0.5" width="2.5" x="8" y="3" />
          <rect height="10.5" rx="0.5" width="2.5" x="12" y="0.5" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg className={`w-3.5 h-2.5 ${fillColor}`} viewBox="0 0 16 12">
          <path d="M8 2.6C10.7 2.6 13.1 3.7 14.8 5.4L16 4.2C13.9 2.1 11.1 0.8 8 0.8C4.9 0.8 2.1 2.1 0 4.2L1.2 5.4C2.9 3.7 5.3 2.6 8 2.6ZM8 6C9.8 6 11.4 6.8 12.6 8L13.8 6.8C12.3 5.3 10.3 4.3 8 4.3C5.7 4.3 3.7 5.3 2.2 6.8L3.4 8C4.6 6.8 6.2 6 8 6ZM8 9.5C6.9 9.5 6 10.4 6 11.5C6 12.6 6.9 13.5 8 13.5C9.1 13.5 10 12.6 10 11.5C10 10.4 9.1 9.5 8 9.5Z" transform="translate(0, -1)" />
        </svg>

        {/* Battery Icon */}
        <div className={`w-4.5 h-2.5 rounded-[3px] border ${borderColor} p-[1px] flex items-center`}>
          <div className={`h-full w-2.5 ${bgCurrent} rounded-[1px]`}></div>
        </div>
      </div>
    </div>
  );
};
