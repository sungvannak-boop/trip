import type { Category, Destination, Language, Trip, User } from '../types/tourism';

const TOKEN_STORAGE_KEY = 'kc_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.message === 'string' ? data.message : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const tourismApi = {
  getCategories(): Promise<{ categories: Category[] }> {
    return apiRequest('/api/categories');
  },

  getDestinations(params?: {
    search?: string;
    category?: string;
    province?: string;
    popular?: boolean;
  }): Promise<{ destinations: Destination[] }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.category && params.category !== 'all') qs.set('category', params.category);
    if (params?.province && params.province !== 'all') qs.set('province', params.province);
    if (params?.popular) qs.set('popular', 'true');
    const query = qs.toString();
    return apiRequest(`/api/destinations${query ? `?${query}` : ''}`);
  },

  register(payload: {
    name: string;
    email: string;
    password: string;
    preferredLanguage: Language;
  }): Promise<{ user: User; token: string }> {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: { email: string; password: string }): Promise<{ user: User; token: string }> {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout(): Promise<{ message: string }> {
    return apiRequest('/api/auth/logout', { method: 'POST' });
  },

  getMe(): Promise<{ user: User }> {
    return apiRequest('/api/auth/user');
  },

  updateProfile(payload: {
    name: string;
    email: string;
    preferredLanguage: Language;
  }): Promise<{ user: User }> {
    return apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  updatePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return apiRequest('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  getFavorites(): Promise<{ favoriteIds: number[]; destinations: Destination[] }> {
    return apiRequest('/api/favorites');
  },

  addFavorite(destinationId: number): Promise<{ favoriteIds: number[] }> {
    return apiRequest('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ destinationId }),
    });
  },

  removeFavorite(destinationId: number): Promise<{ favoriteIds: number[] }> {
    return apiRequest(`/api/favorites/${destinationId}`, {
      method: 'DELETE',
    });
  },

  getTrips(): Promise<{ trips: Trip[] }> {
    return apiRequest('/api/trips');
  },

  createTrip(payload: {
    title: string;
    startDate: string;
    endDate: string;
    notes: string;
    destinations: number[];
  }): Promise<{ trip: Trip }> {
    return apiRequest('/api/trips', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateTrip(
    id: number,
    payload: {
      title: string;
      startDate: string;
      endDate: string;
      notes: string;
      destinations: number[];
    }
  ): Promise<{ trip: Trip }> {
    return apiRequest(`/api/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteTrip(id: number): Promise<{ message: string }> {
    return apiRequest(`/api/trips/${id}`, {
      method: 'DELETE',
    });
  },

  adminGetStats(): Promise<{
    stats: { destinations: number; categories: number; users: number; trips: number; favorites: number };
  }> {
    return apiRequest('/api/admin/stats');
  },

  adminUploadImage(filename: string, dataUrl: string): Promise<{ imageUrl: string }> {
    return apiRequest('/api/admin/upload', {
      method: 'POST',
      body: JSON.stringify({ filename, dataUrl }),
    });
  },

  adminCreateDestination(payload: Partial<Destination>): Promise<{ destination: Destination }> {
    return apiRequest('/api/admin/destinations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  adminUpdateDestination(id: number, payload: Partial<Destination>): Promise<{ destination: Destination }> {
    return apiRequest(`/api/admin/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  adminDeleteDestination(id: number): Promise<{ message: string }> {
    return apiRequest(`/api/admin/destinations/${id}`, {
      method: 'DELETE',
    });
  },

  adminCreateCategory(payload: {
    nameEn: string;
    nameKm: string;
    descriptionEn: string;
    descriptionKm: string;
    icon: string;
  }): Promise<{ category: Category }> {
    return apiRequest('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  adminDeleteCategory(id: number): Promise<{ message: string }> {
    return apiRequest(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  listDeliverables(): Promise<{ files: Array<{ path: string; size: number }> }> {
    return apiRequest('/api/deliverables');
  },

  getDeliverableFile(filePath: string): Promise<{ path: string; content: string }> {
    return apiRequest(`/api/deliverables/file?path=${encodeURIComponent(filePath)}`);
  },
};
