import {
  AlertCircle,
  CalendarPlus,
  Clock,
  ExternalLink,
  Heart,
  Info,
  MapPin,
  Navigation,
  Ticket,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { Category, Destination, Language, Trip } from '../types/tourism';
import {
  buildGoogleMapsUrl,
  formatCoordinates,
  getLocalizedText,
} from '../utils/tourismLogic';
import { resolveDestinationImage } from '../data/destinationImages';
import { SafeImage } from './SafeImage';
import { TRANSLATIONS } from '../i18n/translations';

interface DestinationDetailModalProps {
  destination: Destination;
  category?: Category;
  language: Language;
  isFavorite: boolean;
  trips: Trip[];
  isAuthenticated: boolean;
  onClose: () => void;
  onToggleFavorite: (destinationId: number) => void;
  onAddToTrip: (tripId: number, destinationId: number) => Promise<void>;
  onCreateTripWithDestination: (destinationId: number) => void;
}

export function DestinationDetailModal({
  destination,
  category,
  language,
  isFavorite,
  trips,
  isAuthenticated,
  onClose,
  onToggleFavorite,
  onAddToTrip,
  onCreateTripWithDestination,
}: DestinationDetailModalProps) {
  const t = TRANSLATIONS[language];
  const [selectedTripId, setSelectedTripId] = useState<string>(
    trips[0] ? String(trips[0].id) : ''
  );
  const [addingStatus, setAddingStatus] = useState<'idle' | 'saving' | 'added'>('idle');

  const title = getLocalizedText(destination.nameEn, destination.nameKm, language);
  const altTitle = language === 'km' ? destination.nameEn : destination.nameKm;
  const province = getLocalizedText(destination.provinceEn, destination.provinceKm, language);
  const address = getLocalizedText(destination.addressEn, destination.addressKm, language);
  const description = getLocalizedText(destination.descriptionEn, destination.descriptionKm, language);
  const feeNote = getLocalizedText(
    destination.entranceFeeNoteEn,
    destination.entranceFeeNoteKm,
    language
  );
  const hoursNote = getLocalizedText(
    destination.openingHoursNoteEn,
    destination.openingHoursNoteKm,
    language
  );
  const travelTips = getLocalizedText(
    destination.travelTipsEn,
    destination.travelTipsKm,
    language
  );
  const categoryName = category
    ? getLocalizedText(category.nameEn, category.nameKm, language)
    : '';

  const handleAddTrip = async () => {
    if (!selectedTripId) {
      onCreateTripWithDestination(destination.id);
      return;
    }
    setAddingStatus('saving');
    try {
      await onAddToTrip(Number(selectedTripId), destination.id);
      setAddingStatus('added');
      setTimeout(() => setAddingStatus('idle'), 2200);
    } catch {
      setAddingStatus('idle');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div className="bg-[#FFFFFF] w-full max-w-4xl sm:rounded-3xl overflow-hidden border border-[#E5E0D8] max-h-[100dvh] sm:max-h-[90dvh] flex flex-col">
        {/* Top bar inside dialog */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFECE6] bg-white sticky top-0 z-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#5A655F]">
              <span className="font-medium text-[#0D5C46]">{province}</span>
              {categoryName && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{categoryName}</span>
                </>
              )}
            </div>
            <h2
              id="detail-title"
              className={`text-xl sm:text-2xl font-bold text-[#17211C] truncate ${
                language === 'km' ? 'khmer-text' : ''
              }`}
            >
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleFavorite(destination.id)}
              aria-label={isFavorite ? t.detail.removeFavorite : t.detail.saveFavorite}
              className={`min-h-[44px] px-3.5 rounded-xl border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                isFavorite
                  ? 'border-[#B8860B] bg-[#B8860B]/10 text-[#8A6305]'
                  : 'border-[#D8D2C5] text-[#17211C] hover:bg-[#F8F7F4]'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-[#B8860B] text-[#B8860B]' : ''}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline whitespace-nowrap">
                {isFavorite ? t.detail.removeFavorite : t.detail.saveFavorite}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.common.close}
              className="min-w-[44px] min-h-[44px] rounded-xl border border-[#D8D2C5] flex items-center justify-center text-[#17211C] hover:bg-[#F8F7F4] transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#EFECE6]">
            <SafeImage
              src={resolveDestinationImage(destination.imageKey, destination.imageUrl)}
              alt={title}
              fallbackTitle={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#EFECE6] pb-4">
            <div>
              <h3 className={`text-3xl font-bold text-[#17211C] ${language === 'km' ? 'khmer-text' : ''}`}>
                {title}
              </h3>
              <p className="text-base text-[#5A655F] mt-1 khmer-text">{altTitle}</p>
            </div>
            <div className="font-mono text-xs text-[#4B5650] bg-[#F8F7F4] px-3 py-2 rounded-xl border border-[#E5E0D8] tabular-nums">
              {formatCoordinates(destination.latitude, destination.longitude)}
            </div>
          </div>

          <p className={`text-[15px] sm:text-base text-[#2D3832] leading-relaxed ${language === 'km' ? 'khmer-text' : ''}`}>
            {description}
          </p>

          {/* Practical Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E0D8]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0D5C46] mb-1.5">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>{t.detail.address}</span>
              </div>
              <p className={`text-sm text-[#17211C] ${language === 'km' ? 'khmer-text' : ''}`}>
                {address}
              </p>
              <p className="text-xs text-[#5A655F] mt-1">
                {t.detail.province}: {province}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E0D8]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0D5C46] mb-1.5">
                <Info className="w-4 h-4" aria-hidden="true" />
                <span>{t.detail.travelTips}</span>
              </div>
              <p className={`text-sm text-[#17211C] leading-relaxed ${language === 'km' ? 'khmer-text' : ''}`}>
                {travelTips}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#E8D9B0]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#8A6305]">
                  <Ticket className="w-4 h-4" aria-hidden="true" />
                  {t.detail.entranceFee}
                </span>
                <span className="text-[11px] font-medium text-[#8A6305] inline-flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.detail.verificationBadge}
                </span>
              </div>
              <p className={`text-sm text-[#3F3518] leading-relaxed ${language === 'km' ? 'khmer-text' : ''}`}>
                {feeNote}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#E8D9B0]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#8A6305]">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {t.detail.openingHours}
                </span>
                <span className="text-[11px] font-medium text-[#8A6305] inline-flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.detail.verificationBadge}
                </span>
              </div>
              <p className={`text-sm text-[#3F3518] leading-relaxed ${language === 'km' ? 'khmer-text' : ''}`}>
                {hoursNote}
              </p>
            </div>
          </div>

          <p className={`text-xs text-[#6B7570] ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.detail.verificationNote}
          </p>

          {/* Actions bar */}
          <div className="pt-4 border-t border-[#EFECE6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <a
              href={buildGoogleMapsUrl(destination.latitude, destination.longitude, destination.nameEn)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors whitespace-nowrap"
            >
              <Navigation className="w-4 h-4" aria-hidden="true" />
              <span>{t.detail.openInMaps}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
            </a>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {isAuthenticated && trips.length > 0 ? (
                <>
                  <label htmlFor="trip-select" className="sr-only">
                    {t.detail.selectTrip}
                  </label>
                  <select
                    id="trip-select"
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="min-h-[44px] rounded-xl border border-[#D8D2C5] bg-white px-3 py-2 text-sm text-[#17211C] max-w-[220px]"
                  >
                    {trips.map((trip) => (
                      <option key={trip.id} value={trip.id}>
                        {trip.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddTrip}
                    disabled={addingStatus === 'saving'}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#17211C] text-white text-sm font-medium hover:bg-[#2A3730] transition-colors whitespace-nowrap"
                  >
                    <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                    <span>{addingStatus === 'added' ? t.detail.addedToTrip : t.detail.addToTrip}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onCreateTripWithDestination(destination.id)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#17211C] text-[#17211C] text-sm font-medium hover:bg-[#F8F7F4] transition-colors whitespace-nowrap"
                >
                  <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                  <span>{t.detail.createNewTrip}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
