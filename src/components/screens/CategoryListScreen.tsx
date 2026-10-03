import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { CATEGORIES } from '../../data/mockData';

interface CategoryListScreenProps {
  onBack: () => void;
  onSelectCategory: (categoryId: string) => void;
  onCustomQuote: () => void;
}

export const CategoryListScreen: React.FC<CategoryListScreenProps> = ({
  onBack,
  onSelectCategory,
  onCustomQuote,
}) => {
  const [query, setQuery] = useState('');

  const filteredCategories = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 pb-6 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
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
            <h1 className="text-base font-bold text-slate-900">Service Categories</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-5 pt-3 pb-6 flex flex-col gap-4">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 material-symbols-outlined text-[20px] text-slate-400">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 120+ verified home services..."
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 shadow-xs"
          />
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-base font-bold text-slate-900">Explore Categories</h2>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
            {filteredCategories.length} Main Verticals
          </span>
        </div>

        {/* Categories Grid (2 Columns like Image 7) */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-300 active:scale-95 transition-all text-center cursor-pointer group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${cat.iconBgClass}`}
              >
                <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{cat.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="text-xs text-slate-500 font-medium">{cat.specCount} Specialists</span>
              </div>
            </button>
          ))}
        </div>

        {/* 100% Satisfaction Guarantee */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Satisfaction Guarantee</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Background-checked pros with coverage warranty</p>
          </div>
        </div>

        {/* Custom Project CTA Banner */}
        <div
          onClick={onCustomQuote}
          className="p-4 rounded-2xl bg-blue-600 text-white flex items-center justify-between shadow-md cursor-pointer hover:bg-blue-700 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white leading-tight truncate">
                Need a professional service p...
              </h4>
              <p className="text-[11px] text-blue-100 mt-0.5 truncate">Get custom quotes for large projects</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
};
