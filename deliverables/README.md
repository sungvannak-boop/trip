# Cambodia Tourism Guide App — Complete Full-Stack Project

A bilingual (**Khmer `ភាសាខ្មែរ` & English**) Cambodia Tourism Guide platform featuring:
1. **Flutter (Dart)** Material 3 mobile application (Android & iOS) with Riverpod state management, clean architecture, Google Maps navigation launcher, persistent favorites, and itinerary planner.
2. **Laravel (PHP)** REST API with Laravel Sanctum authentication, role-based access control (`tourist` / `admin`), Form Request validation, image upload storage, and MySQL Eloquent models.
3. **MySQL** relational schema with migrations, foreign keys, indexes, and bilingual seed data for 10 iconic Cambodian destinations.
4. **Admin Dashboard** (Laravel Blade + REST API management endpoints).

---

## Project Directory Structure

```text
deliverables/
├── README.md
├── API_DOCS.md
├── laravel_backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── DestinationController.php
│   │   │   │   ├── FavoriteController.php
│   │   │   │   └── TripController.php
│   │   │   ├── Middleware/AdminMiddleware.php
│   │   │   └── Requests/
│   │   │       ├── StoreDestinationRequest.php
│   │   │       └── StoreTripRequest.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Category.php
│   │       ├── Destination.php
│   │       ├── Favorite.php
│   │       └── Trip.php
│   ├── database/
│   │   ├── migrations/2026_01_01_000001_create_cambodia_tourism_tables.php
│   │   └── seeders/CambodiaTourismSeeder.php
│   ├── resources/views/admin/dashboard.blade.php
│   └── routes/api.php
└── flutter_app/
    ├── pubspec.yaml
    ├── l10n.yaml
    └── lib/
        ├── main.dart
        ├── core/
        │   ├── api_client.dart
        │   └── app_theme.dart
        ├── l10n/
        │   ├── app_en.arb
        │   └── app_km.arb
        ├── models/
        │   ├── category_model.dart
        │   ├── destination_model.dart
        │   ├── trip_model.dart
        │   └── user_model.dart
        ├── providers/
        │   └── tourism_providers.dart
        ├── screens/
        │   ├── home_screen.dart
        │   ├── explore_screen.dart
        │   ├── destination_detail_screen.dart
        │   ├── favorites_screen.dart
        │   ├── trips_screen.dart
        │   └── profile_screen.dart
        └── widgets/
            └── destination_card.dart
```

---

## 1. Laravel Backend & MySQL Installation

### Prerequisites
- PHP 8.2+, Composer 2.x, MySQL 8.0+

### Setup Steps
```bash
# 1. Create a fresh Laravel project and install Sanctum
composer create-project laravel/laravel cambodia-tourism-api
cd cambodia-tourism-api
composer require laravel/sanctum
php artisan install:api

# 2. Copy the files from deliverables/laravel_backend/ into the Laravel project:
#    - app/Models/*
#    - app/Http/Controllers/Api/*
#    - app/Http/Middleware/AdminMiddleware.php
#    - app/Http/Requests/*
#    - database/migrations/*
#    - database/seeders/CambodiaTourismSeeder.php
#    - resources/views/admin/dashboard.blade.php
#    - routes/api.php

# 3. Register 'admin' middleware alias in bootstrap/app.php:
#    ->withMiddleware(function (Middleware $middleware) {
#        $middleware->alias(['admin' => \App\Http\Middleware\AdminMiddleware::class]);
#    })

# 4. Configure .env for MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cambodia_tourism
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# 5. Create database, run migrations & seeders, link storage
mysql -u root -p -e "CREATE DATABASE cambodia_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate --seed --seeder=CambodiaTourismSeeder
php artisan storage:link

# 6. Start the API server
php artisan serve --host=0.0.0.0 --port=8000
```

### Seeded Accounts
- **Tourist**: `tourist@cambodia.guide` / `password123`
- **Admin**: `admin@cambodia.guide` / `admin123`

---

## 2. Flutter Mobile App Installation

### Prerequisites
- Flutter SDK 3.22+ (`flutter doctor` passing)
- Android Studio / Android SDK (API 34+)

### Setup Steps
```bash
# 1. Create Flutter project and copy deliverables/flutter_app/
flutter create cambodia_tourism_app
cd cambodia_tourism_app
# Copy pubspec.yaml, l10n.yaml, and lib/ from deliverables/flutter_app/

# 2. Install packages and generate Khmer & English localizations
flutter pub get
flutter gen-l10n

# 3. Configure API base URL in lib/core/api_client.dart
#    - Android Emulator -> http://10.0.2.2:8000/api
#    - Physical Device  -> http://<YOUR_LAN_IP>:8000/api

# 4. Run on emulator or connected Android device
flutter run
```

---

## 3. Android APK Build Instructions

```bash
# 1. Generate release keystore (first time only)
keytool -genkey -v -keystore ~/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# 2. Verify app permissions in android/app/src/main/AndroidManifest.xml:
#    <uses-permission android:name="android.permission.INTERNET" />

# 3. Build universal release APK
flutter build apk --release

# Output APK location:
# build/app/outputs/flutter-apk/app-release.apk

# Optional: Build split-per-ABI APKs for smaller downloads:
flutter build apk --split-per-abi --release

# Optional: Build Android App Bundle (.aab) for Google Play Store:
flutter build appbundle --release
```

---

## 4. Verification Note on Destination Information
Entrance fees and opening hours for all Cambodian heritage sites, national parks, and islands are explicitly marked `requires_verification = true` in both MySQL and Flutter models, reminding travelers to confirm current official ticket center rates and seasonal hours upon arrival.
