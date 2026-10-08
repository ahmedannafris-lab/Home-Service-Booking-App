import React, { useState } from 'react';
import { ArrowLeft, Clock3, PackageOpen, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { ServiceItem } from '../../types';
import { IOSStatusBar } from '../common/iOSStatusBar';

export interface AdminServiceFormValues {
  title: string;
  description: string;
  price: number;
  duration: string;
}

interface AdminCategoryServicesScreenProps {
  categoryId: string;
  services: ServiceItem[];
  onBack: () => void;
  onCreateService: (values: AdminServiceFormValues) => void;
  onUpdateService: (serviceId: string, values: AdminServiceFormValues) => void;
  onDeleteService: (serviceId: string) => void;
}

export const AdminCategoryServicesScreen: React.FC<AdminCategoryServicesScreenProps> = ({
  categoryId,
  services,
  onBack,
  onCreateService,
  onUpdateService,
  onDeleteService,
}) => {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  const categoryServices = services.filter((service) => service.categoryId === categoryId);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<AdminServiceFormValues>({
    title: '',
    description: '',
    price: 0,
    duration: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openCreateForm = () => {
    setEditingServiceId(null);
    setFormValues({ title: '', description: '', price: 0, duration: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setFormValues({
      title: service.title,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingServiceId(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues.title.trim() || !formValues.description.trim() || !formValues.duration.trim() || formValues.price <= 0) return;

    if (editingServiceId) {
      onUpdateService(editingServiceId, { ...formValues, title: formValues.title.trim(), description: formValues.description.trim(), duration: formValues.duration.trim() });
    } else {
      onCreateService({ ...formValues, title: formValues.title.trim(), description: formValues.description.trim(), duration: formValues.duration.trim() });
    }
    closeForm();
  };

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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">All services</h2>
            <p className="mt-1 text-xs text-slate-500">Services assigned to this category</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              {categoryServices.length} services
            </span>
            <button
              type="button"
              onClick={openCreateForm}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              aria-label="Add service"
              title="Add service"
            >
              <Plus size={19} />
            </button>
          </div>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-white border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{editingServiceId ? 'Edit service' : 'Create service'}</h3>
              <button type="button" onClick={closeForm} aria-label="Close form" className="p-1 text-slate-500 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>
            <label className="block text-xs font-semibold text-slate-700">
              Service name
              <input
                required
                value={formValues.title}
                onChange={(event) => setFormValues((values) => ({ ...values, title: event.target.value }))}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-normal focus:outline-none focus:border-blue-600"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Description
              <textarea
                required
                rows={3}
                value={formValues.description}
                onChange={(event) => setFormValues((values) => ({ ...values, description: event.target.value }))}
                className="mt-1.5 w-full p-3 rounded-lg border border-slate-200 text-sm font-normal resize-y focus:outline-none focus:border-blue-600"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-semibold text-slate-700">
                Price (LKR)
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={formValues.price || ''}
                  onChange={(event) => setFormValues((values) => ({ ...values, price: Number(event.target.value) }))}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-normal focus:outline-none focus:border-blue-600"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Duration
                <input
                  required
                  value={formValues.duration}
                  onChange={(event) => setFormValues((values) => ({ ...values, duration: event.target.value }))}
                  placeholder="e.g. 1 Hour"
                  className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-normal focus:outline-none focus:border-blue-600"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={closeForm} className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="h-9 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 inline-flex items-center gap-1.5">
                <Save size={15} />{editingServiceId ? 'Save changes' : 'Create service'}
              </button>
            </div>
          </form>
        )}

        {categoryServices.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {categoryServices.map((service) => (
              <article key={service.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">{service.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {service.badge && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                        {service.badge}
                      </span>
                    )}
                    <button type="button" onClick={() => openEditForm(service)} aria-label={`Edit ${service.title}`} title="Edit service" className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-blue-50 hover:text-blue-700">
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingServiceId(deletingServiceId === service.id ? null : service.id)}
                      aria-label={`Delete ${service.title}`}
                      title="Delete service"
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
                {deletingServiceId === service.id && (
                  <div className="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-rose-700">Delete this service?</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setDeletingServiceId(null)} className="h-8 px-3 rounded-md border border-slate-200 text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="button" onClick={() => { onDeleteService(service.id); setDeletingServiceId(null); }} className="h-8 px-3 rounded-md bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700">Delete</button>
                    </div>
                  </div>
                )}
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