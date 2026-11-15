import { Language } from '../types/tourism';

export const TRANSLATIONS: Record<
  Language,
  {
    brandName: string;
    nav: {
      home: string;
      explore: string;
      favorites: string;
      trips: string;
      profile: string;
      admin: string;
      deliverables: string;
    };
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      exploreBtn: string;
      mapBtn: string;
      sourceKitBtn: string;
    };
    home: {
      categoriesTitle: string;
      categoriesSubtitle: string;
      featuredTitle: string;
      popularTitle: string;
      recommendedTitle: string;
      viewAll: string;
      destinationsCount: string;
    };
    explore: {
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      allCategories: string;
      allProvinces: string;
      popularOnly: string;
      listView: string;
      mapView: string;
      resultsCount: string;
      emptyTitle: string;
      emptyBody: string;
      resetFilters: string;
    };
    detail: {
      back: string;
      province: string;
      address: string;
      coordinates: string;
      entranceFee: string;
      openingHours: string;
      verificationBadge: string;
      verificationNote: string;
      travelTips: string;
      openInMaps: string;
      saveFavorite: string;
      removeFavorite: string;
      addToTrip: string;
      addedToTrip: string;
      selectTrip: string;
      createNewTrip: string;
    };
    favorites: {
      title: string;
      subtitle: string;
      emptyTitle: string;
      emptyBody: string;
      browseBtn: string;
      loginNotice: string;
    };
    trips: {
      title: string;
      subtitle: string;
      newTripBtn: string;
      editTrip: string;
      deleteTrip: string;
      tripTitleLabel: string;
      tripTitlePlaceholder: string;
      startDateLabel: string;
      endDateLabel: string;
      notesLabel: string;
      notesPlaceholder: string;
      destinationsLabel: string;
      saveTrip: string;
      cancel: string;
      daysUnit: string;
      stopsUnit: string;
      emptyTitle: string;
      emptyBody: string;
      signInPrompt: string;
      validation: {
        titleRequired: string;
        datesRequired: string;
        endBeforeStart: string;
        destinationRequired: string;
      };
    };
    profile: {
      title: string;
      signInTitle: string;
      registerTitle: string;
      emailLabel: string;
      passwordLabel: string;
      nameLabel: string;
      signInBtn: string;
      registerBtn: string;
      switchToRegister: string;
      switchToLogin: string;
      demoTouristBtn: string;
      demoAdminBtn: string;
      accountSummary: string;
      savedCount: string;
      tripsCount: string;
      languageLabel: string;
      editProfileTitle: string;
      updateProfileBtn: string;
      changePasswordTitle: string;
      currentPasswordLabel: string;
      newPasswordLabel: string;
      updatePasswordBtn: string;
      logoutBtn: string;
      openAdminBtn: string;
      openDeliverablesBtn: string;
      profileUpdated: string;
      passwordUpdated: string;
    };
    admin: {
      title: string;
      subtitle: string;
      restrictedTitle: string;
      restrictedBody: string;
      addDestinationBtn: string;
      editDestination: string;
      deleteDestination: string;
      categoriesTab: string;
      destinationsTab: string;
      addCategoryBtn: string;
      uploadImageLabel: string;
      totalDestinations: string;
      totalCategories: string;
      totalUsers: string;
      totalTrips: string;
      saveBtn: string;
    };
    deliverables: {
      title: string;
      subtitle: string;
      copyCode: string;
      copied: string;
      downloadFile: string;
    };
    common: {
      loading: string;
      errorPrefix: string;
      close: string;
      popularLabel: string;
      featuredLabel: string;
    };
  }
