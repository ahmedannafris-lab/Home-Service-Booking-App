import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { LOGO_URL, USER_AVATAR, CATEGORIES } from '../../data/mockData';
import { ServiceItem } from '../../types';
import gardeningFeaturedImage from '../../assets/gardening-featured.jpg';

interface HomeScreenProps {
  services: ServiceItem[];
  onSelectCategory: (categoryId: string) => void;
  onViewAllCategories: () => void;
  onSelectService: (service: ServiceItem) => void;
  onUrgentHelp: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onBack?: () => void;
  showToast: (msg: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  services,
  onSelectCategory,
  onViewAllCategories,
  onSelectService,
  onUrgentHelp,
  onOpenNotifications,
  onOpenProfile,
  onBack,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Colombo, LK');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const locations = ['Colombo, LK', 'Kandy, LK', 'Galle, LK', 'Negombo, LK', 'Dehiwala, LK'];
  const featuredCategory = CATEGORIES.find((category) => category.id === 'gardening') ?? CATEGORIES[0];
  const searchResults = searchQuery.trim()
    ? services.filter((service) =>
        `${service.title} ${service.categoryName} ${service.description}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  // Filtered popular services
  const popularServices = services.slice(0, 4);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 pb-6 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Fixed/Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xs shrink-0">
        <IOSStatusBar />

        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 cursor-pointer -ml-1"
                aria-label="Back"
                title="Back to Welcome"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
            )}
            <img alt="HomeMate" className="h-7 w-auto object-contain" src={LOGO_URL} />
            <span className="text-lg font-bold text-slate-900 tracking-tight">HomeMate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotifications}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-slate-600 text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            <button
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 active:scale-95 transition-transform cursor-pointer"
            >
              <img alt="Ahmed" className="w-full h-full object-cover" src={USER_AVATAR} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col w-full pb-6">
        {/* Location Selector */}
        <section className="px-5 pt-3 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <span className="material-symbols-outlined text-blue-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              <span>{selectedLocation}</span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
            </button>

            {showLocationPicker && (
              <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select City
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationPicker(false);
                      showToast(`Coverage updated to ${loc}`);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between cursor-pointer"
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && (
                      <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Interactive Search Bar */}
        <section className="px-5 py-2">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What service do you need?"
              className="w-full h-12 pl-10 pr-12 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </section>

        {/* Featured service banner */}
        <section className="px-5 py-2">
          <div className="relative h-[272px] overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-md flex flex-col justify-between">
            <img src={gardeningFeaturedImage} alt="Lush garden with trimmed hedges and flowers" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/15" />
            <div className="relative z-10 max-w-[78%]">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-300 text-cyan-950 text-[10px] font-bold tracking-wide uppercase shadow-xs">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
                Featured Service
              </div>

              <h3 className="text-lg font-bold text-white mt-2 leading-tight">
                Give your garden a fresh start
              </h3>
              <p className="mt-1 text-xs text-white/85">Book a trusted local specialist for garden care.</p>
            </div>
            <div className="relative z-10 mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectCategory(featuredCategory.id)}
                className="h-9 px-3.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-cyan-50 transition-colors"
              >
                Explore Gardening
              </button>
            </div>
          </div>
        </section>

        {/* Services Category Grid */}
        <section className="px-5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900">Services</h3>
            <button
              onClick={onViewAllCategories}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group min-h-[112px] flex flex-col items-center justify-start p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 active:scale-[0.98] transition-all text-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px] text-[#193548] mb-5 transition-transform group-hover:scale-105">
                  {cat.icon}
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Urgent Technician Callout Card */}
        <section className="px-5 py-2">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Need urgent help?</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Find verified certified technicians now</p>
              </div>
            </div>
            <button
              onClick={onUrgentHelp}
              className="h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap active:scale-95 shadow-sm transition-transform shrink-0 cursor-pointer"
            >
              Find Now
            </button>
          </div>
        </section>

        {/* Service search results and popular picks */}
        <section className="px-5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">{searchQuery.trim() ? 'Search Results' : 'Popular Services'}</h3>
              <p className="text-xs text-slate-500">{searchQuery.trim() ? `${searchResults.length} matching services` : 'Recommended services for your home'}</p>
            </div>
            {!searchQuery.trim() && (
              <button
                onClick={onViewAllCategories}
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                See All
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {(searchQuery.trim() ? searchResults : popularServices).map((service) => (
              <article
                key={service.id}
                onClick={() => onSelectService(service)}
                className="p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {service.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold text-blue-600 shadow-xs">
                      {service.badge}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-xs font-bold text-slate-900">{service.rating}</span>
                    <span className="text-[11px] text-slate-400">({service.reviewCount} reviews)</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-[11px] text-slate-500">Starting from</span>
                    <span className="text-xs font-bold text-blue-600">
                      LKR {service.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(service);
                  }}
                  className="h-8 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold active:scale-95 shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  Book
                </button>
              </article>
            ))}
            {searchQuery.trim() && searchResults.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-7 text-center">
                <p className="text-sm font-semibold text-slate-800">No matching services</p>
                <p className="mt-1 text-xs text-slate-500">Try a service or category name.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
