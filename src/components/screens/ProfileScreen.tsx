import React, { useRef, useState } from 'react';
import { Save, X } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { USER_AVATAR } from '../../data/mockData';
import { UserRole } from '../../types';

interface ProfileDetails {
  name: string;
  email: string;
  avatar: string;
}

const DEFAULT_PROFILE: ProfileDetails = {
  name: 'Ahmed Al-Mansoori',
  email: 'ahmed.mansoori@example.com',
  avatar: USER_AVATAR,
};

const loadProfile = (): ProfileDetails => {
  try {
    const storedUser = sessionStorage.getItem('homemate_user') ?? localStorage.getItem('homemate_user');
    const user = storedUser ? JSON.parse(storedUser) as { id?: string; fullName?: string; email?: string } : null;
    const profileKey = `homemate-profile:${user?.id ?? user?.email ?? 'default'}`;
    const storedProfile = localStorage.getItem(profileKey);
    const profile = storedProfile ? JSON.parse(storedProfile) as Partial<ProfileDetails> : {};

    return {
      name: profile.name || user?.fullName || DEFAULT_PROFILE.name,
      email: profile.email || user?.email || DEFAULT_PROFILE.email,
      avatar: profile.avatar || DEFAULT_PROFILE.avatar,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
};

interface ProfileScreenProps {
  onPaymentHistory: () => void;
  currentRole: UserRole;
  onLogout: () => void;
  onBack?: () => void;
  showToast: (msg: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentRole,
  onPaymentHistory,
  onSwitchRole,
  onLogout,
  onBack,
  showToast,
}) => {
  const [profile, setProfile] = useState<ProfileDetails>(loadProfile);
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({});
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const openEditor = () => {
    setDraftProfile(profile);
    setProfileErrors({});
    setIsEditing(true);
  };

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedProfile = {
      ...profile,
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
      nextErrors.email = 'Enter a valid email address.';
    }

    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const storedUser = sessionStorage.getItem('homemate_user') ?? localStorage.getItem('homemate_user');
      const user = storedUser ? JSON.parse(storedUser) as { id?: string; email?: string } : null;
      const profileKey = `homemate-profile:${user?.id ?? user?.email ?? 'default'}`;
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setIsEditing(false);
      showToast('Profile details updated.');
    } catch {
      showToast('Unable to save profile details. Please check your browser storage settings and try again.');
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Choose an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => showToast('Unable to read this image. Please try another file.');
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => showToast('Unable to open this image. Please try another file.');
      image.onload = () => {
        const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
        const cropX = (image.naturalWidth - cropSize) / 2;
        const cropY = (image.naturalHeight - cropSize) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        if (!context) {
          showToast('Unable to process this image in your browser.');
          return;
        }

        try {
          context.drawImage(image, cropX, cropY, cropSize, cropSize, 0, 0, 512, 512);
          const avatar = canvas.toDataURL('image/jpeg', 0.82);
          const updatedProfile = { ...profile, avatar };
          const storedUser = sessionStorage.getItem('homemate_user') ?? localStorage.getItem('homemate_user');
          const user = storedUser ? JSON.parse(storedUser) as { id?: string; email?: string } : null;
          const profileKey = `homemate-profile:${user?.id ?? user?.email ?? 'default'}`;
          localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
          setProfile(updatedProfile);
          showToast('Profile picture updated.');
        } catch {
          showToast('Unable to save the profile picture. Please try a smaller image.');
        }
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 pb-6 relative overflow-x-hidden overflow-y-auto no-scrollbar scroll-y-only flex-1">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xs shrink-0">
        <IOSStatusBar />

        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 cursor-pointer"
                aria-label="Go Back"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
            )}
            <h1 className="text-lg font-bold text-slate-900">Account Profile</h1>
          </div>
          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit
          </button>
        </div>
      </header>

      {/* User Card */}
      <main className="px-5 pt-5 pb-8 flex flex-col gap-5">
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-5 shadow-sm">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-100/60" />
          <div className="absolute right-10 top-16 h-12 w-12 rounded-full bg-sky-100/70" />
          <div className="relative flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={`${profile.name} profile`}
                className="h-[76px] w-[76px] rounded-full object-cover ring-4 ring-white shadow-md"
              />
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                aria-label="Choose profile picture"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                aria-label="Change profile picture"
                title="Change profile picture"
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Your account</p>
              <h2 className="truncate text-lg font-extrabold leading-tight text-slate-900">{profile.name}</h2>
              <p className="mt-1 truncate text-xs text-slate-500">{profile.email}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2.5 py-1 text-[10px] font-bold capitalize text-blue-700">
                  <span className="material-symbols-outlined text-[13px]">account_circle</span>
                {currentRole} account
              </span>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <button onClick={onPaymentHistory} className="w-full bg-white rounded-2xl border border-slate-100 px-4 py-4 flex items-center justify-between text-sm font-semibold text-slate-800">
          <span>Payment History & Receipts</span><span className="text-blue-600">View →</span>
        </button>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
        <section>
          <div className="mb-2.5 flex items-end justify-between px-1">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Account & preferences</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">Manage your HomeMate experience</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400">tune</span>
          </div>
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white text-xs shadow-sm divide-y divide-slate-100">
          <button
            onClick={() => showToast('Saved Address: 14/2 Alfred House Gardens, Colombo 03')}
            className="group flex min-h-[64px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-blue-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                <span className="material-symbols-outlined text-[20px]">home</span>
              </span>
              <span className="font-bold text-slate-800">Saved Addresses</span>
            </div>
            <span className="flex items-center gap-1 text-slate-400">1 saved <span className="material-symbols-outlined text-[17px]">chevron_right</span></span>
          </button>

          <button
            onClick={() => showToast('Payment Methods: Visa card ending in •••• 4242 & Cash On Delivery active')}
            className="group flex min-h-[64px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-blue-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </span>
              <span className="font-bold text-slate-800">Payment & Escrow Methods</span>
            </div>
            <span className="flex items-center gap-1 text-slate-400">Visa •• 4242 <span className="material-symbols-outlined text-[17px]">chevron_right</span></span>
          </button>

          <button
            onClick={() => showToast('HomeCare Protection Guarantee is 100% active on all your booked services')}
            className="group flex min-h-[64px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-emerald-50/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </span>
              <span className="font-bold text-slate-800">HomeCare 30-Day Protection</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-emerald-600">Active <span className="material-symbols-outlined text-[17px]">chevron_right</span></span>
          </button>

          <button
            onClick={() => showToast('Notifications enabled for technician tracking & discounts')}
            className="group flex min-h-[64px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-blue-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </span>
              <span className="font-bold text-slate-800">Push Notifications & SMS</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-blue-600">Enabled <span className="material-symbols-outlined text-[17px]">chevron_right</span></span>
          </button>
        </div>
        </section>

        {/* Support & Logout */}
        <section>
          <h2 className="mb-2.5 px-1 text-sm font-extrabold text-slate-900">Help & account</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white text-xs shadow-sm divide-y divide-slate-100">
          <button
            onClick={() => showToast('HomeMate 24/7 Hotline: +94 11 234 5678')}
            className="group flex min-h-[60px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-blue-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </span>
              <span className="font-bold text-slate-800">24/7 Customer Support Hotline</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>

          <button
            onClick={onLogout}
            className="group flex min-h-[60px] w-full items-center justify-between px-4 py-3 text-left font-bold text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 transition-colors group-hover:bg-rose-100">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </span>
              <span>Log Out</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-rose-300">chevron_right</span>
          </button>
        </div>
        </section>
      </main>
      {isEditing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        >
          <form
            onSubmit={saveProfile}
            noValidate
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-heading"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 id="edit-profile-heading" className="text-base font-bold text-slate-900">Edit profile</h2>
                <p className="mt-1 text-xs text-slate-500">Update your account details.</p>
              </div>
              <button type="button" onClick={() => setIsEditing(false)} aria-label="Close edit profile" className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
                <X size={19} />
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <img
                src={profile.avatar}
                alt="Profile picture preview"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">Profile picture</p>
                <p className="mt-0.5 text-[11px] text-slate-500">JPG, PNG or WebP · up to 5 MB</p>
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                Change
              </button>
            </div>
            <label className="block text-xs font-semibold text-slate-700">
              Full name
              <input
                autoFocus
                required
                value={draftProfile.name}
                maxLength={80}
                aria-invalid={Boolean(profileErrors.name)}
                aria-describedby={profileErrors.name ? 'profile-name-error' : undefined}
                onChange={(event) => {
                  setDraftProfile((draft) => ({ ...draft, name: event.target.value }));
                  if (profileErrors.name) setProfileErrors((errors) => ({ ...errors, name: undefined }));
                }}
                className={`mt-1.5 h-11 w-full rounded-lg border px-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-100 ${profileErrors.name ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'}`}
              />
              {profileErrors.name && <span id="profile-name-error" role="alert" className="mt-1 block text-xs font-normal text-rose-600">{profileErrors.name}</span>}
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Email address
              <input
                required
                type="email"
                value={draftProfile.email}
                aria-invalid={Boolean(profileErrors.email)}
                aria-describedby={profileErrors.email ? 'profile-email-error' : undefined}
                onChange={(event) => {
                  setDraftProfile((draft) => ({ ...draft, email: event.target.value }));
                  if (profileErrors.email) setProfileErrors((errors) => ({ ...errors, email: undefined }));
                }}
                className={`mt-1.5 h-11 w-full rounded-lg border px-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-100 ${profileErrors.email ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'}`}
              />
              {profileErrors.email && <span id="profile-email-error" role="alert" className="mt-1 block text-xs font-normal text-rose-600">{profileErrors.email}</span>}
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setIsEditing(false)} className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700">
                <Save size={15} /> Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
