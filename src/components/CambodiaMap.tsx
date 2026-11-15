import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import type { Destination, Language } from '../types/tourism';
import {
  buildGoogleMapsUrl,
  formatCoordinates,
  getLocalizedText,
  projectCambodiaCoords,
} from '../utils/tourismLogic';
import { resolveDestinationImage } from '../data/destinationImages';
import { SafeImage } from './SafeImage';
import { TRANSLATIONS } from '../i18n/translations';

interface CambodiaMapProps {
  destinations: Destination[];
  language: Language;
  onSelectDestination: (destination: Destination) => void;
}

const MAP_WIDTH = 760;
const MAP_HEIGHT = 440;

const PROVINCE_LABELS = [
  { nameEn: 'Siem Reap', nameKm: 'សៀមរាប', lat: 13.7, lng: 103.85 },
  { nameEn: 'Battambang', nameKm: 'បាត់ដំបង', lat: 13.1, lng: 102.95 },
  { nameEn: 'Phnom Penh', nameKm: 'ភ្នំពេញ', lat: 11.72, lng: 104.95 },
  { nameEn: 'Kampot', nameKm: 'កំពត', lat: 10.78, lng: 104.18 },
  { nameEn: 'Preah Sihanouk', nameKm: 'ព្រះសីហនុ', lat: 10.65, lng: 103.52 },
  { nameEn: 'Mondulkiri', nameKm: 'មណ្ឌលគិរី', lat: 12.6, lng: 107.1 },
  { nameEn: 'Stung Treng', nameKm: 'ស្ទឹងត្រែង', lat: 13.7, lng: 106.0 },
];

