import { Calendar, Compass, Heart, Home, User as UserIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { AppTab, Category, Destination, Language, Trip, User } from './types/tourism';
import { getStoredToken, setStoredToken, tourismApi } from './utils/api';
import { TRANSLATIONS } from './i18n/translations';
import { AdminDashboardView } from './components/AdminDashboardView';
import { DeliverablesView } from './components/DeliverablesView';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { ExploreView } from './components/ExploreView';
import { FavoritesView } from './components/FavoritesView';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { TripsView } from './components/TripsView';

const GUEST_FAVORITES_KEY = 'kc_guest_favorites';

function readGuestFavorites(): number[] {
  try {
    const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'number') : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(readGuestFavorites);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [tripSeedDestId, setTripSeedDestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Explore filter state
  const [exploreSearch, setExploreSearch] = useState('');
  const [exploreCategory, setExploreCategory] = useState('all');
  const [exploreProvince, setExploreProvince] = useState('all');
  const [exploreOnlyPopular, setExploreOnlyPopular] = useState(false);
  const [exploreViewMode, setExploreViewMode] = useState<'list' | 'map'>('list');

  const t = TRANSLATIONS[language];

  const loadCatalog = useCallback(async () => {
    const [catRes, destRes] = await Promise.all([
      tourismApi.getCategories(),
      tourismApi.getDestinations(),
    ]);
    setCategories(catRes.categories);
    setDestinations(destRes.destinations);
  }, []);

  const loadUserWorkspace = useCallback(async () => {
    const [favRes, tripRes] = await Promise.all([
      tourismApi.getFavorites(),
      tourismApi.getTrips(),
    ]);
    setFavoriteIds(favRes.favoriteIds);
    setTrips(tripRes.trips);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      try {
        await loadCatalog();
        const token = getStoredToken();
        if (token) {
          try {
            const me = await tourismApi.getMe();
            if (mounted) {
              setUser(me.user);
              if (me.user.preferredLanguage === 'km' || me.user.preferredLanguage === 'en') {
                setLanguage(me.user.preferredLanguage);
              }
              await loadUserWorkspace();
            }
          } catch {
            setStoredToken(null);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unable to load tourism catalog.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      mounted = false;
    };
  }, [loadCatalog, loadUserWorkspace]);

  const handleChangeLanguage = async (nextLang: Language) => {
    setLanguage(nextLang);
    if (user) {
      try {
        const res = await tourismApi.updateProfile({
          name: user.name,
          email: user.email,
          preferredLanguage: nextLang,
        });
        setUser(res.user);
      } catch {
        // local switch still applies cleanly
      }
    }
  };

  const handleToggleFavorite = async (destinationId: number) => {
    const isFav = favoriteIds.includes(destinationId);
    if (user) {
      try {
        const res = isFav
          ? await tourismApi.removeFavorite(destinationId)
          : await tourismApi.addFavorite(destinationId);
        setFavoriteIds(res.favoriteIds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update favorite.');
      }
    } else {
      const next = isFav
        ? favoriteIds.filter((id) => id !== destinationId)
        : [...favoriteIds, destinationId];
      setFavoriteIds(next);
      try {
        localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const res = await tourismApi.login({ email, password });
    setStoredToken(res.token);
    setUser(res.user);
    await loadUserWorkspace();
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const res = await tourismApi.register({
      name,
      email,
      password,
      preferredLanguage: language,
    });
    setStoredToken(res.token);
    setUser(res.user);
    await loadUserWorkspace();
  };

  const handleLogout = async () => {
    try {
      await tourismApi.logout();
    } catch {
      // ignore if token already invalidated
    }
    setStoredToken(null);
    setUser(null);
    setTrips([]);
    setFavoriteIds(readGuestFavorites());
  };

  const handleUpdateProfile = async (
    name: string,
    email: string,
    preferredLanguage: Language
  ) => {
    const res = await tourismApi.updateProfile({ name, email, preferredLanguage });
    setUser(res.user);
  };

  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    await tourismApi.updatePassword({ currentPassword, newPassword });
  };

  const handleCreateTrip = async (payload: {
    title: string;
    startDate: string;
    endDate: string;
    notes: string;
    destinations: number[];
  }) => {
    if (!user) {
      setActiveTab('profile');
      throw new Error(t.trips.signInPrompt);
    }
    const res = await tourismApi.createTrip(payload);
    setTrips((prev) => [res.trip, ...prev]);
  };

  const handleUpdateTrip = async (
    id: number,
    payload: {
      title: string;
      startDate: string;
      endDate: string;
      notes: string;
      destinations: number[];
    }
  ) => {
    const res = await tourismApi.updateTrip(id, payload);
    setTrips((prev) => prev.map((tItem) => (tItem.id === id ? res.trip : tItem)));
  };

  const handleDeleteTrip = async (id: number) => {
    await tourismApi.deleteTrip(id);
    setTrips((prev) => prev.filter((tItem) => tItem.id !== id));
  };

  const handleAddToTrip = async (tripId: number, destinationId: number) => {
    const trip = trips.find((tr) => tr.id === tripId);
    if (!trip) return;
    const existingIds = trip.destinations.map((d) => d.destinationId);
    const updatedIds = existingIds.includes(destinationId)
      ? existingIds
      : [...existingIds, destinationId];
    await handleUpdateTrip(tripId, {
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
      notes: trip.notes,
      destinations: updatedIds,
    });
  };

  const handleNavigateExplore = (opts?: {
    search?: string;
    categorySlug?: string;
    onlyPopular?: boolean;
    viewMode?: 'list' | 'map';
  }) => {
    if (opts?.search !== undefined) setExploreSearch(opts.search);
    if (opts?.categorySlug !== undefined) setExploreCategory(opts.categorySlug);
    if (opts?.onlyPopular !== undefined) setExploreOnlyPopular(opts.onlyPopular);
    if (opts?.viewMode !== undefined) setExploreViewMode(opts.viewMode);
    setActiveTab('explore');
  };

  const resetExploreFilters = () => {
    setExploreSearch('');
    setExploreCategory('all');
    setExploreProvince('all');
    setExploreOnlyPopular(false);
  };

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#17211C] pb-20 md:pb-0">
      {/* Desktop & Mobile Top Bar (Strictly 3 zones: Wordmark — 5 Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-30 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[52px] md:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="text-xl font-bold tracking-tight text-[#17211C] whitespace-nowrap shrink-0 font-editorial"
          >
            {t.brandName}
          </button>

          {/* Zone 2: 5 Single-line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4B5650]" aria-label="Main navigation">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeTab === 'home'
                  ? 'border-[#0D5C46] text-[#17211C]'
                  : 'border-transparent hover:text-[#17211C]'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeTab === 'explore'
                  ? 'border-[#0D5C46] text-[#17211C]'
                  : 'border-transparent hover:text-[#17211C]'
              }`}
            >
              {t.nav.explore}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeTab === 'favorites'
                  ? 'border-[#0D5C46] text-[#17211C]'
                  : 'border-transparent hover:text-[#17211C]'
              }`}
            >
              {t.nav.favorites}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trips')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeTab === 'trips'
                  ? 'border-[#0D5C46] text-[#17211C]'
                  : 'border-transparent hover:text-[#17211C]'
              }`}
            >
              {t.nav.trips}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeTab === 'admin'
                  ? 'border-[#0D5C46] text-[#17211C]'
                  : 'border-transparent hover:text-[#17211C]'
              }`}
            >
              {t.nav.admin}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0D5C46] text-white text-xs font-medium hover:bg-[#0A4A38] transition-colors whitespace-nowrap shrink-0"
            >
              {user ? user.name.split(' ')[0] : t.nav.profile}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 md:py-8">
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B] flex items-center justify-between gap-4"
          >
            <span>
              {t.common.errorPrefix} {error}
            </span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-semibold underline shrink-0"
            >
              {t.common.close}
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-[#EFECE6] animate-pulse border border-[#E5E0D8]"
              />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                language={language}
                onChangeLanguage={handleChangeLanguage}
                categories={categories}
                destinations={destinations}
                favoriteIds={favoriteIds}
                onSelectDestination={setSelectedDestination}
                onToggleFavorite={handleToggleFavorite}
                onNavigateExplore={handleNavigateExplore}
                onOpenDeliverables={() => setActiveTab('deliverables')}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreView
                language={language}
                categories={categories}
                destinations={destinations}
                favoriteIds={favoriteIds}
                search={exploreSearch}
                categorySlug={exploreCategory}
                province={exploreProvince}
                onlyPopular={exploreOnlyPopular}
                viewMode={exploreViewMode}
                onSearchChange={setExploreSearch}
                onCategoryChange={setExploreCategory}
                onProvinceChange={setExploreProvince}
                onOnlyPopularChange={setExploreOnlyPopular}
                onViewModeChange={setExploreViewMode}
                onResetFilters={resetExploreFilters}
                onSelectDestination={setSelectedDestination}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesView
                language={language}
                categories={categories}
                destinations={destinations}
                favoriteIds={favoriteIds}
                isAuthenticated={Boolean(user)}
                onSelectDestination={setSelectedDestination}
                onToggleFavorite={handleToggleFavorite}
                onBrowseExplore={() => setActiveTab('explore')}
              />
            )}

            {activeTab === 'trips' && (
              <TripsView
                language={language}
                trips={trips}
                destinations={destinations}
                isAuthenticated={Boolean(user)}
                initialDestinationId={tripSeedDestId}
                onClearInitialDestination={() => setTripSeedDestId(null)}
                onCreateTrip={handleCreateTrip}
                onUpdateTrip={handleUpdateTrip}
                onDeleteTrip={handleDeleteTrip}
                onSelectDestination={setSelectedDestination}
                onGoToProfile={() => setActiveTab('profile')}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                language={language}
                user={user}
                favoritesCount={favoriteIds.length}
                tripsCount={trips.length}
                onChangeLanguage={handleChangeLanguage}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onUpdateProfile={handleUpdateProfile}
                onUpdatePassword={handleUpdatePassword}
                onLogout={handleLogout}
                onOpenAdmin={() => setActiveTab('admin')}
                onOpenDeliverables={() => setActiveTab('deliverables')}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardView
                language={language}
                user={user}
                categories={categories}
                destinations={destinations}
                onRefreshData={loadCatalog}
                onLoginAdminDemo={() =>
                  handleLogin('admin@cambodia.guide', 'admin123')
                }
              />
            )}

            {activeTab === 'deliverables' && (
              <DeliverablesView language={language} />
            )}
          </>
        )}
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block border-t border-[#E5E0D8] bg-white mt-12">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between text-xs text-[#5A655F]">
          <span>Kingdom Compass · Cambodia Tourism Guide</span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveTab('deliverables')}
              className="hover:text-[#17211C] font-medium"
            >
              {t.nav.deliverables}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="hover:text-[#17211C] font-medium"
            >
              {t.nav.admin}
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (5 Tabs: Home, Explore, Favorites, My Trips, Profile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E0D8] pb-safe"
        aria-label="Mobile bottom navigation"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          {(
            [
              { id: 'home', label: t.nav.home, Icon: Home },
              { id: 'explore', label: t.nav.explore, Icon: Compass },
              { id: 'favorites', label: t.nav.favorites, Icon: Heart },
              { id: 'trips', label: t.nav.trips, Icon: Calendar },
              { id: 'profile', label: t.nav.profile, Icon: UserIcon },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                  active ? 'text-[#0D5C46]' : 'text-[#5A655F]'
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className={`text-[10px] font-medium truncate max-w-full ${language === 'km' ? 'khmer-text' : ''}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Destination Details Modal */}
      {selectedDestination && (
        <DestinationDetailModal
          destination={selectedDestination}
          category={categoryById.get(selectedDestination.categoryId)}
          language={language}
          isFavorite={favoriteIds.includes(selectedDestination.id)}
          trips={trips}
          isAuthenticated={Boolean(user)}
          onClose={() => setSelectedDestination(null)}
          onToggleFavorite={handleToggleFavorite}
          onAddToTrip={handleAddToTrip}
          onCreateTripWithDestination={(destId) => {
            setSelectedDestination(null);
            setTripSeedDestId(destId);
            setActiveTab('trips');
          }}
        />
      )}
    </div>
  );
}
