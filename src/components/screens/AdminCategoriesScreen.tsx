import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  UsersRound,
  ChevronRight,
  Layers,
  Sparkles,
  Grid,
  List,
  CheckCircle2,
  X,
  Briefcase,
} from 'lucide-react';
import { CATEGORIES, SERVICES } from '../../data/mockData';
import { IOSStatusBar } from '../common/iOSStatusBar';

interface AdminCategoriesScreenProps {
  onBack: () => void;
  onSelectCategory: (categoryId: string) => void;
}

const CATEGORY_THEMES: Record<
  string,
  {
    gradient: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    glow: string;
  }
> = {
  plumbing: {
    gradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-100',
    glow: 'shadow-blue-500/10',
  },
  electrical: {
    gradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-100',
    glow: 'shadow-amber-500/10',
  },
  cleaning: {
    gradient: 'from-teal-500 to-cyan-600',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    borderColor: 'border-teal-100',
    glow: 'shadow-teal-500/10',
  },
  'ac-repair': {
    gradient: 'from-sky-500 to-blue-600',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    borderColor: 'border-sky-100',
    glow: 'shadow-sky-500/10',
  },
  gardening: {
    gradient: 'from-emerald-500 to-green-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-100',
    glow: 'shadow-emerald-500/10',
  },
  painting: {
    gradient: 'from-violet-500 to-purple-600',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-100',
    glow: 'shadow-purple-500/10',
  },
  appliances: {
    gradient: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-100',
    glow: 'shadow-rose-500/10',
  },
};

export const AdminCategoriesScreen: React.FC<AdminCategoriesScreenProps> = ({
  onBack,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular' | 'high_specialists'>('all');

  const totalSpecialists = CATEGORIES.reduce((total, category) => total + category.specCount, 0);
  const totalServices = SERVICES.length;

  const filteredCategories = CATEGORIES.filter((category) => {
    const matchesQuery =
      category.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      (category.heroSubtag && category.heroSubtag.toLowerCase().includes(query.trim().toLowerCase()));

    if (!matchesQuery) return false;

    if (selectedFilter === 'popular') {
      return ['plumbing', 'electrical', 'ac-repair', 'cleaning'].includes(category.id);
    }
    if (selectedFilter === 'high_specialists') {
      return category.specCount >= 14;
    }
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/70 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Sticky Header with Backdrop Blur */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shrink-0 shadow-sm shadow-slate-100">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to admin profile"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200 active:scale-95 transition text-slate-700 cursor-pointer"
            >
              <ArrowLeft size={19} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">Service Categories</h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Manage and configure service verticals</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 space-y-4">
        {/* KPI Performance Strip */}
        <section className="grid grid-cols-3 gap-2.5" aria-label="Category metrics">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
              <Layers size={15} />
            </div>
            <p className="text-[11px] font-medium text-slate-500">Categories</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{CATEGORIES.length}</p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> 100% Active
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
              <UsersRound size={15} />
            </div>
            <p className="text-[11px] font-medium text-slate-500">Specialists</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{totalSpecialists}</p>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Verified pros</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
              <Briefcase size={15} />
            </div>
            <p className="text-[11px] font-medium text-slate-500">Services</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{totalServices}</p>
            <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Configured</span>
          </div>
        </section>

        {/* Search & Quick Filter Pills */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search category or specialty..."
              aria-label="Search categories"
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-white border border-slate-200/90 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Categories ({CATEGORIES.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'popular'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles size={12} /> High Demand
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('high_specialists')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedFilter === 'high_specialists'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Top Specialist Hubs
            </button>
          </div>
        </div>

        {/* Category List / Grid Display */}
        <section aria-labelledby="admin-category-list-heading">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 id="admin-category-list-heading" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category Directory
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-xs font-medium text-slate-500">{filteredCategories.length} available</span>
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 gap-3">
              {filteredCategories.map((category) => {
                const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.plumbing;
                const catServices = SERVICES.filter((s) => s.categoryId === category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className="w-full text-left bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-150 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Rich Photographic Thumbnail with Floating Icon Badge */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-slate-100">
                        <img
                          src={category.cardImage}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gradient-to-tr ${theme.gradient} text-white flex items-center justify-center shadow-md`}
                        >
                          <span className="material-symbols-outlined text-[15px]">{category.icon}</span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {category.heroSubtag || category.heroTagline || `${category.name} solutions`}
                        </p>

                        {/* Metrics Pills */}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            <UsersRound size={11} className="text-slate-500" />
                            {category.specCount} specialists
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            <Briefcase size={11} className="text-slate-500" />
                            {catServices.length} services
                          </span>
                        </div>
                      </div>

                      {/* Arrow Action Indicator */}
                      <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
                        <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
              {filteredCategories.map((category) => {
                const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.plumbing;
                const catServices = SERVICES.filter((s) => s.categoryId === category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className="w-full px-4 py-3 flex items-center gap-3.5 text-left hover:bg-slate-50/80 active:bg-slate-100 transition duration-150 cursor-pointer group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.gradient} text-white flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>{category.specCount} specialists</span>
                        <span>•</span>
                        <span>{catServices.length} services</span>
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty Search State */}
          {filteredCategories.length === 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No categories found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">
                No service categories match &quot;{query}&quot;. Try a different keyword or reset filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer transition"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};