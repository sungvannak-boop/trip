import { Category, Destination, Language } from '../types/tourism';

export interface DestinationFilterOptions {
  search?: string;
  categorySlug?: string;
  province?: string;
  onlyPopular?: boolean;
}

export function getLocalizedText(en: string, km: string, language: Language): string {
  if (language === 'km' && km && km.trim().length > 0) {
    return km;
  }
  return en;
}

export function filterDestinations(
  destinations: Destination[],
  categories: Category[],
  options: DestinationFilterOptions
): Destination[] {
  const search = (options.search ?? '').trim().toLowerCase();
  const categorySlug = (options.categorySlug ?? 'all').trim().toLowerCase();
  const province = (options.province ?? 'all').trim().toLowerCase();
  const onlyPopular = Boolean(options.onlyPopular);

  const categoryById = new Map<number, Category>();
  for (const cat of categories) {
    categoryById.set(cat.id, cat);
  }

  return destinations.filter((dest) => {
    if (onlyPopular && !dest.isPopular) {
      return false;
    }

    if (categorySlug && categorySlug !== 'all') {
      const cat = categoryById.get(dest.categoryId);
      if (!cat || cat.slug.toLowerCase() !== categorySlug) {
        return false;
      }
    }

    if (province && province !== 'all') {
      const matchesProvince =
        dest.provinceEn.toLowerCase() === province ||
        dest.provinceKm.toLowerCase() === province;
      if (!matchesProvince) {
        return false;
      }
    }

    if (search.length > 0) {
      const haystack = [
        dest.nameEn,
        dest.nameKm,
        dest.provinceEn,
        dest.provinceKm,
        dest.descriptionEn,
        dest.descriptionKm,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

export interface TripValidationResult {
  valid: boolean;
  errorKey?: 'titleRequired' | 'datesRequired' | 'endBeforeStart' | 'destinationRequired';
}

export function validateTripInput(input: {
  title: string;
  startDate: string;
  endDate: string;
  destinationIds: number[];
}): TripValidationResult {
  if (!input.title || input.title.trim().length < 2) {
    return { valid: false, errorKey: 'titleRequired' };
  }
  if (!input.startDate || !input.endDate) {
    return { valid: false, errorKey: 'datesRequired' };
  }
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { valid: false, errorKey: 'datesRequired' };
  }
  if (end.getTime() < start.getTime()) {
    return { valid: false, errorKey: 'endBeforeStart' };
  }
  if (!Array.isArray(input.destinationIds) || input.destinationIds.length === 0) {
    return { valid: false, errorKey: 'destinationRequired' };
  }
  return { valid: true };
}

export function computeTripDurationDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1;
  }
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) {
    return 1;
  }
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export function formatCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lngDir}`;
}

export function buildGoogleMapsUrl(latitude: number, longitude: number, label?: string): string {
  const query = label
    ? `${latitude.toFixed(6)},${longitude.toFixed(6)} (${label})`
    : `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${latitude.toFixed(6)},${longitude.toFixed(6)}`
  )}&destination_place_id=&travelmode=driving&query=${encodeURIComponent(query)}`;
}

// Cambodia bounding box roughly: lat 10.25 to 14.70, lng 102.30 to 107.65
export function projectCambodiaCoords(
  latitude: number,
  longitude: number,
  width: number,
  height: number,
  padding = 36
): { x: number; y: number } {
  const minLat = 10.2;
  const maxLat = 14.75;
  const minLng = 102.25;
  const maxLng = 107.65;

  const usableW = Math.max(1, width - padding * 2);
  const usableH = Math.max(1, height - padding * 2);

  const normX = (longitude - minLng) / (maxLng - minLng);
  const normY = 1 - (latitude - minLat) / (maxLat - minLat);

  return {
    x: Math.round((padding + Math.min(1, Math.max(0, normX)) * usableW) * 10) / 10,
    y: Math.round((padding + Math.min(1, Math.max(0, normY)) * usableH) * 10) / 10,
  };
}
