export type Language = 'en' | 'km';

export type UserRole = 'tourist' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage: Language;
  createdAt: string;
}

export interface Category {
  id: number;
  slug: string;
  nameEn: string;
  nameKm: string;
  icon: string;
  descriptionEn: string;
  descriptionKm: string;
}

export interface Destination {
  id: number;
  categoryId: number;
  slug: string;
  nameEn: string;
  nameKm: string;
  descriptionEn: string;
  descriptionKm: string;
  provinceEn: string;
  provinceKm: string;
  addressEn: string;
  addressKm: string;
  latitude: number;
  longitude: number;
  entranceFeeNoteEn: string;
  entranceFeeNoteKm: string;
  openingHoursNoteEn: string;
  openingHoursNoteKm: string;
  travelTipsEn: string;
  travelTipsKm: string;
  imageKey: string;
  imageUrl?: string;
  gallery?: string[];
  isPopular: boolean;
  isFeatured: boolean;
  isRecommended: boolean;
  requiresVerification: boolean;
  createdAt: string;
}

export interface TripDestinationItem {
  destinationId: number;
  visitOrder: number;
  dayNumber: number;
  note?: string;
}

export interface Trip {
  id: number;
  userId: number;
  title: string;
  startDate: string;
  endDate: string;
  notes: string;
  destinations: TripDestinationItem[];
  createdAt: string;
  updatedAt: string;
}

export type AppTab =
  | 'home'
  | 'explore'
  | 'favorites'
  | 'trips'
  | 'profile'
  | 'admin'
  | 'deliverables';
