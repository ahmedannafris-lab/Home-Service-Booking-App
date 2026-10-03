import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { HERO_FEMALE_PRO, HERO_MALE_TRANSIT, LOGO_URL } from '../../data/mockData';

interface WalkthroughScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSkip: () => void;
  onBack?: () => void;
}

export const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({
  onGetStarted,
  onSignIn,
  onSkip,
  onBack,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides = [
    {
      title: 'Book with Confidence',
      subtitle: 'Find verified and rated service experts for every home need with transparent pricing.',
      heroImage: HERO_FEMALE_PRO,
      alt: 'Professional female service technician holding digital tablet in modern living room',
      badgeStep: '1 of 3',
      showOverlayCard: false,
      perks: [
        {
          icon: 'bolt',
          title: 'Instant Booking',
          sub: 'In 60 seconds',
        },
        {
          icon: 'sell',
          title: 'Upfront Pricing',
          sub: 'No hidden fee',
        },
        {
          icon: 'verified_user',
          title: '24/7 Verified',
          sub: 'Trained pros',
        },
      ],
    },
    {
      title: 'Verified Home Specialists',
      subtitle: 'Every technician passes background security checks, skill testing, and insurance verification.',
      heroImage: HERO_FEMALE_PRO,
      alt: 'Certified specialist inspection',
      badgeStep: '2 of 3',
      showOverlayCard: false,
      perks: [
        {
          icon: 'security',
          title: 'Vetted Experts',
          sub: '100% Guaranteed',
        },
        {
          icon: 'schedule',
          title: 'On-Time Arrival',
          sub: '45-min express',
        },
        {
          icon: 'thumb_up',
          title: 'Satisfaction',
          sub: 'Free rework',
        },
      ],
    },
    {
      title: 'Live Tracking & Instant Support',
      subtitle: 'Track your technician in real-time with live GPS arrival updates and direct in-app chat assistance for effortless service coordination.',
      heroImage: HERO_MALE_TRANSIT,
      alt: 'Smiling technician with mobile booking app',
      badgeStep: '3 of 3',
      showOverlayCard: true,
      perks: [
        {
          icon: 'explore',
          title: 'Live GPS',
          sub: 'Real-time Map',
        },
        {
          icon: 'forum',
          title: 'Direct Chat',
          sub: 'Instant In-App',
        },
        {
          icon: 'verified_user',
          title: 'Safe Escrow',
          sub: 'Pay After Work',
        },
      ],
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="w-full flex flex-col justify-between h-full min-h-full bg-white overflow-hidden flex-1">
      {/* Scrollable Hero + Content */}
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-4">
        {/* Top iOS Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <IOSStatusBar dark={currentSlide === 2} />
        </div>

        {/* Hero Visual Section */}
        <section className="relative w-full h-[375px] bg-slate-100 flex-shrink-0">
          <img
            alt={slide.alt}
            className="w-full h-full object-cover object-center hero-mask transition-all duration-500"
            src={slide.heroImage}
          />
          {/* Soft gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none hero-mask"></div>

          {/* Floating Brand Logo Badge & Back Button */}
          <div className="absolute top-12 left-5 z-20 flex items-center space-x-2">
            {(currentSlide > 0 || onBack) && (
              <button
                type="button"
                onClick={() => {
                  if (currentSlide > 0) {
                    setCurrentSlide(currentSlide - 1);
                  } else if (onBack) {
                    onBack();
                  }
                }}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white active:scale-90 text-slate-800 flex items-center justify-center shadow-sm backdrop-blur-md border border-white/60 transition-all cursor-pointer"
                aria-label="Previous Slide or Back"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
            )}
            <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/60">
              <img alt="HomeMate Brand Logo" className="w-5 h-5 rounded-md object-contain" src={LOGO_URL} />
              <span className="text-xs font-bold text-slate-800 tracking-wide">HomeMate</span>
            </div>
          </div>

          {/* Skip / Step Indicator on Top-Right */}
          <div className="absolute top-12 right-6 z-20 flex items-center gap-2">
            <button
              onClick={onSkip}
              className="text-xs font-semibold text-slate-700 bg-white/85 hover:bg-white active:scale-95 cursor-pointer backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/60 transition-all"
            >
              Skip
            </button>
            <div className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-[11px] font-semibold text-slate-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              {slide.badgeStep}
            </div>
          </div>

          {/* Overlay Card on Slide 3 (Technician in Transit) */}
          {slide.showOverlayCard && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/60 animate-fade-in">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 text-blue-600">
                <span className="material-symbols-outlined text-[22px]">near_me</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 truncate">Technician in Transit</p>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">4 mins away</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">Alex D. is approaching your location</p>
              </div>
            </div>
          )}
        </section>

        {/* Walkthrough Content Area */}
        <section className="px-6 pt-5 flex flex-col flex-1 justify-between">
          <div className="text-center">
            {currentSlide === 2 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[14px]">cell_tower</span>
                Real-Time Updates
              </div>
            )}
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-[290px] mx-auto font-normal">
              {slide.subtitle}
            </p>
          </div>

          {/* Perks Card */}
          <div className="my-4 bg-slate-50 border border-slate-100 rounded-2xl p-3.5 ios-card-shadow grid grid-cols-3 gap-2">
            {slide.perks.map((perk, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center p-1.5 ${
                  i === 1 ? 'border-x border-slate-200/60' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">{perk.icon}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">{perk.title}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">{perk.sub}</span>
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center space-x-2 py-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 h-2 rounded-full bg-blue-600'
                    : 'w-2 h-2 rounded-full bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Action Footer */}
      <footer className="px-6 pt-2 pb-6 bg-white border-t border-slate-50 flex flex-col items-center">
        <button
          onClick={() => {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(currentSlide + 1);
            } else {
              onGetStarted();
            }
          }}
          className="w-full h-12 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <span className="text-sm font-semibold tracking-wide">
            {currentSlide < slides.length - 1 ? 'Next Step' : 'Get Started'}
          </span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <div className="mt-3.5 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onSignIn}
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