> = {
  en: {
    brandName: 'Kingdom Compass',
    nav: {
      home: 'Home',
      explore: 'Explore',
      favorites: 'Favorites',
      trips: 'My Trips',
      profile: 'Profile',
      admin: 'Admin',
      deliverables: 'Source Kit',
    },
    hero: {
      eyebrow: 'Cambodia Travel Guide',
      title: 'Discover temples, rivers, and islands across Cambodia',
      subtitle:
        'Explore verified cultural landmarks, GPS coordinates, local travel advice, and organize multi-day journeys in Khmer and English.',
      searchPlaceholder: 'Search Angkor Wat, Kampot, Koh Rong, Siem Reap...',
      exploreBtn: 'Explore Destinations',
      mapBtn: 'Interactive Map',
      sourceKitBtn: 'Flutter & Laravel Source',
    },
    home: {
      categoriesTitle: 'Explore by category',
      categoriesSubtitle: 'Seven distinct ways to experience the Kingdom',
      featuredTitle: 'Featured landmarks',
      popularTitle: 'Popular destinations',
      recommendedTitle: 'Recommended places',
      viewAll: 'View all',
      destinationsCount: 'destinations',
    },
    explore: {
      title: 'Explore Cambodia',
      subtitle: 'Search by landmark or province, filter by category, and inspect GPS coordinates on the map.',
      searchPlaceholder: 'Search destination name or province...',
      allCategories: 'All categories',
      allProvinces: 'All provinces',
      popularOnly: 'Popular only',
      listView: 'Grid view',
      mapView: 'Cambodia map',
      resultsCount: 'places found',
      emptyTitle: 'No matching destinations',
      emptyBody: 'Try clearing a category filter or searching another province such as Siem Reap, Phnom Penh, or Kampot.',
      resetFilters: 'Reset filters',
    },
    detail: {
      back: 'Back',
      province: 'Province',
      address: 'Location',
      coordinates: 'GPS coordinates',
      entranceFee: 'Entrance fee',
      openingHours: 'Opening hours',
      verificationBadge: 'Verify on site',
      verificationNote: 'Rates and schedules are subject to local authority updates; confirm before arrival.',
      travelTips: 'Travel tips',
      openInMaps: 'Directions in Google Maps',
      saveFavorite: 'Save to favorites',
      removeFavorite: 'Saved in favorites',
      addToTrip: 'Add to trip',
      addedToTrip: 'Added to trip',
      selectTrip: 'Choose a travel plan',
      createNewTrip: 'Create a new trip',
    },
    favorites: {
      title: 'Saved favorites',
      subtitle: 'Places you bookmarked for your upcoming Cambodia journey.',
      emptyTitle: 'No saved destinations yet',
      emptyBody: 'Tap the heart button on any temple, beach, or mountain park to save it here.',
      browseBtn: 'Discover destinations',
      loginNotice: 'Favorites are saved to your browser until you sign in, and sync to your account once logged in.',
    },
    trips: {
      title: 'My travel plans',
      subtitle: 'Organize dates, destination stops, and personal notes for your Cambodia itinerary.',
      newTripBtn: 'New travel plan',
      editTrip: 'Edit plan',
      deleteTrip: 'Delete',
      tripTitleLabel: 'Trip title',
      tripTitlePlaceholder: 'e.g., 5-Day Siem Reap & Kampot Route',
      startDateLabel: 'Start date',
      endDateLabel: 'End date',
      notesLabel: 'Itinerary notes',
      notesPlaceholder: 'Transport preferences, sunrise departure times, packing reminders...',
      destinationsLabel: 'Select destinations',
      saveTrip: 'Save travel plan',
      cancel: 'Cancel',
      daysUnit: 'days',
      stopsUnit: 'stops',
      emptyTitle: 'No travel plans created',
      emptyBody: 'Build an itinerary with dates, notes, and your selected Cambodian destinations.',
      signInPrompt: 'Sign in to sync your travel plans across sessions, or sign in with the demo tourist account.',
      validation: {
        titleRequired: 'Please enter a trip title (at least 2 characters).',
        datesRequired: 'Please choose both start and end dates.',
        endBeforeStart: 'End date cannot be earlier than start date.',
        destinationRequired: 'Select at least one destination for your trip.',
      },
    },
    profile: {
      title: 'Traveler profile',
      signInTitle: 'Sign in to your guide account',
      registerTitle: 'Create a traveler account',
      emailLabel: 'Email address',
      passwordLabel: 'Password',
      nameLabel: 'Full name',
      signInBtn: 'Sign in',
      registerBtn: 'Create account',
      switchToRegister: 'Need an account? Register',
      switchToLogin: 'Already registered? Sign in',
      demoTouristBtn: 'Use Demo Tourist',
      demoAdminBtn: 'Use Demo Admin',
      accountSummary: 'Account overview',
      savedCount: 'Saved places',
      tripsCount: 'Travel plans',
      languageLabel: 'App language',
      editProfileTitle: 'Profile details',
      updateProfileBtn: 'Save profile',
      changePasswordTitle: 'Change password',
      currentPasswordLabel: 'Current password',
      newPasswordLabel: 'New password (min 6 chars)',
      updatePasswordBtn: 'Update password',
      logoutBtn: 'Sign out',
      openAdminBtn: 'Open Admin Console',
      openDeliverablesBtn: 'Flutter, Laravel & MySQL Source',
      profileUpdated: 'Profile updated successfully.',
      passwordUpdated: 'Password updated successfully.',
    },
    admin: {
      title: 'Tourism Admin Console',
      subtitle: 'Manage destinations, categories, media uploads, and tourism catalog entries.',
      restrictedTitle: 'Administrator access required',
      restrictedBody: 'Sign in with an administrator account to create, edit, or remove destinations and categories.',
      addDestinationBtn: 'Add destination',
      editDestination: 'Edit',
      deleteDestination: 'Delete',
      categoriesTab: 'Categories',
      destinationsTab: 'Destinations',
      addCategoryBtn: 'Add category',
      uploadImageLabel: 'Upload photo',
      totalDestinations: 'Destinations',
      totalCategories: 'Categories',
      totalUsers: 'Registered users',
      totalTrips: 'Travel plans',
      saveBtn: 'Save changes',
    },
    deliverables: {
      title: 'Flutter, Laravel & MySQL Project Kit',
      subtitle: 'Complete runnable source code, database migrations, seeders, Khmer/English ARB files, and Android APK build guide.',
      copyCode: 'Copy file',
      copied: 'Copied',
      downloadFile: 'Download',
    },
    common: {
      loading: 'Loading...',
      errorPrefix: 'Error:',
      close: 'Close',
      popularLabel: 'Popular',
      featuredLabel: 'Featured',
    },
  },
  km: {
    brandName: 'Kingdom Compass',
    nav: {
      home: 'ទំព័រដើម',
      explore: 'ស្វែងរក',
      favorites: 'ចូលចិត្ត',
      trips: 'គម្រោងដំណើរ',
      profile: 'គណនី',
      admin: 'គ្រប់គ្រង',
      deliverables: 'កូដគម្រោង',
    },
    hero: {
      eyebrow: 'មគ្គុទ្ទេសក៍ទេសចរណ៍កម្ពុជា',
      title: 'ស្វែងយល់ពីប្រាសាទបុរាណ ទន្លេ និងកោះដ៏ស្រស់ស្អាតនៅកម្ពុជា',
      subtitle:
        'ស្វែងរកតំបន់ទេសចរណ៍វប្បធម៌ ទីតាំង GPS គន្លឹះធ្វើដំណើរ និងរៀបចំផែនការដំណើរកម្សាន្តជាភាសាខ្មែរ និងអង់គ្លេស។',
      searchPlaceholder: 'ស្វែងរក អង្គរវត្ត កំពត កោះរ៉ុង សៀមរាប...',
      exploreBtn: 'ស្វែងរកទីតាំង',
      mapBtn: 'ផែនទីកម្ពុជា',
      sourceKitBtn: 'កូដ Flutter & Laravel',
    },
    home: {
      categoriesTitle: 'ប្រភេទតំបន់ទេសចរណ៍',
      categoriesSubtitle: 'ជម្រើសតំបន់កម្សាន្តទាំង ៧ ប្រភេទទូទាំងប្រទេស',
      featuredTitle: 'តំបន់ទេសចរណ៍ពិសេស',
      popularTitle: 'តំបន់ទេសចរណ៍ពេញនិយម',
      recommendedTitle: 'កន្លែងដែលគួរទៅទស្សនា',
      viewAll: 'មើលទាំងអស់',
      destinationsCount: 'ទីតាំង',
    },
    explore: {
      title: 'ស្វែងរកតំបន់ទេសចរណ៍កម្ពុជា',
      subtitle: 'ស្វែងរកតាមឈ្មោះទីតាំង ឬខេត្ត ច្រោះតាមប្រភេទ និងមើលទីតាំង GPS លើផែនទី។',
      searchPlaceholder: 'វាយឈ្មោះទីតាំង ឬខេត្ត...',
      allCategories: 'ប្រភេទទាំងអស់',
      allProvinces: 'ខេត្ត-ក្រុងទាំងអស់',
      popularOnly: 'ពេញនិយមប៉ុណ្ណោះ',
      listView: 'បង្ហាញជាបញ្ជី',
      mapView: 'ផែនទីកម្ពុជា',
      resultsCount: 'ទីតាំងត្រូវបានរកឃើញ',
      emptyTitle: 'មិនមានទីតាំងដែលត្រូវគ្នាទេ',
      emptyBody: 'សូមសាកល្បងលុបតម្រង ឬស្វែងរកខេត្តផ្សេងទៀតដូចជា សៀមរាប ភ្នំពេញ ឬកំពត។',
      resetFilters: 'កំណត់តម្រងឡើងវិញ',
    },
    detail: {
      back: 'ត្រឡប់ក្រោយ',
      province: 'ខេត្ត / រាជធានី',
      address: 'ទីតាំងអាសយដ្ឋាន',
      coordinates: 'កូអរដោនេ GPS',
      entranceFee: 'តម្លៃសំបុត្រចូល',
      openingHours: 'ម៉ោងបើកទស្សនា',
      verificationBadge: 'ត្រូវផ្ទៀងផ្ទាត់នៅទីតាំង',
      verificationNote: 'តម្លៃសំបុត្រ និងម៉ោងបើកអាចផ្លាស់ប្តូរតាមការកំណត់របស់អាជ្ញាធរ សូមផ្ទៀងផ្ទាត់មុនពេលចេញដំណើរ។',
      travelTips: 'គន្លឹះធ្វើដំណើរ',
      openInMaps: 'បើកទិសដៅក្នុង Google Maps',
      saveFavorite: 'រក្សាទុកក្នុងបញ្ជីចូលចិត្ត',
      removeFavorite: 'បានរក្សាទុកក្នុងចូលចិត្ត',
      addToTrip: 'បន្ថែមទៅគម្រោងដំណើរ',
      addedToTrip: 'បានបន្ថែមទៅគម្រោង',
      selectTrip: 'ជ្រើសរើសគម្រោងដំណើរ',
      createNewTrip: 'បង្កើតគម្រោងថ្មី',
    },
    favorites: {
      title: 'ទីតាំងដែលចូលចិត្ត',
      subtitle: 'កន្លែងដែលអ្នកបានរក្សាទុកសម្រាប់ដំណើរកម្សាន្តនៅកម្ពុជា។',
      emptyTitle: 'មិនទាន់មានទីតាំងដែលបានរក្សាទុកទេ',
      emptyBody: 'ចុចប៊ូតុងបេះដូងលើតំបន់ទេសចរណ៍ណាមួយ ដើម្បីរក្សាទុកទីនេះ។',
      browseBtn: 'ស្វែងរកទីតាំងទេសចរណ៍',
      loginNotice: 'បញ្ជីចូលចិត្តត្រូវបានរក្សាទុកបណ្តោះអាសន្ន ហើយនឹងធ្វើសមកាលកម្មជាមួយគណនីរបស់អ្នកពេលចូលប្រើ។',
    },
    trips: {
      title: 'គម្រោងដំណើររបស់ខ្ញុំ',
      subtitle: 'រៀបចំកាលបរិច្ឆេទ ទីតាំងត្រូវទៅ និងកំណត់ចំណាំផ្ទាល់ខ្លួន។',
      newTripBtn: 'បង្កើតគម្រោងថ្មី',
      editTrip: 'កែសម្រួល',
      deleteTrip: 'លុប',
      tripTitleLabel: 'ឈ្មោះគម្រោងដំណើរ',
      tripTitlePlaceholder: 'ឧ. ដំណើរកម្សាន្ត សៀមរាប និងកំពត ៥ ថ្ងៃ',
      startDateLabel: 'ថ្ងៃចាប់ផ្តើម',
      endDateLabel: 'ថ្ងៃបញ្ចប់',
      notesLabel: 'កំណត់ចំណាំដំណើរ',
      notesPlaceholder: 'មធ្យោបាយធ្វើដំណើរ ម៉ោងមើលថ្ងៃរះ ឬសម្ភារៈចាំបាច់...',
      destinationsLabel: 'ជ្រើសរើសទីតាំងទេសចរណ៍',
      saveTrip: 'រក្សាទុកគម្រោង',
      cancel: 'បោះបង់',
      daysUnit: 'ថ្ងៃ',
      stopsUnit: 'ទីតាំង',
      emptyTitle: 'មិនទាន់មានគម្រោងដំណើរទេ',
      emptyBody: 'ចាប់ផ្តើមបង្កើតផែនការដំណើរកម្សាន្តដោយជ្រើសរើសថ្ងៃ និងទីតាំងទេសចរណ៍។',
      signInPrompt: 'សូមចូលគណនី ដើម្បីរក្សាទុកគម្រោងដំណើររបស់អ្នកជាអចិន្ត្រៃយ៍។',
      validation: {
        titleRequired: 'សូមបញ្ចូលឈ្មោះគម្រោងយ៉ាងតិច ២ តួអក្សរ។',
        datesRequired: 'សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម និងថ្ងៃបញ្ចប់។',
        endBeforeStart: 'ថ្ងៃបញ្ចប់មិនអាចមុនថ្ងៃចាប់ផ្តើមបានទេ។',
        destinationRequired: 'សូមជ្រើសរើសទីតាំងយ៉ាងតិច ១។',
      },
    },
    profile: {
      title: 'គណនីអ្នកដំណើរ',
      signInTitle: 'ចូលប្រើគណនីរបស់អ្នក',
      registerTitle: 'បង្កើតគណនីអ្នកដំណើរថ្មី',
      emailLabel: 'អ៊ីមែល',
      passwordLabel: 'ពាក្យសម្ងាត់',
      nameLabel: 'ឈ្មោះពេញ',
      signInBtn: 'ចូលប្រើ',
      registerBtn: 'ចុះឈ្មោះ',
      switchToRegister: 'មិនទាន់មានគណនី? ចុះឈ្មោះ',
      switchToLogin: 'មានគណនីរួចហើយ? ចូលប្រើ',
      demoTouristBtn: 'សាកល្បងគណនីអ្នកទេសចរ',
      demoAdminBtn: 'សាកល្បងគណនីអ្នកគ្រប់គ្រង',
      accountSummary: 'សង្ខេបគណនី',
      savedCount: 'ទីតាំងចូលចិត្ត',
      tripsCount: 'គម្រោងដំណើរ',
      languageLabel: 'ភាសាកម្មវិធី',
      editProfileTitle: 'ព័ត៌មានគណនី',
      updateProfileBtn: 'រក្សាទុកព័ត៌មាន',
      changePasswordTitle: 'ផ្លាស់ប្តូរពាក្យសម្ងាត់',
      currentPasswordLabel: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
      newPasswordLabel: 'ពាក្យសម្ងាត់ថ្មី (យ៉ាងតិច ៦ តួ)',
      updatePasswordBtn: 'ប្តូរពាក្យសម្ងាត់',
      logoutBtn: 'ចាកចេញ',
      openAdminBtn: 'ផ្ទាំងគ្រប់គ្រងទិន្នន័យ (Admin)',
      openDeliverablesBtn: 'មើលកូដ Flutter, Laravel និង MySQL',
      profileUpdated: 'បានកែប្រែព័ត៌មានគណនីដោយជោគជ័យ។',
      passwordUpdated: 'បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ។',
    },
    admin: {
      title: 'ផ្ទាំងគ្រប់គ្រងទេសចរណ៍',
      subtitle: 'គ្រប់គ្រងតំបន់ទេសចរណ៍ ប្រភេទទីតាំង និងរូបភាព។',
      restrictedTitle: 'តម្រូវឱ្យមានសិទ្ធិអ្នកគ្រប់គ្រង',
      restrictedBody: 'សូមចូលប្រើដោយគណនីអ្នកគ្រប់គ្រង ដើម្បីបន្ថែម កែសម្រួល ឬលុបទិន្នន័យ។',
      addDestinationBtn: 'បន្ថែមទីតាំងថ្មី',
      editDestination: 'កែសម្រួល',
      deleteDestination: 'លុប',
      categoriesTab: 'ប្រភេទ',
      destinationsTab: 'តំបន់ទេសចរណ៍',
      addCategoryBtn: 'បន្ថែមប្រភេទ',
      uploadImageLabel: 'ផ្ទុករូបភាពឡើង',
      totalDestinations: 'ទីតាំងសរុប',
      totalCategories: 'ប្រភេទសរុប',
      totalUsers: 'អ្នកប្រើប្រាស់',
      totalTrips: 'គម្រោងដំណើរ',
      saveBtn: 'រក្សាទុក',
    },
    deliverables: {
      title: 'កូដគម្រោង Flutter, Laravel & MySQL',
      subtitle: 'កូដពេញលេញសម្រាប់កម្មវិធីទូរស័ព្ទ Flutter, Laravel REST API, MySQL និងការណែនាំបង្កើត APK។',
      copyCode: 'ចម្លងកូដ',
      copied: 'បានចម្លង',
      downloadFile: 'ទាញយក',
    },
    common: {
      loading: 'កំពុងផ្ទុក...',
      errorPrefix: 'កំហុស៖',
      close: 'បិទ',
      popularLabel: 'ពេញនិយម',
      featuredLabel: 'ពិសេស',
    },
  },
};
