import React, { useState } from 'react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { CATEGORIES, SERVICES, SPECIALISTS, REVIEWS } from '../../data/mockData';
import { ServiceCategory, ServiceItem, Specialist } from '../../types';

interface CategoryDetailScreenProps {
  categoryId: string;
  onBack: () => void;
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
  onMessageSpecialist: (specialist: Specialist) => void;
  onViewSpecialistProfile: (specialist: Specialist) => void;
  showToast: (msg: string) => void;
}

export const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  categoryId,
  onBack,
  onSelectService,
  onBookService,
  onMessageSpecialist,
  onViewSpecialistProfile,
  showToast,
}) => {
  const category: ServiceCategory =
    CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const specialist: Specialist =
    SPECIALISTS[category.specialistId] || SPECIALISTS.kamal;
  const review = REVIEWS[category.specialistId] || REVIEWS.kamal;

  const [activeFilter, setActiveFilter] = useState('All Services');
  const [searchWord, setSearchWord] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // All category services
  const categoryServices = SERVICES.filter((s) => s.categoryId === category.id);
  // Default to first item selected for the bottom drawer
  const activeSelected = selectedService || categoryServices[0] || SERVICES[0];

  const filteredServices = categoryServices.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchWord.toLowerCase()) ||
      s.description.toLowerCase().includes(searchWord.toLowerCase());
    if (activeFilter === 'All Services') return matchesSearch;
    return (
      matchesSearch &&
      (s.title.toLowerCase().includes(activeFilter.toLowerCase()) ||
        s.features.some((f) => f.toLowerCase().includes(activeFilter.toLowerCase())))
    );
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 pb-6 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xs shrink-0">
        <IOSStatusBar />

        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 cursor-pointer shrink-0"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-base font-bold text-slate-900 truncate">
              {category.name} Services
            </h1>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => showToast('Saved to your bookmarked categories')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </button>
            <button
              onClick={() => onViewSpecialistProfile(specialist)}
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col w-full pb-4">
        {/* Search Bar */}
        <section className="px-5 pt-3 pb-2">
          <div className="relative flex items-center w-full bg-white rounded-xl border border-slate-200 px-3.5 py-2.5 shadow-xs">
            <span className="material-symbols-outlined text-blue-600 text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder={`Search ${category.name.toLowerCase()} services, diagnostics...`}
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
            />
            {searchWord && (
              <button
                onClick={() => setSearchWord('')}
                className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer mr-1"
              >
                <span className="material-symbols-outlined text-[12px]">close</span>
              </button>
            )}
            <button
              onClick={() => showToast('Listening for voice search...')}
              className="text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>
        </section>

        {/* Hero Banner */}
        <section className="px-5 py-2">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md min-h-[220px] flex flex-col justify-between p-4 text-white">
            <img
              src={category.heroImage}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent"></div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-blue-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-[11px] font-bold text-slate-900">Verified {category.name}s</span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-cyan-400/90 backdrop-blur-md px-3 py-1 rounded-full text-slate-950 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-cyan-900 animate-pulse"></span>
                <span>{category.availableToday} Available Today</span>
              </div>
            </div>

            {/* Headline */}
            <div className="relative z-10 mt-6">
              <span className="text-[11px] uppercase font-bold tracking-wider text-cyan-300 block mb-1">
                {category.heroTagline}
              </span>
              <h2 className="text-xl font-bold text-white leading-tight drop-shadow-sm mb-3 whitespace-pre-line">
                {category.heroHeadline}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {category.heroBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="py-2">
          <div className="flex items-center gap-2 overflow-x-auto px-5 no-scrollbar py-1">
            {category.filterPills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setActiveFilter(pill)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === pill
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </section>

        {/* Services List */}
        <section className="px-5 py-2 flex flex-col gap-3.5">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
              <p className="text-xs text-slate-500 mt-2">No services found for "{searchWord}".</p>
              <button
                onClick={() => {
                  setSearchWord('');
                  setActiveFilter('All Services');
                }}
                className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredServices.map((service) => {
              const isDrawerActive = activeSelected.id === service.id;
              return (
                <article
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    onSelectService(service);
                  }}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer group ${
                    isDrawerActive
                      ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-100 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-[10px] px-2.5 py-0.5 rounded-full ${
                        service.badgeType === 'warning'
                          ? 'bg-rose-100 text-rose-800'
                          : service.badgeType === 'secondary'
                          ? 'bg-cyan-100 text-cyan-900'
                          : service.badgeType === 'tertiary'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {service.badgeType === 'warning' ? 'emergency' : 'local_fire_department'}
                      </span>
                      {service.badge || 'Verified'}
                    </span>

                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="text-xs font-bold text-slate-900">{service.rating}</span>
                      <span className="text-[11px] text-slate-400">({service.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {service.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        <span className="material-symbols-outlined text-[13px] text-blue-600">check</span>
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-slate-900">
                          LKR {service.price.toLocaleString()}
                        </span>
                        {service.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            LKR {service.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        {service.originalPrice
                          ? `Save LKR ${(service.originalPrice - service.price).toLocaleString()} today`
                          : 'Upfront verified rate'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                        onBookService(service);
                      }}
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Book Now
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* HomeMate Care Guarantee Banner */}
        <section className="px-5 py-3">
          <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-md flex items-center gap-3.5 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                security
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white mb-0.5">HomeMate Care Guarantee</h4>
              <p className="text-[11px] text-blue-100 leading-snug">
                Background-checked {category.name.toLowerCase()} technicians backed by up to LKR 50,000 damage coverage warranty.
              </p>
            </div>
          </div>
        </section>

        {/* Specialist on Duty Spotlight */}
        <section className="px-5 py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Specialist on Duty</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {specialist.status}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
            <div className="flex items-start gap-3 mb-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-slate-100 ring-2 ring-blue-100">
                <img
                  className="w-full h-full object-cover"
                  src={specialist.avatar}
                  alt={specialist.name}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{specialist.name}</h4>
                  <span className="material-symbols-outlined text-blue-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{specialist.title} • {specialist.experience}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    {specialist.rating}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{specialist.jobsCompleted}+ jobs completed</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 mb-3 text-xs">
              <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <span className="material-symbols-outlined text-[16px]">near_me</span>
                <span>Nearby ({specialist.distance}) • Ready to dispatch</span>
              </div>
              <span className="text-slate-500 font-medium">ETA {specialist.eta}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onMessageSpecialist(specialist)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                Message
              </button>
              <button
                onClick={() => onViewSpecialistProfile(specialist)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                View Profile
              </button>
            </div>
          </div>
        </section>

        {/* Recent Customer Feedback */}
        <section className="px-5 py-2">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Verified Customer Feedback</h3>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {review.initials}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{review.author}</h5>
                  <span className="text-[10px] text-slate-400">{review.location} • {review.date}</span>
                </div>
              </div>
              <div className="flex text-amber-500">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">{review.comment}</p>
          </div>
        </section>
      </div>

      {/* Bottom Booking Summary Drawer */}
      <aside className="sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-xl z-30 px-5 py-3 transition-transform duration-300 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Selected Service
            </span>
            <p className="text-xs font-bold text-slate-900 truncate">
              {activeSelected.title}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[11px] text-slate-500">Total:</span>
              <span className="text-sm font-bold text-blue-600">
                LKR {activeSelected.price.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => onBookService(activeSelected)}
            className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Proceed</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
