import {
  ArrowRight,
  Building2,
  Code2,
  Droplets,
  Landmark,
  Map as MapIcon,
  Mountain,
  Search,
  Sparkles,
  Trees,
  Waves,
} from 'lucide-react';
import { useState } from 'react';
import type { Category, Destination, Language } from '../types/tourism';
import { getLocalizedText } from '../utils/tourismLogic';
import { resolveDestinationImage } from '../data/destinationImages';
import { TRANSLATIONS } from '../i18n/translations';
import { DestinationCard } from './DestinationCard';
import { SafeImage } from './SafeImage';

interface HomeViewProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  categories: Category[];
  destinations: Destination[];
  favoriteIds: number[];
  onSelectDestination: (destination: Destination) => void;
  onToggleFavorite: (destinationId: number) => void;
  onNavigateExplore: (opts?: {
    search?: string;
    categorySlug?: string;
    onlyPopular?: boolean;
    viewMode?: 'list' | 'map';
  }) => void;
  onOpenDeliverables: () => void;
}

function renderCategoryIcon(iconName: string) {
  const cls = 'w-5 h-5 text-[#0D5C46]';
  switch (iconName) {
    case 'landmark':
      return <Landmark className={cls} aria-hidden="true" />;
    case 'waves':
      return <Waves className={cls} aria-hidden="true" />;
    case 'mountain':
      return <Mountain className={cls} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className={cls} aria-hidden="true" />;
    case 'building':
      return <Building2 className={cls} aria-hidden="true" />;
    case 'droplets':
      return <Droplets className={cls} aria-hidden="true" />;
    case 'trees':
      return <Trees className={cls} aria-hidden="true" />;
    default:
      return <Landmark className={cls} aria-hidden="true" />;
  }
}

