import { Compass, LayoutGrid, Map as MapIcon, Search } from 'lucide-react';
import type { Category, Destination, Language } from '../types/tourism';
import { filterDestinations, getLocalizedText } from '../utils/tourismLogic';
import { TRANSLATIONS } from '../i18n/translations';
import { CambodiaMap } from './CambodiaMap';
import { DestinationCard } from './DestinationCard';

interface ExploreViewProps {
  language: Language;
  categories: Category[];
  destinations: Destination[];
  favoriteIds: number[];
  search: string;
  categorySlug: string;
  province: string;
  onlyPopular: boolean;
  viewMode: 'list' | 'map';
  onSearchChange: (val: string) => void;
  onCategoryChange: (slug: string) => void;
  onProvinceChange: (prov: string) => void;
  onOnlyPopularChange: (val: boolean) => void;
  onViewModeChange: (mode: 'list' | 'map') => void;
  onResetFilters: () => void;
  onSelectDestination: (destination: Destination) => void;
  onToggleFavorite: (destinationId: number) => void;
}

export function ExploreView({
  language,
  categories,
  destinations,
  favoriteIds,
  search,
  categorySlug,
  province,
  onlyPopular,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onProvinceChange,
  onOnlyPopularChange,
  onViewModeChange,
  onResetFilters,
  onSelectDestination,
  onToggleFavorite,
}: ExploreViewProps) {
  const t = TRANSLATIONS[language];
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const provinces = Array.from(
    new Set(destinations.map((d) => d.provinceEn))
  ).sort();

  const filtered = filterDestinations(destinations, categories, {
    search,
    categorySlug,
    province,
    onlyPopular,
  });

  return (
    <div className="space-y-6">
      {/* Header & View Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-bold text-[#17211C] ${language === 'km' ? 'khmer-text text-2xl sm:text-3xl' : ''}`}>
            {t.explore.title}
          </h1>
          <p className={`text-sm text-[#5A655F] mt-1 ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.explore.subtitle}
          </p>
        </div>

        <div
          className="inline-flex items-center p-1 rounded-xl bg-[#EFECE6] border border-[#E5E0D8] self-start"
          role="group"
          aria-label="Display mode"
        >
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            aria-pressed={viewMode === 'list'}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'list'
                ? 'bg-white text-[#17211C] shadow-xs'
                : 'text-[#5A655F] hover:text-[#17211C]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" aria-hidden="true" />
            <span>{t.explore.listView}</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('map')}
            aria-pressed={viewMode === 'map'}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'map'
                ? 'bg-white text-[#17211C] shadow-xs'
                : 'text-[#5A655F] hover:text-[#17211C]'
            }`}
          >
            <MapIcon className="w-4 h-4" aria-hidden="true" />
            <span>{t.explore.mapView}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search
              className="w-4 h-4 text-[#6B7570] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="explore-search" className="sr-only">
              {t.explore.searchPlaceholder}
            </label>
            <input
              id="explore-search"
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.explore.searchPlaceholder}
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-[#DFD9CE] text-sm text-[#17211C] focus:outline-2 focus:outline-[#0D5C46]"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="explore-province" className="sr-only">
              {t.explore.allProvinces}
            </label>
            <select
              id="explore-province"
              value={province}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#F8F7F4] border border-[#DFD9CE] text-sm text-[#17211C] focus:outline-2 focus:outline-[#0D5C46]"
            >
              <option value="all">{t.explore.allProvinces}</option>
              {provinces.map((prov) => {
                const sample = destinations.find((d) => d.provinceEn === prov);
                const label = sample
                  ? getLocalizedText(sample.provinceEn, sample.provinceKm, language)
                  : prov;
                return (
                  <option key={prov} value={prov}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center">
            <button
              type="button"
              onClick={() => onOnlyPopularChange(!onlyPopular)}
              aria-pressed={onlyPopular}
              className={`w-full min-h-[44px] px-4 py-2 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap ${
                onlyPopular
                  ? 'border-[#0D5C46] bg-[#0D5C46] text-white'
                  : 'border-[#DFD9CE] bg-[#F8F7F4] text-[#17211C] hover:bg-[#EFECE6]'
              }`}
            >
              {t.explore.popularOnly}
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            aria-pressed={categorySlug === 'all'}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              categorySlug === 'all'
                ? 'bg-[#17211C] text-white'
                : 'bg-[#F8F7F4] text-[#4B5650] hover:bg-[#EFECE6]'
            }`}
          >
            {t.explore.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              aria-pressed={categorySlug === cat.slug}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                categorySlug === cat.slug
                  ? 'bg-[#17211C] text-white'
                  : 'bg-[#F8F7F4] text-[#4B5650] hover:bg-[#EFECE6]'
              } ${language === 'km' ? 'khmer-text' : ''}`}
            >
              {getLocalizedText(cat.nameEn, cat.nameKm, language)}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-[#5A655F]">
        <span className="tabular-nums font-medium">
          {filtered.length} {t.explore.resultsCount}
        </span>
        {(search || categorySlug !== 'all' || province !== 'all' || onlyPopular) && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[#0D5C46] font-medium hover:underline min-h-[36px] px-2"
          >
            {t.explore.resetFilters}
          </button>
        )}
      </div>

      {/* Results View or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-12 text-center max-w-xl mx-auto">
          <Compass className="w-10 h-10 text-[#8A6305] mx-auto mb-3" aria-hidden="true" />
          <h2 className={`text-xl font-semibold text-[#17211C] ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.explore.emptyTitle}
          </h2>
          <p className={`text-sm text-[#5A655F] mt-2 ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.explore.emptyBody}
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors"
          >
            {t.explore.resetFilters}
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <CambodiaMap
          destinations={filtered}
          language={language}
          onSelectDestination={onSelectDestination}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              category={categoryById.get(dest.categoryId)}
              language={language}
              isFavorite={favoriteIds.includes(dest.id)}
              onSelect={onSelectDestination}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
