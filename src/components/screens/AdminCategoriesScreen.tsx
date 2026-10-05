import React, { useState } from 'react';
import { ArrowLeft, Search, Tags, UsersRound } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { IOSStatusBar } from '../common/iOSStatusBar';

interface AdminCategoriesScreenProps {
  onBack: () => void;
}

export const AdminCategoriesScreen: React.FC<AdminCategoriesScreenProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const filteredCategories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const totalSpecialists = CATEGORIES.reduce((total, category) => total + category.specCount, 0);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shrink-0">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to admin profile"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Manage Categories</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-8 space-y-5">
        <section className="grid grid-cols-2 gap-3" aria-label="Category overview">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Tags size={16} />
              <span className="text-xs font-medium">Categories</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{CATEGORIES.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <UsersRound size={16} />
              <span className="text-xs font-medium">Specialists</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalSpecialists}</p>
          </div>
        </section>

        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories"
            aria-label="Search categories"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        <section aria-labelledby="admin-category-list-heading">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 id="admin-category-list-heading" className="text-sm font-bold text-slate-800">All categories</h2>
            <span className="text-xs text-slate-500">{filteredCategories.length} shown</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {filteredCategories.map((category) => (
              <div key={category.id} className="px-4 py-3.5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${category.iconBgClass}`}>
                  <span className="material-symbols-outlined text-[21px]">{category.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">{category.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{category.specCount} specialists</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active
                </span>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-slate-500">No categories match your search.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};