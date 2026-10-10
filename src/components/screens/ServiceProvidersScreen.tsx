import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, SlidersHorizontal, ChevronRight, Briefcase } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { SPECIALISTS } from '../../data/mockData';
import { Specialist } from '../../types';

interface ServiceProvidersScreenProps {
  onBack: () => void;
  onViewProvider: (providerId: string) => void;
}

export const ServiceProvidersScreen: React.FC<ServiceProvidersScreenProps> = ({ onBack, onViewProvider }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const providers = Object.values(SPECIALISTS);

  const filteredProviders = useMemo(() => {
    return providers.filter((item) => {
      // In this mock, we map 'verified' boolean to a status concept
      const currentStatus = item.verified ? 'verified' : 'pending';
      const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [providers, statusFilter, searchQuery]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shrink-0">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 -ml-2"
          >
            <ArrowLeft size={22} />
          </button>
          
          <h1 className="text-lg font-bold text-slate-900">Service Providers</h1>
          
          <div className="w-10"></div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="h-11 bg-white rounded-xl border border-slate-200 flex items-center px-3 gap-2 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search Service providers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {searchQuery.length > 0 ? (
            <button onClick={() => setSearchQuery('')} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X size={16} />
            </button>
          ) : (
            <button className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <SlidersHorizontal size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 px-5 py-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shadow-sm border ${
            statusFilter === 'all' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Providers
        </button>

        <button
          onClick={() => setStatusFilter('verified')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shadow-sm border ${
            statusFilter === 'verified' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'verified' ? 'bg-green-300' : 'bg-green-500'}`}></span>
          Verified
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shadow-sm border ${
            statusFilter === 'pending' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'pending' ? 'bg-amber-300' : 'bg-amber-500'}`}></span>
          Pending
        </button>
      </div>

      {/* Provider List */}
      <main className="flex-1 px-5 pt-2 pb-24 space-y-3">
        {filteredProviders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No service providers found</h3>
            <p className="text-sm text-slate-500 max-w-[250px]">
              Try adjusting your search terms or filter selection.
            </p>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => onViewProvider(provider.id)}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm active:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Briefcase size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{provider.name}</h3>
                <p className="text-xs text-slate-500 truncate mb-1">{provider.title}</p>
                {provider.verified ? (
                  <div className="inline-flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-bold text-green-700">Verified</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-[10px] font-bold text-amber-700">Pending</span>
                  </div>
                )}
              </div>
              <ChevronRight size={18} className="text-slate-400 shrink-0" />
            </div>
          ))
        )}
      </main>
    </div>
  );
};
