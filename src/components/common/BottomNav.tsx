import React from 'react';
import { ScreenId } from '../../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  activeBookingsCount?: number;
  unreadMessagesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const tabs = [
    {
      id: 'home' as ScreenId,
      label: 'Home',
      icon: (color: string) => (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Peaked roof and outer house outline */}
          <path d="M3 10.2L12 3l9 7.2V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V10.2z" />
          {/* Inner doorway */}
          <path d="M9.5 21.5v-6.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6.5" />
        </svg>
      ),
    },
    {
      id: 'bookings' as ScreenId,
      label: 'Bookings',
      icon: (color: string) => (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Calendar boundary */}
          <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
          {/* Twin binder rings */}
          <line x1="16" y1="2" x2="16" y2="6.5" />
          <line x1="8" y1="2" x2="8" y2="6.5" />
          {/* Calendar header partition line */}
          <line x1="3" y1="9.5" x2="21" y2="9.5" />
          {/* 6 Grid date dots */}
          <circle cx="7.8" cy="13.2" r="0.9" fill={color} stroke="none" />
          <circle cx="12" cy="13.2" r="0.9" fill={color} stroke="none" />
          <circle cx="16.2" cy="13.2" r="0.9" fill={color} stroke="none" />
          <circle cx="7.8" cy="16.8" r="0.9" fill={color} stroke="none" />
          <circle cx="12" cy="16.8" r="0.9" fill={color} stroke="none" />
          <circle cx="16.2" cy="16.8" r="0.9" fill={color} stroke="none" />
        </svg>
      ),
    },
    {
      id: 'messages' as ScreenId,
      label: 'Messages',
      icon: (color: string) => (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Chat bubble with lower-left speech tail */}
          <path d="M21 14.5a2 2 0 0 1-2 2H7.2l-4.2 4.2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9.5z" />
        </svg>
      ),
    },
    {
      id: 'history' as ScreenId,
      label: 'History',
      icon: (color: string) => (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Serrated zigzag top and receipt body */}
          <path d="M5 18.5V4.5l2-1.2 2 1.2 2-1.2 2 1.2 2-1.2 2 1.2V16" />
          {/* Curled roll bottom edge */}
          <path d="M5 16h11.5a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2" />
          {/* Receipt bill print lines */}
          <line x1="8.5" y1="8" x2="15.5" y2="8" />
          <line x1="8.5" y1="11.5" x2="13" y2="11.5" />
        </svg>
      ),
    },
    {
      id: 'profile' as ScreenId,
      label: 'Profile',
      icon: (color: string) => (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Circular head */}
          <circle cx="12" cy="8" r="3.8" />
          {/* Shoulders */}
          <path d="M5 20.2a7 7 0 0 1 14 0" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="sticky bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-slate-200/80 shadow-[0_-2px_8px_rgba(0,0,0,0.02)] shrink-0 select-none">
      <div className="grid grid-cols-5 items-center pt-2.5 pb-4 px-1">
        {tabs.map((tab) => {
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'home' && (currentScreen === 'categories' || currentScreen === 'category-detail'));

          const activeColor = '#2563EB'; // Vibrant HomeMate blue
          const inactiveColor = '#2E384D'; // Exact dark slate from image

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              type="button"
              className="flex flex-col items-center justify-center gap-1 w-full cursor-pointer transition-transform active:scale-95 group focus:outline-none"
              aria-label={tab.label}
            >
              <div className="flex items-center justify-center">
                {tab.icon(isActive ? activeColor : inactiveColor)}
              </div>
              <span
                className={`text-[12px] leading-tight tracking-tight ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-[#2E384D] font-medium group-hover:text-slate-900'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};
