import React from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { LOGO_URL } from '../../data/mockData';

interface OnboardingScreenProps {
  pageNumber: number;
  totalPages: number;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  accentLabel: string;
  features: string[];
  onNext: () => void;
  onSkip: () => void;
  onSignIn?: () => void;
  onBack?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  pageNumber,
  totalPages,
  title,
  subtitle,
  image,
  badge,
  accentLabel,
  features,
  onNext,
  onSkip,
  onSignIn,
  onBack,
}) => {
  return (
    <div className="w-full min-h-0 flex flex-col bg-white overflow-hidden flex-1">
      <div className="min-h-0 flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-4">
        <div className="absolute top-0 left-0 right-0 z-30">
          <IOSStatusBar dark={false} />
        </div>

        <section className="relative w-full h-[360px] bg-slate-100 flex-shrink-0">
          <img
            alt={title}
            className="w-full h-full object-cover object-center transition-all duration-500"
            src={image}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />

          <div className="absolute top-12 left-5 z-20 flex items-center gap-2">
            {pageNumber > 1 && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white active:scale-90 text-slate-800 flex items-center justify-center shadow-sm backdrop-blur-md border border-white/60 transition-all cursor-pointer"
                aria-label="Back"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/60">
              <img alt="HomeMate Brand Logo" className="w-5 h-5 rounded-md object-contain" src={LOGO_URL} />
              <span className="text-xs font-bold text-slate-800 tracking-wide">HomeMate</span>
            </div>
          </div>

          <div className="absolute top-12 right-5 z-20 flex items-center gap-2">
            <button
              onClick={onSkip}
              className="text-xs font-semibold text-slate-700 bg-white/85 hover:bg-white active:scale-95 cursor-pointer backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/60 transition-all"
            >
              Skip
            </button>
            <div className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-[11px] font-semibold text-slate-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              {badge}
            </div>
          </div>
        </section>

        <section className="px-6 pt-6 flex flex-col flex-1 justify-between">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">cell_tower</span>
              {accentLabel}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">{title}</h1>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-[290px] mx-auto font-normal">{subtitle}</p>
          </div>

          <div className="my-5 bg-slate-50 border border-slate-100 rounded-2xl p-3.5 shadow-sm">
            <ul className="space-y-2.5">
              {features.map((feature, index) => (
                <li key={feature} className={`flex items-center gap-3 ${index !== 0 ? 'pt-2 border-t border-slate-200/80' : ''}`}>
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      {index === 0 ? 'verified' : index === 1 ? 'schedule' : 'support_agent'}
                    </span>
                  </span>
                  <span className="text-sm text-slate-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div aria-label={`Onboarding step ${pageNumber} of ${totalPages}`} className="flex items-center justify-center gap-2 py-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                className={`transition-all duration-300 ${
                  pageNumber === index + 1 ? 'w-6 h-2 rounded-full bg-blue-600' : 'w-2 h-2 rounded-full bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Onboarding step ${index + 1}`}
                aria-current={pageNumber === index + 1 ? 'step' : undefined}
              />
            ))}
          </div>
        </section>
      </div>

      <footer className="shrink-0 px-6 pt-2 pb-6 bg-white border-t border-slate-50 flex flex-col items-center">
        <button
          type="button"
          onClick={onNext}
          className="w-full h-12 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span className="text-sm font-semibold tracking-wide">{pageNumber === totalPages ? 'Get Started' : 'Next Step'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <div className="mt-3.5 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onSignIn ?? onSkip}
            className="font-bold text-blue-600 hover:text-blue-700 ml-1 transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>

        <div className="w-32 h-1 bg-slate-300 rounded-full mt-4"></div>
      </footer>
    </div>
  );
};
