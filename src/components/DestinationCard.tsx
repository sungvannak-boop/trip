import { Heart, MapPin } from 'lucide-react';
import type { Category, Destination, Language } from '../types/tourism';
import { getLocalizedText } from '../utils/tourismLogic';
import { resolveDestinationImage } from '../data/destinationImages';
import { SafeImage } from './SafeImage';

interface DestinationCardProps {
  destination: Destination;
  category?: Category;
  language: Language;
  isFavorite: boolean;
  onSelect: (destination: Destination) => void;
  onToggleFavorite: (destinationId: number) => void;
}

export function DestinationCard({
  destination,
  category,
  language,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: DestinationCardProps) {
  const title = getLocalizedText(destination.nameEn, destination.nameKm, language);
  const secondaryTitle = language === 'km' ? destination.nameEn : destination.nameKm;
  const province = getLocalizedText(destination.provinceEn, destination.provinceKm, language);
  const categoryName = category
    ? getLocalizedText(category.nameEn, category.nameKm, language)
    : '';
  const description = getLocalizedText(
    destination.descriptionEn,
    destination.descriptionKm,
    language
  );
  const imgSrc = resolveDestinationImage(destination.imageKey, destination.imageUrl);

  return (
    <article className="group bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFECE6]">
        <button
          type="button"
          onClick={() => onSelect(destination)}
          className="w-full h-full block text-left focus-visible:outline-2 focus-visible:outline-[#0D5C46]"
          aria-label={`View details for ${destination.nameEn}`}
        >
          <SafeImage
            src={imgSrc}
            alt={title}
            fallbackTitle={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(destination.id);
          }}
          aria-label={
            isFavorite
              ? `Remove ${destination.nameEn} from favorites`
              : `Save ${destination.nameEn} to favorites`
          }
          aria-pressed={isFavorite}
          className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm text-[#17211C] hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-[#0D5C46]"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-[#B8860B] text-[#B8860B]' : 'text-[#17211C]'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-[#5A655F] mb-1.5">
          <span className="inline-flex items-center gap-1 font-medium text-[#0D5C46]">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            {province}
          </span>
          {categoryName && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{categoryName}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(destination)}
          className="text-left focus-visible:outline-2 focus-visible:outline-[#0D5C46]"
        >
          <h3
            className={`text-xl font-semibold text-[#17211C] group-hover:text-[#0D5C46] transition-colors leading-snug ${
              language === 'km' ? 'khmer-text' : ''
            }`}
          >
            {title}
          </h3>
          <p className="text-xs text-[#6B7570] mt-0.5 khmer-text">{secondaryTitle}</p>
        </button>

        <p
          className={`mt-3 text-sm text-[#4B5650] line-clamp-2 leading-relaxed flex-1 ${
            language === 'km' ? 'khmer-text' : ''
          }`}
        >
          {description}
        </p>

        <div className="mt-4 pt-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
          <span className="font-mono text-[#6B7570] tabular-nums">
            {destination.latitude.toFixed(3)}°N, {destination.longitude.toFixed(3)}°E
          </span>
          <button
            type="button"
            onClick={() => onSelect(destination)}
            className="font-medium text-[#0D5C46] hover:underline whitespace-nowrap shrink-0 py-1 px-1"
          >
            {language === 'km' ? 'មើលលម្អិត' : 'Details'}
          </button>
        </div>
      </div>
    </article>
  );
}