export function CambodiaMap({
  destinations,
  language,
  onSelectDestination,
}: CambodiaMapProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    destinations[0]?.id ?? null
  );
  const t = TRANSLATIONS[language];

  const activeDest =
    destinations.find((d) => d.id === selectedId) ?? destinations[0] ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-8 bg-[#EFECE6] rounded-2xl border border-[#DFD9CE] overflow-hidden relative min-h-[380px] max-h-[460px]">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full block select-none"
          role="img"
          aria-label="Interactive GPS Map of Cambodia Tourist Destinations"
        >
          <defs>
            <linearGradient id="cambodiaLand" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E6E1D3" />
              <stop offset="100%" stopColor="#D8D2C2" />
            </linearGradient>
            <linearGradient id="seaWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6E6E2" />
              <stop offset="100%" stopColor="#C1DAD4" />
            </linearGradient>
          </defs>

          {/* Sea / Surrounding region */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#E9E6DE" />
          <path
            d={`M 0 ${MAP_HEIGHT * 0.62} Q 140 ${MAP_HEIGHT * 0.72}, 250 ${MAP_HEIGHT * 0.88} L 360 ${MAP_HEIGHT} L 0 ${MAP_HEIGHT} Z`}
            fill="url(#seaWater)"
          />

          {/* Stylized Cambodia National Silhouette aligned to 760x440 projection bounds */}
          <path
            d="M 110 170 L 145 102 L 235 78 L 345 72 L 480 68 L 560 76 L 665 88 L 705 150 L 690 225 L 645 282 L 555 304 L 495 358 L 430 400 L 345 402 L 280 382 L 215 365 L 155 340 L 138 286 L 95 236 Z"
            fill="url(#cambodiaLand)"
            stroke="#9C9584"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Tonle Sap Lake */}
          <ellipse
            cx="260"
            cy="185"
            rx="50"
            ry="18"
            transform="rotate(30 260 185)"
            fill="#B7D5CE"
            stroke="#8CB3AA"
            strokeWidth="1.5"
          />

          {/* Mekong River */}
          <path
            d="M 520 74 Q 505 145, 495 205 T 435 308 T 455 396"
            fill="none"
            stroke="#9BBFB7"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Tonle Sap River joining Mekong at Phnom Penh */}
          <path
            d="M 304 205 Q 375 256, 435 308"
            fill="none"
            stroke="#9BBFB7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Province Labels */}
          {PROVINCE_LABELS.map((prov) => {
            const pt = projectCambodiaCoords(prov.lat, prov.lng, MAP_WIDTH, MAP_HEIGHT, 40);
            return (
              <text
                key={prov.nameEn}
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                className="fill-[#6E6A5E] text-[11px] font-medium pointer-events-none"
              >
                {language === 'km' ? prov.nameKm : prov.nameEn}
              </text>
            );
          })}

          {/* Destination GPS Pins */}
          {destinations.map((dest) => {
            const pt = projectCambodiaCoords(
              dest.latitude,
              dest.longitude,
              MAP_WIDTH,
              MAP_HEIGHT,
              40
            );
            const isSelected = activeDest?.id === dest.id;
            const label = getLocalizedText(dest.nameEn, dest.nameKm, language);

            return (
              <g
                key={dest.id}
                transform={`translate(${pt.x}, ${pt.y})`}
                className="cursor-pointer"
                onClick={() => setSelectedId(dest.id)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${dest.nameEn} on map`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(dest.id);
                  }
                }}
              >
                <circle
                  r={isSelected ? 18 : 13}
                  fill={isSelected ? '#0D5C46' : '#FFFFFF'}
                  fillOpacity={isSelected ? 0.18 : 0.7}
                />
                <circle
                  r={isSelected ? 9 : 6.5}
                  fill={isSelected ? '#0D5C46' : '#B8860B'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                {isSelected && (
                  <g transform="translate(0, -18)">
                    <rect
                      x="-74"
                      y="-24"
                      width="148"
                      height="22"
                      rx="6"
                      fill="#17211C"
                    />
                    <text
                      x="0"
                      y="-9"
                      textAnchor="middle"
                      className="fill-white text-[11px] font-medium"
                    >
                      {label.length > 20 ? `${label.slice(0, 19)}…` : label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#4B5650] flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D5C46]" aria-hidden="true" />
            {language === 'km' ? 'ទីតាំងកំពុងជ្រើស' : 'Selected pin'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" aria-hidden="true" />
            {language === 'km' ? 'តំបន់ទេសចរណ៍' : 'Destination'}
          </span>
        </div>
      </div>

      {/* Selected Destination Inspector */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E0D8] p-5 flex flex-col justify-between">
        {activeDest ? (
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#EFECE6] mb-4">
              <SafeImage
                src={resolveDestinationImage(activeDest.imageKey, activeDest.imageUrl)}
                alt={getLocalizedText(activeDest.nameEn, activeDest.nameKm, language)}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#0D5C46] font-medium mb-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{getLocalizedText(activeDest.provinceEn, activeDest.provinceKm, language)}</span>
            </div>

            <h3 className={`text-2xl font-semibold text-[#17211C] ${language === 'km' ? 'khmer-text' : ''}`}>
              {getLocalizedText(activeDest.nameEn, activeDest.nameKm, language)}
            </h3>
            <p className="text-xs text-[#6B7570] mt-0.5 khmer-text">
              {language === 'km' ? activeDest.nameEn : activeDest.nameKm}
            </p>

            <p className={`mt-3 text-sm text-[#4B5650] line-clamp-3 leading-relaxed ${language === 'km' ? 'khmer-text' : ''}`}>
              {getLocalizedText(activeDest.descriptionEn, activeDest.descriptionKm, language)}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#F8F7F4] border border-[#EAE5DC]">
              <div className="text-[11px] font-medium text-[#5A655F]">
                {t.detail.coordinates}
              </div>
              <div className="font-mono text-xs text-[#17211C] mt-0.5 tabular-nums">
                {formatCoordinates(activeDest.latitude, activeDest.longitude)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-[#5A655F] py-12 text-center">
            {t.explore.emptyTitle}
          </div>
        )}

        {activeDest && (
          <div className="mt-5 flex flex-col gap-2.5">
            <a
              href={buildGoogleMapsUrl(activeDest.latitude, activeDest.longitude, activeDest.nameEn)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D5C46] text-white text-sm font-medium px-4 py-2.5 hover:bg-[#0A4A38] transition-colors"
            >
              <Navigation className="w-4 h-4" aria-hidden="true" />
              <span>{t.detail.openInMaps}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => onSelectDestination(activeDest)}
              className="min-h-[44px] w-full inline-flex items-center justify-center rounded-xl border border-[#D8D2C5] text-[#17211C] text-sm font-medium px-4 py-2.5 hover:bg-[#F8F7F4] transition-colors"
            >
              {language === 'km' ? 'មើលព័ត៌មានលម្អិត' : 'Open full destination guide'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
