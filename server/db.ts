import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Category, Destination, Language, Trip, UserRole } from '../src/types/tourism';

export interface StoredUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  preferredLanguage: Language;
  createdAt: string;
}

export interface StoredToken {
  token: string;
  userId: number;
  createdAt: string;
}

export interface StoredFavorite {
  id: number;
  userId: number;
  destinationId: number;
  createdAt: string;
}

export interface TourismDatabase {
  users: StoredUser[];
  tokens: StoredToken[];
  categories: Category[];
  destinations: Destination[];
  favorites: StoredFavorite[];
  trips: Trip[];
  nextIds: {
    user: number;
    category: number;
    destination: number;
    favorite: number;
    trip: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'tourism_db.json');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function createInitialSeed(): TourismDatabase {
  const now = new Date().toISOString();

  const categories: Category[] = [
    {
      id: 1,
      slug: 'historical-temples',
      nameEn: 'Historical temples',
      nameKm: 'ប្រាសាទបុរាណ',
      icon: 'landmark',
      descriptionEn: 'Ancient Khmer temple complexes and UNESCO heritage architecture.',
      descriptionKm: 'ប្រាង្គប្រាសាទបុរាណខ្មែរ និងបេតិកភណ្ឌពិភពលោក។',
    },
    {
      id: 2,
      slug: 'beaches-islands',
      nameEn: 'Beaches and islands',
      nameKm: 'ឆ្នេរ និងកោះ',
      icon: 'waves',
      descriptionEn: 'Turquoise Gulf of Thailand islands and sandy coastal bays.',
      descriptionKm: 'ឆ្នេរសមុទ្រខ្សាច់ស និងកោះត្រូពិចដ៏ស្រស់ស្អាត។',
    },
    {
      id: 3,
      slug: 'mountains-nature',
      nameEn: 'Mountains and nature',
      nameKm: 'ភ្នំ និងធម្មជាតិ',
      icon: 'mountain',
      descriptionEn: 'Misty plateaus, river estuaries, and countryside escapes.',
      descriptionKm: 'តំបន់ភ្នំ ទន្លេ និងទេសភាពធម្មជាតិដ៏ស្រស់បំព្រង។',
    },
    {
      id: 4,
      slug: 'cultural-attractions',
      nameEn: 'Cultural attractions',
      nameKm: 'តំបន់វប្បធម៌',
      icon: 'sparkles',
      descriptionEn: 'Royal palaces, civic monuments, and living Khmer traditions.',
      descriptionKm: 'ព្រះបរមរាជវាំង វិមានប្រវត្តិសាស្ត្រ និងវប្បធម៌ខ្មែរ។',
    },
    {
      id: 5,
      slug: 'museums',
      nameEn: 'Museums',
      nameKm: 'សារមន្ទីរ',
      icon: 'building',
      descriptionEn: 'National sculpture collections and historical archives.',
      descriptionKm: 'ទីកន្លែងរក្សាទុកវត្ថុបុរាណ និងប្រវត្តិសាស្ត្រជាតិ។',
    },
    {
      id: 6,
      slug: 'waterfalls',
      nameEn: 'Waterfalls',
      nameKm: 'ទឹកធ្លាក់',
      icon: 'droplets',
      descriptionEn: 'Sacred forest cascades and emerald swimming basins.',
      descriptionKm: 'ទឹកធ្លាក់ធម្មជាតិកណ្តាលព្រៃភ្នំដ៏ត្រជាក់ចិត្ត។',
    },
    {
      id: 7,
      slug: 'national-parks',
      nameEn: 'National parks',
      nameKm: 'ឧទ្យានជាតិ',
      icon: 'trees',
      descriptionEn: 'Protected highland reserves, biodiversity corridors, and trails.',
      descriptionKm: 'តំបន់អភិរក្សធម្មជាតិ ព្រៃឈើ និងសត្វព្រៃកម្រ។',
    },
  ];

  const destinations: Destination[] = [
    {
      id: 1,
      categoryId: 1,
      slug: 'angkor-wat',
      nameEn: 'Angkor Wat',
      nameKm: 'ប្រាសាទអង្គរវត្ត',
      descriptionEn:
        'Built in the early 12th century under King Suryavarman II, Angkor Wat is the largest religious monument in the world and the enduring emblem of Khmer classical architecture. Its five lotus-bud towers, kilometer-long bas-relief galleries, and reflecting moats reward unhurried exploration from sunrise to late afternoon.',
      descriptionKm:
        'ប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងនៅដើមសតវត្សទី១២ ក្នុងរជ្ជកាលព្រះបាទសូរ្យវរ្ម័នទី២។ ជាសំណង់សាសនាធំជាងគេបំផុតលើពិភពលោក និងជានិមិត្តរូបដ៏ខ្ពង់ខ្ពស់នៃស្ថាបត្យកម្មខ្មែរ ដែលល្បីល្បាញដោយកំពូលប្រាំ និងចម្លាក់លៀនយ៉ាងល្អវិចិត្រ។',
      provinceEn: 'Siem Reap',
      provinceKm: 'សៀមរាប',
      addressEn: 'Angkor Archaeological Park, Krong Siem Reap',
      addressKm: 'ឧទ្យានបុរាណអង្គរ ក្រុងសៀមរាប ខេត្តសៀមរាប',
      latitude: 13.4125,
      longitude: 103.867,
      entranceFeeNoteEn: 'Requires verification: Angkor Enterprise pass required for foreign visitors; check current official rates at the ticket center.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ភ្ញៀវបរទេសត្រូវមានសំបុត្រ Angkor Pass ពីមណ្ឌលលក់សំបុត្រផ្លូវការ។',
      openingHoursNoteEn: 'Requires verification: Typically 05:00 – 17:30 for sunrise access; confirm seasonal hours locally.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ជាធម្មតាបើកពីម៉ោង ០៥:០០ ព្រឹក ដល់ ០៥:៣០ ល្ងាច សូមបញ្ជាក់ម៉ោងតាមរដូវកាល។',
      travelTipsEn: 'Wear breathable modest clothing covering shoulders and knees for the Bakan upper level. Bring water and arrive 45 minutes before sunrise.',
      travelTipsKm: 'សូមស្លៀកពាក់សមរម្យបិទស្មា និងជង្គង់ពេលឡើងជាន់ខាងលើ (បាកាន)។ យកទឹកផឹកតាមខ្លួន និងទៅដល់មុនថ្ងៃរះ ៤៥ នាទី។',
      imageKey: 'angkor_wat',
      isPopular: true,
      isFeatured: true,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 2,
      categoryId: 1,
      slug: 'bayon-temple',
      nameEn: 'Bayon Temple',
      nameKm: 'ប្រាសាទបាយ័ន',
      descriptionEn:
        'Standing at the geometric heart of Angkor Thom, Bayon was commissioned by King Jayavarman VII in the late 12th century. Its upper terraces feature 54 gothic towers adorned with over 200 serene, smiling stone faces alongside vivid relief carvings of everyday Angkorian life.',
      descriptionKm:
        'ប្រាសាទបាយ័នស្ថិតនៅចំកណ្តាលក្រុងអង្គរធំ កសាងឡើងក្នុងរជ្ជកាលព្រះបាទជ័យវរ្ម័នទី៧ នៅចុងសតវត្សទី១២។ ប្រាសាទនេះល្បីល្បាញដោយកំពូលថ្មឆ្លាក់ព្រះភ័ក្ត្រញញឹមជាង ២០០ និងចម្លាក់បង្ហាញពីជីវភាពរស់នៅសម័យអង្គរ។',
      provinceEn: 'Siem Reap',
      provinceKm: 'សៀមរាប',
      addressEn: 'Center of Angkor Thom, Siem Reap',
      addressKm: 'កណ្តាលក្រុងអង្គរធំ ខេត្តសៀមរាប',
      latitude: 13.4413,
      longitude: 103.8588,
      entranceFeeNoteEn: 'Requires verification: Covered under valid Angkor Archaeological Park pass; verify ticket rules on arrival.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ប្រើសំបុត្ររួមរបស់ឧទ្យានអង្គរ សូមផ្ទៀងផ្ទាត់លក្ខខណ្ឌសំបុត្រ។',
      openingHoursNoteEn: 'Requires verification: Standard Angkor Thom hours (commonly 07:30 – 17:30); confirm at park gate.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ជាធម្មតាបើកពីម៉ោង ០៧:៣០ ព្រឹក ដល់ ០៥:៣០ ល្ងាច។',
      travelTipsEn: 'Visit in soft morning or late afternoon light when the sculpted stone faces cast rich shadows. Pair with the Terrace of the Elephants nearby.',
      travelTipsKm: 'គួរទស្សនានៅពេលព្រឹកព្រលឹម ឬរសៀលជ្រេ ដើម្បីផ្តិតរូបភាពព្រះភ័ក្ត្រថ្មបានច្បាស់ស្អាត។',
      imageKey: 'bayon_temple',
      isPopular: true,
      isFeatured: true,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 3,
      categoryId: 1,
      slug: 'ta-prohm',
      nameEn: 'Ta Prohm',
      nameKm: 'ប្រាសាទតាព្រហ្ម',
      descriptionEn:
        'Left largely in the atmospheric embrace of the surrounding jungle, Ta Prohm showcases colossal silk-cotton and strangler fig roots cascading over weathered sandstone galleries. Built as a Mahayana Buddhist monastery and university, it offers one of Cambodia’s most poetic encounters between architecture and forest.',
      descriptionKm:
        'ប្រាសាទតាព្រហ្មត្រូវបានរក្សាទុកក្នុងសភាពដើមជាមួយដើមឈើធំៗ និងឫសឈើគ្របដណ្តប់លើកំពែងថ្មបុរាណ។ កសាងជាវត្តអារាម និងសាកលវិទ្យាល័យពុទ្ធសាសនាក្នុងសម័យព្រះបាទជ័យវរ្ម័នទី៧។',
      provinceEn: 'Siem Reap',
      provinceKm: 'សៀមរាប',
      addressEn: 'Small Circuit Road, Angkor Park, Siem Reap',
      addressKm: 'ផ្លូវវង់តូច ឧទ្យានអង្គរ ខេត្តសៀមរាប',
      latitude: 13.4348,
      longitude: 103.8892,
      entranceFeeNoteEn: 'Requires verification: Included in Angkor Park pass; verify current pass eligibility before entry.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ រួមបញ្ចូលក្នុងសំបុត្រឧទ្យានអង្គរ សូមផ្ទៀងផ្ទាត់មុនចូល។',
      openingHoursNoteEn: 'Requires verification: Typically 07:30 – 17:30; confirm gate schedule locally.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ជាធម្មតាបើកពីម៉ោង ០៧:៣០ ព្រឹក ដល់ ០៥:៣០ ល្ងាច។',
      travelTipsEn: 'Arrive near opening time from the east gate to walk the shaded courtyards quietly before tour buses arrive.',
      travelTipsKm: 'ចូលតាមខ្លោងទ្វារខាងកើតនៅពេលព្រឹកព្រលឹម ដើម្បីដើរទស្សនាដោយស្ងប់ស្ងាត់។',
      imageKey: 'ta_prohm',
      isPopular: true,
      isFeatured: false,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 4,
      categoryId: 4,
      slug: 'royal-palace',
      nameEn: 'Royal Palace',
      nameKm: 'ព្រះបរមរាជវាំង',
      descriptionEn:
        'Overlooking the confluence of the Mekong and Tonle Sap rivers, Phnom Penh’s Royal Palace compound gleams with gilded Khmer spires, manicured tropical gardens, and the Silver Pagoda. Constructed in 1866, it remains the official residence of the King of Cambodia and a centerpiece of Khmer craftsmanship.',
      descriptionKm:
        'ព្រះបរមរាជវាំងចតុមុខស្ថិតនៅតាមបណ្តោយមាត់ទន្លេចតុមុខ ក្នុងរាជធានីភ្នំពេញ។ សាងសង់ឡើងនៅឆ្នាំ ១៨៦៦ ដោយមានដំបូលមាសក្បាច់ខ្មែរដ៏ប្រណីត សួនច្បារស្រស់ស្អាត និងព្រះវិហារព្រះកែវមរកត។',
      provinceEn: 'Phnom Penh',
      provinceKm: 'ភ្នំពេញ',
      addressEn: 'Samdech Sothearos Blvd, Daun Penh, Phnom Penh',
      addressKm: 'មហាវិថីសម្តេចសុធារស ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
      latitude: 11.5639,
      longitude: 104.9313,
      entranceFeeNoteEn: 'Requires verification: Separate admission fee applies at the main visitor gate; confirm current rates on site.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ មានលក់សំបុត្រចូលទស្សនានៅខ្លោងទ្វារខាងមុខ សូមផ្ទៀងផ្ទាត់តម្លៃជាក់ស្តែង។',
      openingHoursNoteEn: 'Requires verification: Usually open morning and afternoon sessions with a midday closure; verify current hours.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ជាធម្មតាបើកពេលព្រឹក និងពេលរសៀល ដោយឈប់សម្រាកពេលថ្ងៃត្រង់។',
      travelTipsEn: 'Strict dress code enforced: sleeves must cover shoulders and skirts/trousers must reach below the knee. Photography is restricted inside the Throne Hall and Silver Pagoda.',
      travelTipsKm: 'ត្រូវស្លៀកពាក់សមរម្យបិទស្មា និងក្រោមជង្គង់។ ហាមថតរូបនៅខាងក្នុងព្រះទីនាំងទេវាវិនិច្ឆ័យ និងព្រះវិហារព្រះកែវមរកត។',
      imageKey: 'royal_palace',
      isPopular: true,
      isFeatured: true,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 5,
      categoryId: 4,
      slug: 'independence-monument',
      nameEn: 'Independence Monument',
      nameKm: 'វិមានឯករាជ្យ',
      descriptionEn:
        'Designed by acclaimed Cambodian architect Vann Molyvann in 1958 to commemorate Cambodia’s independence from France, Vimean Ekareach rises like a lotus bud modeled on the towers of Angkor Wat. At dusk, fountains and warm floodlights illuminate the surrounding boulevard gardens.',
      descriptionKm:
        'វិមានឯករាជ្យត្រូវបានរចនាឡើងដោយស្ថាបត្យករដ៏ល្បីល្បាញ លោក វណ្ណ មូលីវណ្ណ នៅឆ្នាំ ១៩៥៨ ដើម្បីរំលឹកដល់ការទទួលបានឯករាជ្យជាតិកម្ពុជា។ រចនាបថផ្កាឈូកតាមលំនាំប្រាសាទបុរាណអង្គរវត្ត។',
      provinceEn: 'Phnom Penh',
      provinceKm: 'ភ្នំពេញ',
      addressEn: 'Intersection of Norodom & Sihanouk Blvds, Phnom Penh',
      addressKm: 'ប្រសព្វមហាវិថីព្រះនរោត្តម និងព្រះសីហនុ រាជធានីភ្នំពេញ',
      latitude: 11.5564,
      longitude: 104.9282,
      entranceFeeNoteEn: 'Requires verification: Open public landmark with no ticketed entry for exterior viewing; confirm special ceremony closures.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ជាទីសាធារណៈមិនតម្រូវឱ្យទិញសំបុត្រទេ លើកលែងថ្ងៃប្រារព្ធពិធីជាតិ។',
      openingHoursNoteEn: 'Requires verification: Accessible 24 hours externally; evening illumination typically begins around sunset.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ អាចទស្សនាបានគ្រប់ពេល ហើយភ្លើងបំភ្លឺពេលល្ងាចចាប់ផ្តើមពីម៉ោងថ្ងៃលិច។',
      travelTipsEn: 'Stroll along the landscaped park promenade stretching west toward Wat Botum Park around 17:30 for pleasant evening breezes and photos.',
      travelTipsKm: 'គួរដើរកម្សាន្តនៅសួនច្បារតាមបណ្តោយវិមាននៅម៉ោង ៥:៣០ ល្ងាច ដើម្បីទទួលខ្យល់អាកាស និងថតរូបពេលបើកភ្លើង។',
      imageKey: 'independence_monument',
      isPopular: true,
      isFeatured: false,
      isRecommended: false,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 6,
      categoryId: 2,
      slug: 'koh-rong',
      nameEn: 'Koh Rong',
      nameKm: 'កោះរ៉ុង',
      descriptionEn:
        'Cambodia’s second-largest island offers 43 kilometers of powdery white-sand beaches, sheltered emerald bays, coral reefs, and bioluminescent night waters. Accessible by speedboat from Preah Sihanouk, Koh Rong blends quiet coastal villages with tropical forest trails.',
      descriptionKm:
        'កោះរ៉ុងគឺជាកោះធំលំដាប់ទីពីរនៅកម្ពុជា ដែលមានឆ្នេរខ្សាច់សក្បុស ទឹកសមុទ្រពណ៌ខៀវថ្លា ផ្កាថ្ម និងទឹកសមុទ្រភ្លឺពេលយប់។ ធ្វើដំណើរតាមទូកលឿនពីក្រុងព្រះសីហនុ។',
      provinceEn: 'Preah Sihanouk',
      provinceKm: 'ព្រះសីហនុ',
      addressEn: 'Koh Rong Archipelago, Preah Sihanouk Province',
      addressKm: 'ប្រជុំកោះរ៉ុង ខេត្តព្រះសីហនុ',
      latitude: 10.7131,
      longitude: 103.2494,
      entranceFeeNoteEn: 'Requires verification: Island beaches are open; speedboat transfer fares vary by pier and operator—verify at Sihanoukville Autonomous Port.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ឆ្នេរសមុទ្របើកដោយសេរី ប៉ុន្តែត្រូវផ្ទៀងផ្ទាត់តម្លៃសំបុត្រទូកលឿននៅកំពង់ផែព្រះសីហនុ។',
      openingHoursNoteEn: 'Requires verification: Speedboats usually operate daytime schedules (approx. 08:00 – 17:00) depending on sea conditions.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ទូកដឹកភ្ញៀវចេញដំណើរពេលថ្ងៃតាមកាលវិភាគ និងអាកាសធាតុសមុទ្រ។',
      travelTipsEn: 'Carry sufficient cash (USD/KHR) as island ATMs can be limited. Long Set (4K) Beach and Sok San Beach offer calm turquoise swimming.',
      travelTipsKm: 'សូមត្រៀមប្រាក់សុទ្ធតាមខ្លួនឱ្យបានគ្រប់គ្រាន់ ព្រោះម៉ាស៊ីនដកប្រាក់លើកោះមានកំណត់។',
      imageKey: 'koh_rong',
      isPopular: true,
      isFeatured: true,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 7,
      categoryId: 7,
      slug: 'bokor-mountain',
      nameEn: 'Bokor Mountain',
      nameKm: 'ភ្នំបូកគោ',
      descriptionEn:
        'Rising over 1,000 meters inside Preah Monivong Bokor National Park, Bokor Mountain rewards travelers with cool highland air, sweeping views of the Gulf of Thailand, historic 1920s stone heritage buildings, Wat Sampov Pram, and seasonal mountain waterfalls.',
      descriptionKm:
        'ឧទ្យានជាតិព្រះមុនីវង្សបូកគោ មានកម្ពស់ជាង ១០០០ ម៉ែត្រ ផ្តល់នូវអាកាសធាតុត្រជាក់ស្រួល ពពកអ័ព្ទរសាត់ ទេសភាពឈូងសមុទ្រ វត្តសំពៅប្រាំ និងសំណង់ប្រវត្តិសាស្ត្រលើកំពូលភ្នំ។',
      provinceEn: 'Kampot',
      provinceKm: 'កំពត',
      addressEn: 'Preah Monivong Bokor National Park, Kampot',
      addressKm: 'ឧទ្យានជាតិព្រះមុនីវង្សបូកគោ ខេត្តកំពត',
      latitude: 10.6253,
      longitude: 104.0225,
      entranceFeeNoteEn: 'Requires verification: National park road access and vehicle fees may apply; verify current checkpoint rates.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ អាចមានថ្លៃចូលឧទ្យានជាតិ ឬយានយន្តនៅច្រកត្រួតពិនិត្យផ្លូវឡើងភ្នំ។',
      openingHoursNoteEn: 'Requires verification: Mountain road is generally open daily; check fog and weather advisories before dusk.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ផ្លូវឡើងភ្នំបើកប្រចាំថ្ងៃ សូមប្រុងប្រយ័ត្នចំពោះអ័ព្ទក្រាស់ពេលល្ងាច។',
      travelTipsEn: 'Pack a light windbreaker or sweater even in hot months—summit temperatures drop noticeably and mist rolls in quickly.',
      travelTipsKm: 'សូមយកអាវរងា ឬអាវការពារខ្យល់តាមខ្លួន ព្រោះអាកាសធាតុលើភ្នំត្រជាក់ និងមានអ័ព្ទច្រើន។',
      imageKey: 'bokor_mountain',
      isPopular: true,
      isFeatured: false,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 8,
      categoryId: 3,
      slug: 'kampot-river',
      nameEn: 'Kampot River',
      nameKm: 'ព្រែកកំពត',
      descriptionEn:
        'Winding gently from the Elephant Mountains through historic Kampot town toward the sea, the Kampot River (Praek Tuek Chhu) is famed for tranquil sunset cruises, mangrove kayaking, riverside wooden bungalows, and views of Bokor’s silhouette.',
      descriptionKm:
        'ព្រែកកំពត (ព្រែកទឹកឈូ) ហូរកាត់ក្រុងកំពតឆ្ពោះទៅសមុទ្រ ល្បីល្បាញដោយសារដំណើរទូកមើលថ្ងៃលិច ការចែវទូកកាយ៉ាក់តាមព្រៃកោងកាង និងទេសភាពភ្នំបូកគោ។',
      provinceEn: 'Kampot',
      provinceKm: 'កំពត',
      addressEn: 'Kampot Riverside & Tuek Chhu, Kampot Province',
      addressKm: 'មាត់ព្រែកកំពត និងទឹកឈូ ខេត្តកំពត',
      latitude: 10.6104,
      longitude: 104.1814,
      entranceFeeNoteEn: 'Requires verification: Riverside promenade is free; sunset boat cruises and kayak rentals vary by operator.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ មាត់ព្រែកបើកដោយសេរី រីឯតម្លៃជិះទូកកម្សាន្ត ឬទូកកាយ៉ាក់ខុសគ្នាតាមអ្នកផ្តល់សេវា។',
      openingHoursNoteEn: 'Requires verification: Boat tours generally depart around 16:30 – 19:00 for sunset and firefly viewing.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ទូកមើលថ្ងៃលិច និងអំពិលអំពែកជាធម្មតាចេញដំណើរពីម៉ោង ៤:៣០ ល្ងាច។',
      travelTipsEn: 'Book a late afternoon boat ride along the Green Cathedral loop and combine your visit with a Kampot pepper farm tour nearby.',
      travelTipsKm: 'ជិះទូកពេលល្ងាចតាមព្រែក និងកុំភ្លេចទៅទស្សនាចម្ការម្រេចកំពតនៅក្បែរនោះ។',
      imageKey: 'kampot_river',
      isPopular: false,
      isFeatured: false,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 9,
      categoryId: 3,
      slug: 'bamboo-train',
      nameEn: 'Bamboo Train',
      nameKm: 'ណូរី (រទេះភ្លើងឫស្សី)',
      descriptionEn:
        'Known locally as the Norry, Battambang’s iconic bamboo rail platform glides across scenic countryside tracks flanked by bright green rice paddies, lotus ponds, and sugar palms. Lightweight enough to lift off the rails when opposing carts meet, it remains a beloved rural heritage experience.',
      descriptionKm:
        'ណូរី ឬរទេះភ្លើងឫស្សីនៅខេត្តបាត់ដំបង ផ្តល់បទពិសោធន៍ជិះលើផ្លូវដែកឆ្លងកាត់វាលស្រែពណ៌បៃតង និងដើមត្នោតដ៏ស្រស់ស្អាតនៅជនបទ។',
      provinceEn: 'Battambang',
      provinceKm: 'បាត់ដំបង',
      addressEn: 'O Dambang / Banan Countryside Line, Battambang',
      addressKm: 'អូរដំបង / ស្រុកបាណន់ ខេត្តបាត់ដំបង',
      latitude: 13.0672,
      longitude: 103.2256,
      entranceFeeNoteEn: 'Requires verification: Standard per-person ride tickets are purchased at the station; verify current official tariff on site.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ សូមផ្ទៀងផ្ទាត់តម្លៃសំបុត្រជិះណូរីផ្លូវការនៅស្ថានីយ៍ផ្ទាល់។',
      openingHoursNoteEn: 'Requires verification: Typically operates daily from 08:00 – 17:30; confirm weather and track availability.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ជាធម្មតាបើកដំណើរការពីម៉ោង ០៨:០០ ព្រឹក ដល់ ០៥:៣០ ល្ងាច។',
      travelTipsEn: 'Ride around 16:00 for golden light over the rice fields, and pair with Phnom Sampeau bat caves nearby at dusk.',
      travelTipsKm: 'គួរជិះនៅម៉ោង ៤ រសៀល ដើម្បីទស្សនាថ្ងៃលិចលើវាលស្រែ ហើយបន្តទៅមើលប្រជៀវហើរនៅភ្នំសំពៅ។',
      imageKey: 'bamboo_train',
      isPopular: true,
      isFeatured: false,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 10,
      categoryId: 6,
      slug: 'phnom-kulen',
      nameEn: 'Phnom Kulen',
      nameKm: 'ភ្នំគូលែន',
      descriptionEn:
        'Revered as the birthplace of the Khmer Empire in 802 AD, Phnom Kulen National Park combines sacred pilgrimage heritage with cooling jungle nature. Highlights include the River of a Thousand Lingas, the hilltop Reclining Buddha at Preah Ang Thom, and two tiered forest waterfalls.',
      descriptionKm:
        'ឧទ្យានជាតិភ្នំគូលែនជាទីកន្លែងប្រវត្តិសាស្ត្រនៃការប្រកាសឯករាជ្យអាណាចក្រខ្មែរនៅឆ្នាំ ៨០២។ មានទឹកធ្លាក់ធម្មជាតិ ស្ទឹងលិង្គមួយពាន់ និងព្រះអង្គធំនៅលើកំពូលភ្នំ។',
      provinceEn: 'Siem Reap',
      provinceKm: 'សៀមរាប',
      addressEn: 'Phnom Kulen National Park, Svay Leu District, Siem Reap',
      addressKm: 'ឧទ្យានជាតិភ្នំគូលែន ស្រុកស្វាយលើ ខេត្តសៀមរាប',
      latitude: 13.5688,
      longitude: 104.1045,
      entranceFeeNoteEn: 'Requires verification: Separate Phnom Kulen National Park ticket required (not included in Angkor Pass); confirm rates at the entrance gate.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ត្រូវទិញសំបុត្រចូលឧទ្យានជាតិភ្នំគូលែនផ្សេង (មិនរួមក្នុង Angkor Pass ទេ)។',
      openingHoursNoteEn: 'Requires verification: Mountain road typically runs one-way uphill in the morning and downhill in the afternoon; verify traffic windows.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ផ្លូវឡើងភ្នំមានកំណត់ម៉ោងឡើងពេលព្រឹក និងចុះពេលរសៀល សូមផ្ទៀងផ្ទាត់ម៉ោងចរាចរណ៍។',
      travelTipsEn: 'Depart Siem Reap by 07:30 to beat the uphill road cutoff, and bring swimwear and sturdy sandals for the waterfall steps.',
      travelTipsKm: 'ចេញដំណើរពីក្រុងសៀមរាបមុនម៉ោង ៧:៣០ ព្រឹក និងត្រៀមសម្លៀកបំពាក់សម្រាប់លេងទឹកធ្លាក់។',
      imageKey: 'phnom_kulen',
      isPopular: true,
      isFeatured: true,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
    {
      id: 11,
      categoryId: 5,
      slug: 'national-museum-cambodia',
      nameEn: 'National Museum of Cambodia',
      nameKm: 'សារមន្ទីរជាតិកម្ពុជា',
      descriptionEn:
        'Housed in a distinctive 1920 terracotta-red Khmer pavilion steps from the Royal Palace, the National Museum preserves the world’s finest collection of Angkorian sandstone sculptures, bronze artifacts, ceramics, and a tranquil central lotus courtyard.',
      descriptionKm:
        'សារមន្ទីរជាតិកម្ពុជា ស្ថិតនៅជាប់ព្រះបរមរាជវាំង ក្នុងសំណង់ស្ថាបត្យកម្មខ្មែរពណ៌ក្រហមដ៏ប្រណីត។ ទីនេះរក្សាទុកបដិមាថ្មភក់ សំរឹទ្ធ និងវត្ថុបុរាណសម័យអង្គរដ៏សម្បូរបែប។',
      provinceEn: 'Phnom Penh',
      provinceKm: 'ភ្នំពេញ',
      addressEn: 'Preah Ang Eng St (St. 13), Daun Penh, Phnom Penh',
      addressKm: 'ផ្លូវលេខ ១៣ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
      latitude: 11.5653,
      longitude: 104.9293,
      entranceFeeNoteEn: 'Requires verification: Admission tickets sold at the main entrance desk; confirm current visitor rates on arrival.',
      entranceFeeNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ មានលក់សំបុត្រចូលទស្សនានៅមុខសារមន្ទីរ សូមផ្ទៀងផ្ទាត់តម្លៃបច្ចុប្បន្ន។',
      openingHoursNoteEn: 'Requires verification: Typically open daily 08:00 – 17:00; verify holiday hours locally.',
      openingHoursNoteKm: 'ត្រូវផ្ទៀងផ្ទាត់៖ ជាធម្មតាបើកប្រចាំថ្ងៃពីម៉ោង ០៨:០០ ព្រឹក ដល់ ០៥:០០ ល្ងាច។',
      travelTipsEn: 'Audio guides are available in multiple languages; photography is allowed in the central garden courtyard only.',
      travelTipsKm: 'មានសេវាឧបករណ៍ស្តាប់ការណែនាំជាច្រើនភាសា ហើយអាចថតរូបបាននៅសួនច្បារកណ្តាល។',
      imageKey: 'national_museum',
      isPopular: false,
      isFeatured: false,
      isRecommended: true,
      requiresVerification: true,
      createdAt: now,
    },
  ];

  const demoTouristId = 1;
  const demoAdminId = 2;

  const users: StoredUser[] = [
    {
      id: demoTouristId,
      name: 'Sokha Dara',
      email: 'tourist@cambodia.guide',
      passwordHash: hashPassword('password123'),
      role: 'tourist',
      preferredLanguage: 'en',
      createdAt: now,
    },
    {
      id: demoAdminId,
      name: 'Vannak Tourism Admin',
      email: 'admin@cambodia.guide',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
      preferredLanguage: 'en',
      createdAt: now,
    },
  ];

  const trips: Trip[] = [
    {
      id: 1,
      userId: demoTouristId,
      title: 'Angkor & Kampot Heritage Loop',
      startDate: '2026-12-10',
      endDate: '2026-12-14',
      notes: 'Sunrise at Angkor Wat on Day 1, Phnom Kulen waterfall Day 2, then bus south to Kampot River & Bokor.',
      destinations: [
        { destinationId: 1, visitOrder: 1, dayNumber: 1, note: 'Sunrise reflection pond' },
        { destinationId: 2, visitOrder: 2, dayNumber: 1, note: 'Morning faces walk' },
        { destinationId: 10, visitOrder: 3, dayNumber: 2, note: 'Waterfall & 1000 Lingas' },
        { destinationId: 8, visitOrder: 4, dayNumber: 4, note: 'Sunset boat cruise' },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const favorites: StoredFavorite[] = [
    { id: 1, userId: demoTouristId, destinationId: 1, createdAt: now },
    { id: 2, userId: demoTouristId, destinationId: 6, createdAt: now },
  ];

  return {
    users,
    tokens: [],
    categories,
    destinations,
    favorites,
    trips,
    nextIds: {
      user: 3,
      category: 8,
      destination: 12,
      favorite: 3,
      trip: 2,
    },
  };
}

export function loadDatabase(): TourismDatabase {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  if (!fs.existsSync(DB_FILE)) {
    const seed = createInitialSeed();
    saveDatabase(seed);
    return seed;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as TourismDatabase;
    return parsed;
  } catch {
    const seed = createInitialSeed();
    saveDatabase(seed);
    return seed;
  }
}

export function saveDatabase(db: TourismDatabase): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}
