import { Code2, Globe, KeyRound, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import type { Language, User } from '../types/tourism';
import { TRANSLATIONS } from '../i18n/translations';

interface ProfileViewProps {
  language: Language;
  user: User | null;
  favoritesCount: number;
  tripsCount: number;
  onChangeLanguage: (lang: Language) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onUpdateProfile: (name: string, email: string, preferredLanguage: Language) => Promise<void>;
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onOpenAdmin: () => void;
  onOpenDeliverables: () => void;
}

export function ProfileView({
  language,
  user,
  favoritesCount,
  tripsCount,
  onChangeLanguage,
  onLogin,
  onRegister,
  onUpdateProfile,
  onUpdatePassword,
  onLogout,
  onOpenAdmin,
  onOpenDeliverables,
}: ProfileViewProps) {
  const t = TRANSLATIONS[language];

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [profileName, setProfileName] = useState(user?.name ?? '');
  const [profileEmail, setProfileEmail] = useState(user?.email ?? '');
  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    try {
      if (authMode === 'login') {
        await onLogin(authEmail, authPassword);
      } else {
        await onRegister(authName, authEmail, authPassword);
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setAuthError(null);
    setSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Demo sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);
    try {
      await onUpdateProfile(profileName || user?.name || '', profileEmail || user?.email || '', language);
      setProfileStatus(t.profile.profileUpdated);
    } catch (err) {
      setProfileStatus(err instanceof Error ? err.message : 'Failed to update profile.');
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    setPasswordError(null);
    try {
      await onUpdatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordStatus(t.profile.passwordUpdated);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className={`text-3xl sm:text-4xl font-bold text-[#17211C] ${language === 'km' ? 'khmer-text text-2xl sm:text-3xl' : ''}`}>
          {t.profile.title}
        </h1>

        {/* Language Switcher */}
        <div className="inline-flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#0D5C46]" aria-hidden="true" />
          <div className="inline-flex items-center p-1 rounded-xl bg-[#EFECE6] border border-[#E5E0D8]">
            <button
              type="button"
              onClick={() => onChangeLanguage('en')}
              aria-pressed={language === 'en'}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                language === 'en' ? 'bg-white text-[#17211C]' : 'text-[#5A655F]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('km')}
              aria-pressed={language === 'km'}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors khmer-text ${
                language === 'km' ? 'bg-white text-[#17211C]' : 'text-[#5A655F]'
              }`}
            >
              ភាសាខ្មែរ
            </button>
          </div>
        </div>
      </div>

      {!user ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 bg-white rounded-2xl border border-[#E5E0D8] p-6 space-y-5">
            <h2 className="text-2xl font-bold text-[#17211C]">
              {authMode === 'login' ? t.profile.signInTitle : t.profile.registerTitle}
            </h2>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-[#991B1B]"
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                    {t.profile.nameLabel}
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm"
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.profile.emailLabel}
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm"
                />
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.profile.passwordLabel}
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[44px] rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors disabled:opacity-60"
              >
                {authMode === 'login' ? t.profile.signInBtn : t.profile.registerBtn}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthError(null);
              }}
              className="text-xs font-medium text-[#0D5C46] hover:underline"
            >
              {authMode === 'login' ? t.profile.switchToRegister : t.profile.switchToLogin}
            </button>
          </div>

          <div className="md:col-span-5 bg-[#EFECE6] rounded-2xl border border-[#DFD9CE] p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#17211C]">
              {language === 'km' ? 'គណនីសាកល្បងរហ័ស' : 'Quick demo accounts'}
            </h3>
            <p className="text-xs text-[#4B5650] leading-relaxed">
              {language === 'km'
                ? 'ប្រើគណនីខាងក្រោមដើម្បីសាកល្បងរក្សាទុកទីតាំង គម្រោងដំណើរ ឬផ្ទាំងគ្រប់គ្រង Admin។'
                : 'Sign in immediately with seeded credentials to test persistent favorites, travel plans, and Admin CMS tools.'}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('tourist@cambodia.guide', 'password123')}
                disabled={submitting}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#D8D2C5] text-left hover:border-[#0D5C46] transition-colors"
              >
                <div className="text-xs font-semibold text-[#17211C]">{t.profile.demoTouristBtn}</div>
                <div className="text-[11px] font-mono text-[#5A655F]">
                  tourist@cambodia.guide / password123
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@cambodia.guide', 'admin123')}
                disabled={submitting}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#D8D2C5] text-left hover:border-[#0D5C46] transition-colors"
              >
                <div className="text-xs font-semibold text-[#17211C]">{t.profile.demoAdminBtn}</div>
                <div className="text-[11px] font-mono text-[#5A655F]">
                  admin@cambodia.guide / admin123
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Account Summary Banner */}
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D5C46]/10 text-[#0D5C46] flex items-center justify-center shrink-0">
                <UserIcon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#17211C]">{user.name}</h2>
                <div className="flex items-center gap-2 text-xs text-[#5A655F]">
                  <span>{user.email}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize font-medium text-[#0D5C46]">{user.role}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-[#17211C] tabular-nums">{favoritesCount}</div>
                <div className="text-xs text-[#5A655F]">{t.profile.savedCount}</div>
              </div>
              <div className="h-8 w-px bg-[#E5E0D8]" aria-hidden="true" />
              <div>
                <div className="text-2xl font-bold text-[#17211C] tabular-nums">{tripsCount}</div>
                <div className="text-xs text-[#5A655F]">{t.profile.tripsCount}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Edit Profile Form */}
            <form
              onSubmit={handleProfileSave}
              className="bg-white rounded-2xl border border-[#E5E0D8] p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-[#17211C]">{t.profile.editProfileTitle}</h3>
              {profileStatus && (
                <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#065F46]">
                  {profileStatus}
                </div>
              )}
              <div>
                <label htmlFor="edit-name" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.profile.nameLabel}
                </label>
                <input
                  id="edit-name"
                  type="text"
                  required
                  value={profileName || user.name}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.profile.emailLabel}
                </label>
                <input
                  id="edit-email"
                  type="email"
                  required
                  value={profileEmail || user.email}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm"
                />
              </div>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors"
              >
                {t.profile.updateProfileBtn}
              </button>
            </form>

            {/* Change Password Form */}
            <form
              onSubmit={handlePasswordSave}
              className="bg-white rounded-2xl border border-[#E5E0D8] p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-[#17211C] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0D5C46]" aria-hidden="true" />
                <span>{t.profile.changePasswordTitle}</span>
              </h3>
              {passwordStatus && (
                <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#065F46]">
                  {passwordStatus}
                </div>
              )}
              {passwordError && (
                <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                  {passwordError}
                </div>
              )}
              <div>
                <label htmlFor="curr-pass" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.profile.currentPasswordLabel}
                </label>
                <input
                  id="curr-pass"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm"
                />
              </div>
              <div>
                <label htmlFor="new-pass" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.profile.newPasswordLabel}
                </label>
                <input
                  id="new-pass"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm"
                />
              </div>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl border border-[#17211C] text-[#17211C] text-sm font-medium hover:bg-[#F8F7F4] transition-colors"
              >
                {t.profile.updatePasswordBtn}
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#17211C] text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-[#2A3730]"
                >
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>{t.profile.openAdminBtn}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenDeliverables}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D8D2C5] bg-white text-sm font-medium text-[#17211C] inline-flex items-center gap-2 hover:bg-[#F8F7F4]"
              >
                <Code2 className="w-4 h-4 text-[#0D5C46]" aria-hidden="true" />
                <span>{t.profile.openDeliverablesBtn}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#FECACA] text-[#B91C1C] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#FEF2F2]"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>{t.profile.logoutBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
