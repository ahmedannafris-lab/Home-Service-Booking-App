import React, { useState } from 'react';
import { ArrowLeft, Bell, ChevronRight, KeyRound, LogOut, Mail, Pencil, Save, ShieldCheck, Tags, UserRound, X, Users } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';

interface AdminProfileScreenProps {
  onBack: () => void;
  onManageCategories: () => void;
  onManageUsers: () => void;
  onLogout: () => void;
  showToast: (message: string) => void;
}

interface AdminProfileDetails {
  name: string;
  email: string;
}

const DEFAULT_ADMIN_PROFILE: AdminProfileDetails = {
  name: 'HomeMate Admin',
  email: 'admin@homemate.com',
};

const loadAdminProfile = (): AdminProfileDetails => {
  try {
    const storedProfile = window.localStorage.getItem('homemate-admin-profile');
    return storedProfile ? { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(storedProfile) as Partial<AdminProfileDetails> } : DEFAULT_ADMIN_PROFILE;
  } catch {
    return DEFAULT_ADMIN_PROFILE;
  }
};

export const AdminProfileScreen: React.FC<AdminProfileScreenProps> = ({
  onBack,
  onManageCategories,
  onManageUsers,
  onLogout,
  showToast,
}) => {
  const [profile, setProfile] = useState<AdminProfileDetails>(loadAdminProfile);
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({});

  const openEditor = () => {
    setDraftProfile(profile);
    setProfileErrors({});
    setIsEditing(true);
  };

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedProfile = {
      name: draftProfile.name.trim(),
      email: draftProfile.email.trim(),
    };
    const nextErrors: { name?: string; email?: string } = {};

    if (updatedProfile.name.length < 2 || updatedProfile.name.length > 80) {
      nextErrors.name = 'Name must be between 2 and 80 characters.';
    } else if (/\d/.test(updatedProfile.name)) {
      nextErrors.name = 'Name cannot contain numbers.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(updatedProfile.email)) {
      nextErrors.email = 'Enter a valid email address, such as admin@example.com.';
    }

    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setProfile(updatedProfile);
    window.localStorage.setItem('homemate-admin-profile', JSON.stringify(updatedProfile));
    setIsEditing(false);
    showToast('Admin profile details updated.');
  };

  return (
  <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shrink-0">
      <IOSStatusBar />
      <div className="h-14 px-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to admin login"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Admin Profile</h1>
      </div>
    </header>

    <main className="flex-1 px-5 pt-6 pb-8 space-y-5">
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={32} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Platform administrator</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-500 truncate">{profile.email}</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-600">Account status</span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />Active
          </span>
        </div>
      </section>

      <section aria-labelledby="admin-account-heading">
        <div className="mb-2 px-1 flex items-center justify-between gap-3">
          <h2 id="admin-account-heading" className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Account details
          </h2>
          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
          >
            <Pencil size={14} />Edit profile details
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
          <div className="px-4 py-4 flex items-center gap-3">
            <UserRound size={18} className="text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Full name</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{profile.name}</p>
            </div>
          </div>
          <div className="px-4 py-4 flex items-center gap-3">
            <Mail size={18} className="text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Email address</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 break-all">{profile.email}</p>
            </div>
          </div>
          <div className="px-4 py-4 flex items-center gap-3">
            <KeyRound size={18} className="text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Access level</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">Full platform access</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Admin profile settings" className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
        <button
          type="button"
          onClick={onManageUsers}
          className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50"
        >
          <Users size={18} className="text-blue-700" />
          <span className="flex-1 text-sm font-semibold text-slate-800">Manage Users</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={onManageCategories}
          className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50"
        >
          <Tags size={18} className="text-blue-700" />
          <span className="flex-1 text-sm font-semibold text-slate-800">Manage Categories</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => showToast('Security settings are up to date.')}
          className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50"
        >
          <KeyRound size={18} className="text-blue-700" />
          <span className="flex-1 text-sm font-semibold text-slate-800">Security & access</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => showToast('Admin notifications are enabled.')}
          className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50"
        >
          <Bell size={18} className="text-blue-700" />
          <span className="flex-1 text-sm font-semibold text-slate-800">Notifications</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="w-full min-h-12 px-4 flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white text-sm font-semibold text-rose-700 hover:bg-rose-50"
      >
        <LogOut size={18} />
        Log out
      </button>
    </main>

    {isEditing && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-5" role="presentation">
        <form
          onSubmit={saveProfile}
          noValidate
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-admin-profile-heading"
          className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id="edit-admin-profile-heading" className="text-base font-bold text-slate-900">Edit profile details</h2>
            <button type="button" onClick={() => setIsEditing(false)} aria-label="Close edit profile" className="p-1 text-slate-500 hover:text-slate-800">
              <X size={19} />
            </button>
          </div>
          <label className="block text-xs font-semibold text-slate-700">
            Full name
            <input
              required
              value={draftProfile.name}
              maxLength={80}
              aria-invalid={Boolean(profileErrors.name)}
              aria-describedby={profileErrors.name ? 'admin-profile-name-error' : undefined}
              onChange={(event) => {
                setDraftProfile((draft) => ({ ...draft, name: event.target.value }));
                if (profileErrors.name) setProfileErrors((errors) => ({ ...errors, name: undefined }));
              }}
              className={`mt-1.5 w-full h-11 px-3 rounded-lg border text-sm font-normal focus:outline-none focus:border-blue-600 ${profileErrors.name ? 'border-rose-500' : 'border-slate-200'}`}
            />
            {profileErrors.name && <span id="admin-profile-name-error" role="alert" className="mt-1 block text-xs font-normal text-rose-600">{profileErrors.name}</span>}
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            Email address
            <input
              required
              type="email"
              value={draftProfile.email}
              aria-invalid={Boolean(profileErrors.email)}
              aria-describedby={profileErrors.email ? 'admin-profile-email-error' : undefined}
              onChange={(event) => {
                setDraftProfile((draft) => ({ ...draft, email: event.target.value }));
                if (profileErrors.email) setProfileErrors((errors) => ({ ...errors, email: undefined }));
              }}
              className={`mt-1.5 w-full h-11 px-3 rounded-lg border text-sm font-normal focus:outline-none focus:border-blue-600 ${profileErrors.email ? 'border-rose-500' : 'border-slate-200'}`}
            />
            {profileErrors.email && <span id="admin-profile-email-error" role="alert" className="mt-1 block text-xs font-normal text-rose-600">{profileErrors.email}</span>}
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setIsEditing(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="h-10 px-4 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 inline-flex items-center gap-1.5">
              <Save size={15} />Save details
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
  );
};