import React from 'react';
import { ArrowLeft, Clock3, PackageOpen } from 'lucide-react';
import { CATEGORIES, SERVICES } from '../../data/mockData';
import { IOSStatusBar } from '../common/iOSStatusBar';

interface AdminCategoryServicesScreenProps {
  categoryId: string;
  onBack: () => void;
}

export const AdminCategoryServicesScreen: React.FC<AdminCategoryServicesScreenProps> = ({
  categoryId,
  onBack,
}) => {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  const categoryServices = SERVICES.filter((service) => service.categoryId === categoryId);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shrink-0">
        <IOSStatusBar />
        <div className="h-14 px-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to categories"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 truncate">{category?.name ?? 'Category'} Services</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">All services</h2>
            <p className="mt-1 text-xs text-slate-500">Services assigned to this category</p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            {categoryServices.length} services
          </span>
        </div>

        {categoryServices.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {categoryServices.map((service) => (
              <article key={service.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">{service.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{service.description}</p>
                  </div>
                  {service.badge && (
                    <span className="shrink-0 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock3 size={14} />{service.duration}
                  </span>
                  <div className="text-right">
                    {service.originalPrice && (
                      <span className="mr-1.5 text-xs text-slate-400 line-through">LKR {service.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-sm font-bold text-slate-900">LKR {service.price.toLocaleString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl px-5 py-10 text-center">
            <PackageOpen size={28} className="mx-auto text-slate-400" />
            <p className="mt-3 text-sm font-semibold text-slate-800">No services in this category</p>
            <p className="mt-1 text-xs text-slate-500">There are no services assigned to this category yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};