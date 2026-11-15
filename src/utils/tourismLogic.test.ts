import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGoogleMapsUrl,
  computeTripDurationDays,
  filterDestinations,
  formatCoordinates,
  getLocalizedText,
  projectCambodiaCoords,
  validateTripInput,
} from './tourismLogic';
import type { Category, Destination } from '../types/tourism';

const sampleCategories: Category[] = [
  {
    id: 1,
    slug: 'historical-temples',
    nameEn: 'Historical temples',
    nameKm: 'ប្រាសាទបុរាណ',
    icon: 'landmark',
    descriptionEn: 'Ancient Angkorian monuments',
    descriptionKm: 'ប្រាង្គប្រាសាទបុរាណ',
  },
  {
    id: 2,
    slug: 'beaches-islands',
    nameEn: 'Beaches and islands',
    nameKm: 'ឆ្នេរ និងកោះ',
    icon: 'waves',
    descriptionEn: 'Tropical coastline',
    descriptionKm: 'ឆ្នេរសមុទ្រ និងកោះ',
  },
];

const sampleDestinations: Destination[] = [
  {
    id: 1,
    categoryId: 1,
    slug: 'angkor-wat',
    nameEn: 'Angkor Wat',
    nameKm: 'ប្រាសាទអង្គរវត្ត',
    descriptionEn: 'Iconic 12th-century temple complex in Siem Reap.',
    descriptionKm: 'ប្រាសាទអង្គរវត្តនៅខេត្តសៀមរាប។',
    provinceEn: 'Siem Reap',
    provinceKm: 'សៀមរាប',
    addressEn: 'Krong Siem Reap',
    addressKm: 'ក្រុងសៀមរាប',
    latitude: 13.4125,
    longitude: 103.867,
    entranceFeeNoteEn: 'Verify official Angkor Enterprise pass rates on arrival.',
    entranceFeeNoteKm: 'សូមផ្ទៀងផ្ទាត់តម្លៃសំបុត្រផ្លូវការ។',
    openingHoursNoteEn: 'Verify seasonal temple access hours.',
    openingHoursNoteKm: 'សូមផ្ទៀងផ្ទាត់ម៉ោងបើកចូលទស្សនា។',
    travelTipsEn: 'Arrive before dawn.',
    travelTipsKm: 'គួរទៅដល់មុនពេលថ្ងៃរះ។',
    imageKey: 'angkor_wat',
    isPopular: true,
    isFeatured: true,
    isRecommended: true,
    requiresVerification: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    categoryId: 2,
    slug: 'koh-rong',
    nameEn: 'Koh Rong',
    nameKm: 'កោះរ៉ុង',
    descriptionEn: 'White sand beaches off Preah Sihanouk.',
    descriptionKm: 'កោះរ៉ុងនៅខេត្តព្រះសីហនុ។',
    provinceEn: 'Preah Sihanouk',
    provinceKm: 'ព្រះសីហនុ',
    addressEn: 'Preah Sihanouk',
    addressKm: 'ព្រះសីហនុ',
    latitude: 10.7131,
    longitude: 103.2494,
    entranceFeeNoteEn: 'Verify ferry fare at Sihanoukville pier.',
    entranceFeeNoteKm: 'សូមផ្ទៀងផ្ទាត់តម្លៃទូក។',
    openingHoursNoteEn: 'Verify ferry departure schedule.',
    openingHoursNoteKm: 'សូមផ្ទៀងផ្ទាត់ម៉ោងចេញទូក។',
    travelTipsEn: 'Bring cash.',
    travelTipsKm: 'យកប្រាក់សុទ្ធតាមខ្លួន។',
    imageKey: 'koh_rong',
    isPopular: false,
    isFeatured: false,
    isRecommended: true,
    requiresVerification: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

test('getLocalizedText returns Khmer when language is km and falls back to English', () => {
  assert.equal(getLocalizedText('Angkor Wat', 'ប្រាសាទអង្គរវត្ត', 'km'), 'ប្រាសាទអង្គរវត្ត');
  assert.equal(getLocalizedText('Angkor Wat', 'ប្រាសាទអង្គរវត្ត', 'en'), 'Angkor Wat');
  assert.equal(getLocalizedText('Angkor Wat', '', 'km'), 'Angkor Wat');
});

test('filterDestinations filters by search in English and Khmer, category, province, and popularity', () => {
  assert.equal(filterDestinations(sampleDestinations, sampleCategories, { search: 'អង្គរវត្ត' }).length, 1);
  assert.equal(filterDestinations(sampleDestinations, sampleCategories, { search: 'sihanouk' }).length, 1);
  assert.equal(
    filterDestinations(sampleDestinations, sampleCategories, { categorySlug: 'beaches-islands' })[0].slug,
    'koh-rong'
  );
  assert.equal(
    filterDestinations(sampleDestinations, sampleCategories, { province: 'Siem Reap' })[0].slug,
    'angkor-wat'
  );
  assert.equal(
    filterDestinations(sampleDestinations, sampleCategories, { onlyPopular: true }).length,
    1
  );
});

test('validateTripInput rejects invalid dates or missing destinations and accepts valid trips', () => {
  assert.deepEqual(
    validateTripInput({ title: '', startDate: '2026-12-01', endDate: '2026-12-03', destinationIds: [1] }),
    { valid: false, errorKey: 'titleRequired' }
  );
  assert.deepEqual(
    validateTripInput({ title: 'Siem Reap', startDate: '2026-12-05', endDate: '2026-12-03', destinationIds: [1] }),
    { valid: false, errorKey: 'endBeforeStart' }
  );
  assert.deepEqual(
    validateTripInput({ title: 'Siem Reap', startDate: '2026-12-01', endDate: '2026-12-03', destinationIds: [] }),
    { valid: false, errorKey: 'destinationRequired' }
  );
  assert.deepEqual(
    validateTripInput({ title: 'Siem Reap', startDate: '2026-12-01', endDate: '2026-12-03', destinationIds: [1] }),
    { valid: true }
  );
});

test('computeTripDurationDays and coordinate helpers compute deterministic outputs', () => {
  assert.equal(computeTripDurationDays('2026-12-01', '2026-12-03'), 3);
  assert.equal(computeTripDurationDays('2026-12-01', '2026-12-01'), 1);
  assert.equal(formatCoordinates(13.4125, 103.867), '13.4125° N, 103.8670° E');
  const url = buildGoogleMapsUrl(13.4125, 103.867, 'Angkor Wat');
  assert.ok(url.includes('https://www.google.com/maps/dir/'));
  assert.ok(url.includes('13.412500%2C103.867000'));
  const pt = projectCambodiaCoords(13.4125, 103.867, 800, 600);
  assert.ok(pt.x > 36 && pt.x < 764);
  assert.ok(pt.y > 36 && pt.y < 564);
});
