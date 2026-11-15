import { Heart } from 'lucide-react';
import type { Category, Destination, Language } from '../types/tourism';
import { TRANSLATIONS } from '../i18n/translations';
import { DestinationCard } from './DestinationCard';

interface FavoritesViewProps {
  language: Language;
  categories: Category[];
  destinations: Destination[];
  favoriteIds: number[];
  isAuthenticated: boolean;
  onSelectDestination: (destination: Destination) => void;
  onToggleFavorite: (destinationId: number) => void;
  onBrowseExplore: () => void;
}

export function FavoritesView({
  language,
  categories,
  destinations,
  favoriteIds,
  isAuthenticated,
  onSelectDestination,
  onToggleFavorite,
  onBrowseExplore,
}: FavoritesViewProps) {
  const t = TRANSLATIONS[language];
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const savedDestinations = destinations.filter((d) => favoriteIds.includes(d.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl sm:text-4xl font-bold text-[#17211C] ${language === 'km' ? 'khmer-text text-2xl sm:text-3xl' : ''}`}>
          {t.favorites.title}
        </h1>
        <p className={`text-sm text-[#5A655F] mt-1 ${language === 'km' ? 'khmer-text' : ''}`}>
          {t.favorites.subtitle}
        </p>
      </div>

      {!isAuthenticated && (
        <div className="rounded-2xl bg-[#FFFDF7] border border-[#E8D9B0] px-4 py-3 text-xs text-[#6B4F06]">
          {t.favorites.loginNotice}
        </div>
      )}

      {savedDestinations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-12 text-center max-w-xl mx-auto">
          <Heart className="w-10 h-10 text-[#B8860B] mx-auto mb-3" aria-hidden="true" />
          <h2 className={`text-xl font-semibold text-[#17211C] ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.favorites.emptyTitle}
          </h2>
          <p className={`text-sm text-[#5A655F] mt-2 ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.favorites.emptyBody}
          </p>
          <button
            type="button"
            onClick={onBrowseExplore}
            className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors"
          >
            {t.favorites.browseBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              category={categoryById.get(dest.categoryId)}
              language={language}
              isFavorite
              onSelect={onSelectDestination}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
