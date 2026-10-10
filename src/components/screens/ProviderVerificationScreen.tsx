import React, { useState } from 'react';
import { ArrowLeft, Briefcase, CheckCircle, XCircle, AlertCircle, Check } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { SPECIALISTS } from '../../data/mockData';

interface ProviderVerificationScreenProps {
  providerId: string;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const ProviderVerificationScreen: React.FC<ProviderVerificationScreenProps> = ({ providerId, onBack, showToast }) => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [feeErrorVisible, setFeeErrorVisible] = useState(false);

  // In real app, fetch from backend. Here we use mock data + default fields for verification view
  const baseProvider = SPECIALISTS[providerId];
  const provider = baseProvider || {
    id: providerId || 'pro-01',
    name: 'Kasun Plumbing Services',
    title: 'Residential & Commercial Plumbing',
    email: 'kasunplumbing@gmail.com',
    phone: '0712547723',
    status: 'pending',
    submittedDate: '12 Aug 2026',
    referenceNo: 'VR-8492',
    feePaid: true,
    feeAmount: 'LKR 1,000',
    verified: false,
  };

  const handleApprove = () => {
    // In real app, we check if fee is paid. For mock, let's pretend it is always true unless specified
    const feePaid = (provider as any).feePaid !== false;
    
    if (!feePaid) {
      setFeeErrorVisible(true);
      return;
    }
    showToast(`Provider ${provider.name} approved successfully.`);
    onBack();
  };

  const handleConfirmReject = () => {
    showToast(`Provider ${provider.name} application rejected.`);
    setRejectModalVisible(false);
    onBack();
  };

  const isPending = !provider.verified;

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
          
          <h1 className="text-lg font-bold text-slate-900">Provider Verification</h1>
          
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-24 flex flex-col">
        
        {/* Section 1: Provider Details */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900">Provider Details</h2>
          <button onClick={() => showToast('Edit provider details')} className="text-sm font-semibold text-blue-600">
            Edit
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm mb-5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Briefcase size={20} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">{provider.name}</h3>
            <p className="text-xs text-slate-500">{(provider as any).email || 'contact@example.com'}</p>
            <p className="text-xs text-slate-500">{(provider as any).phone || '071XXXXXXX'}</p>
          </div>
        </div>

        {/* Section 2: Category & Scope */}
        <h2 className="text-sm font-bold text-slate-900 mb-2">Category & Scope</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Briefcase size={16} className="text-blue-600" />
          </div>
          <p className="text-xs font-semibold text-slate-900 flex-1">{provider.title}</p>
        </div>

        {/* Section 3: Verification Status */}
        <h2 className="text-sm font-bold text-slate-900 mb-2">Verification Status</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-5">
          
          {isPending ? (
            <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold text-amber-700">Pending Admin Review</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full mb-2">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-xs font-bold text-green-700">Verified</span>
            </div>
          )}

          <p className="text-[11px] text-slate-500 mb-4">
            Submitted {(provider as any).submittedDate || 'Recently'} • Reference #{(provider as any).referenceNo || 'VR-XXXX'}
          </p>

          <div className="h-px bg-slate-200 my-4 w-full"></div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-xs font-medium text-slate-900">Identity Document Verified</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-xs font-medium text-slate-900">Business Registration & Scope</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-xs font-medium text-slate-900">Contact & Location Confirmed</span>
            </div>
          </div>
        </div>

        {/* Section 4: Fee Banner */}
        {(provider as any).feePaid !== false ? (
          <div className="bg-[#EDFAF4] border border-[#C6EFE0] rounded-xl p-3 flex items-center gap-3 mb-6">
            <CheckCircle size={20} className="text-green-600 shrink-0" />
            <span className="text-xs font-bold text-green-700 flex-1">
              Verification fee paid {(provider as any).feeAmount || 'LKR 1,000'}
            </span>
            <div className="bg-[#DEF4E8] px-2 py-0.5 rounded text-[10px] font-bold text-green-700 tracking-wider">
              PAID
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 mb-6">
            <AlertCircle size={20} className="text-amber-600 shrink-0" />
            <span className="text-xs font-bold text-amber-700 flex-1">
              Verification fee not paid
            </span>
            <div className="bg-[#FDE4B0] px-2 py-0.5 rounded text-[10px] font-bold text-amber-700 tracking-wider">
              UNPAID
            </div>
          </div>
        )}

      </main>

      {/* Action Buttons Fixed Footer */}
      <footer className="sticky bottom-0 left-0 right-0 p-5 bg-slate-50/80 backdrop-blur-md border-t border-slate-200 space-y-3 z-50 mt-auto">
        <button
          onClick={handleApprove}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Check size={20} />
          Approve Provider
        </button>
        <button
          onClick={() => setRejectModalVisible(true)}
          className="w-full h-11 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <XCircle size={18} />
          Reject Application
        </button>
      </footer>

      {/* Reject Modal */}
      {rejectModalVisible && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[320px] p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Reject Application</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to reject the application for {provider.name}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModalVisible(false)}
                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fee Error Modal */}
      {feeErrorVisible && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[320px] p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
              <AlertCircle size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Cannot Approve</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              The verification fee has not been paid. Providers cannot be approved without completing payment.
            </p>
            <button
              onClick={() => setFeeErrorVisible(false)}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