export function HomeView({
  language,
  onChangeLanguage,
  categories,
  destinations,
  favoriteIds,
  onSelectDestination,
  onToggleFavorite,
  onNavigateExplore,
  onOpenDeliverables,
}: HomeViewProps) {
  const t = TRANSLATIONS[language];
  const [heroQuery, setHeroQuery] = useState('');

  const featured = destinations.filter((d) => d.isFeatured);
  const popular = destinations.filter((d) => d.isPopular).slice(0, 6);
  const recommended = destinations.filter((d) => d.isRecommended).slice(0, 3);
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateExplore({ search: heroQuery, viewMode: 'list' });
  };

  return (
    <div className="space-y-9 md:space-y-14">
      {/* Toolbar: Language switch + Developer source kit access (below top bar per Top Bar Contract) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3.5">
        <div className="flex items-center gap-2 text-xs text-[#5A655F]">
          <span className="font-medium text-[#0D5C46]">{t.hero.eyebrow}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            {destinations.length} {t.home.destinationsCount}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="inline-flex items-center p-1 rounded-xl bg-[#EFECE6] border border-[#E5E0D8]"
            role="group"
            aria-label={t.profile.languageLabel}
          >
            <button
              type="button"
              onClick={() => onChangeLanguage('en')}
              aria-pressed={language === 'en'}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                language === 'en'
                  ? 'bg-white text-[#17211C] shadow-xs'
                  : 'text-[#5A655F] hover:text-[#17211C]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('km')}
              aria-pressed={language === 'km'}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 khmer-text ${
                language === 'km'
                  ? 'bg-white text-[#17211C] shadow-xs'
                  : 'text-[#5A655F] hover:text-[#17211C]'
              }`}
            >
              ភាសាខ្មែរ
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenDeliverables}
            className="min-h-[40px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D8D2C5] bg-white text-xs font-medium text-[#17211C] hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
          >
            <Code2 className="w-4 h-4 text-[#0D5C46]" aria-hidden="true" />
            <span>{t.hero.sourceKitBtn}</span>
          </button>
        </div>
      </div>

      {/* Hero Split Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center py-2 space-y-6">
          <div className="space-y-4">
            <h1
              className={`text-4xl sm:text-5xl font-bold text-[#17211C] leading-[1.12] tracking-tight text-balance ${
                language === 'km' ? 'khmer-text text-3xl sm:text-4xl leading-[1.35]' : ''
              }`}
            >
              {t.hero.title}
            </h1>
            <p
              className={`text-base text-[#4B5650] max-w-xl leading-relaxed ${
                language === 'km' ? 'khmer-text' : ''
              }`}
            >
              {t.hero.subtitle}
            </p>
          </div>

          <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#6B7570] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="hero-search-input" className="sr-only">
                {t.hero.searchPlaceholder}
              </label>
              <input
                id="hero-search-input"
                type="search"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="w-full min-h-[48px] pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D8D2C5] text-sm text-[#17211C] placeholder:text-[#7D8781] focus:outline-2 focus:outline-[#0D5C46]"
              />
            </div>
            <button
              type="submit"
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2"
            >
              <span>{t.hero.exploreBtn}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => onNavigateExplore({ viewMode: 'map' })}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#0D5C46] hover:underline"
            >
              <MapIcon className="w-4 h-4" aria-hidden="true" />
              <span>{t.hero.mapBtn}</span>
            </button>
            <span className="text-[#D8D2C5]" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              onClick={() => onNavigateExplore({ onlyPopular: true, viewMode: 'list' })}
              className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-medium text-[#4B5650] hover:text-[#17211C]"
            >
              <span>{t.home.popularTitle}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <button
            type="button"
            onClick={() => destinations[0] && onSelectDestination(destinations[0])}
            className="group relative w-full h-full min-h-[300px] sm:min-h-[380px] rounded-3xl overflow-hidden border border-[#E5E0D8] block text-left"
            aria-label="Open Angkor Wat destination guide"
          >
            <SafeImage
              src={resolveDestinationImage('angkor_wat')}
              alt="Angkor Wat sunrise reflection in Siem Reap, Cambodia"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="text-xs text-[#E7C973] font-medium mb-1">
                {language === 'km' ? 'សៀមរាប · ប្រាសាទបុរាណ' : 'Siem Reap · UNESCO World Heritage'}
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${language === 'km' ? 'khmer-text' : ''}`}>
                {language === 'km' ? 'ប្រាសាទអង្គរវត្ត' : 'Angkor Wat'}
              </div>
              <div className="text-xs text-white/80 font-mono mt-1 tabular-nums">
                13.4125° N, 103.8670° E
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section aria-labelledby="home-categories-heading">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2
              id="home-categories-heading"
              className={`text-2xl sm:text-3xl font-bold text-[#17211C] ${
                language === 'km' ? 'khmer-text text-xl sm:text-2xl' : ''
              }`}
            >
              {t.home.categoriesTitle}
            </h2>
            <p className={`text-sm text-[#5A655F] mt-1 ${language === 'km' ? 'khmer-text' : ''}`}>
              {t.home.categoriesSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateExplore({ categorySlug: 'all', viewMode: 'list' })}
            className="text-sm font-medium text-[#0D5C46] hover:underline whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center"
          >
            {t.home.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {categories.map((cat) => {
            const count = destinations.filter((d) => d.categoryId === cat.id).length;
            const catTitle = getLocalizedText(cat.nameEn, cat.nameKm, language);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigateExplore({ categorySlug: cat.slug, viewMode: 'list' })}
                className="min-h-[112px] p-4 rounded-2xl bg-white border border-[#E5E0D8] hover:border-[#0D5C46] text-left flex flex-col justify-between transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0D5C46]/10 flex items-center justify-center group-hover:bg-[#0D5C46]/15 transition-colors">
                  {renderCategoryIcon(cat.icon)}
                </div>
                <div className="mt-3">
                  <div
                    className={`text-sm font-semibold text-[#17211C] leading-snug ${
                      language === 'km' ? 'khmer-text text-xs' : ''
                    }`}
                  >
                    {catTitle}
                  </div>
                  <div className="text-xs text-[#6B7570] mt-0.5 tabular-nums">
                    {count}{' '}
                    {language === 'km'
                      ? t.home.destinationsCount
                      : count === 1
                        ? 'destination'
                        : 'destinations'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Destinations */}
      <section aria-labelledby="home-featured-heading">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2
            id="home-featured-heading"
            className={`text-2xl sm:text-3xl font-bold text-[#17211C] ${
              language === 'km' ? 'khmer-text text-xl sm:text-2xl' : ''
            }`}
          >
            {t.home.featuredTitle}
          </h2>
          <button
            type="button"
            onClick={() => onNavigateExplore({ viewMode: 'list' })}
            className="text-sm font-medium text-[#0D5C46] hover:underline whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center"
          >
            {t.home.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((dest) => (
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
      </section>

      {/* Popular Destinations */}
      <section aria-labelledby="home-popular-heading">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2
            id="home-popular-heading"
            className={`text-2xl sm:text-3xl font-bold text-[#17211C] ${
              language === 'km' ? 'khmer-text text-xl sm:text-2xl' : ''
            }`}
          >
            {t.home.popularTitle}
          </h2>
          <button
            type="button"
            onClick={() => onNavigateExplore({ onlyPopular: true, viewMode: 'list' })}
            className="text-sm font-medium text-[#0D5C46] hover:underline whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center"
          >
            {t.home.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popular.map((dest) => (
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
      </section>

      {/* Recommended Places */}
      {recommended.length > 0 && (
        <section aria-labelledby="home-recommended-heading" className="pb-4">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2
              id="home-recommended-heading"
              className={`text-2xl sm:text-3xl font-bold text-[#17211C] ${
                language === 'km' ? 'khmer-text text-xl sm:text-2xl' : ''
              }`}
            >
              {t.home.recommendedTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((dest) => (
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
        </section>
      )}
    </div>
  );
}
