class CategoryModel {
  final int id;
  final String slug;
  final String nameEn;
  final String nameKm;
  final String icon;

  CategoryModel({
    required this.id,
    required this.slug,
    required this.nameEn,
    required this.nameKm,
    required this.icon,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) => CategoryModel(
        id: json['id'] as int,
        slug: json['slug'] as String,
        nameEn: json['name_en'] as String,
        nameKm: json['name_km'] as String,
        icon: (json['icon'] ?? 'landmark') as String,
      );

  String localizedName(String lang) => lang == 'km' ? nameKm : nameEn;
}

class DestinationModel {
  final int id;
  final int categoryId;
  final String slug;
  final String nameEn;
  final String nameKm;
  final String descriptionEn;
  final String descriptionKm;
  final String provinceEn;
  final String provinceKm;
  final String addressEn;
  final String addressKm;
  final double latitude;
  final double longitude;
  final String entranceFeeNoteEn;
  final String entranceFeeNoteKm;
  final String openingHoursNoteEn;
  final String openingHoursNoteKm;
  final String travelTipsEn;
  final String travelTipsKm;
  final String? imageUrl;
  final bool isPopular;
  final bool isFeatured;
  final bool isRecommended;

  DestinationModel({
    required this.id,
    required this.categoryId,
    required this.slug,
    required this.nameEn,
    required this.nameKm,
    required this.descriptionEn,
    required this.descriptionKm,
    required this.provinceEn,
    required this.provinceKm,
    required this.addressEn,
    required this.addressKm,
    required this.latitude,
    required this.longitude,
    required this.entranceFeeNoteEn,
    required this.entranceFeeNoteKm,
    required this.openingHoursNoteEn,
    required this.openingHoursNoteKm,
    required this.travelTipsEn,
    required this.travelTipsKm,
    this.imageUrl,
    required this.isPopular,
    required this.isFeatured,
    required this.isRecommended,
  });

  factory DestinationModel.fromJson(Map<String, dynamic> json) => DestinationModel(
        id: json['id'] as int,
        categoryId: json['category_id'] as int,
        slug: json['slug'] as String,
        nameEn: json['name_en'] as String,
        nameKm: json['name_km'] as String,
        descriptionEn: json['description_en'] as String,
        descriptionKm: json['description_km'] as String,
        provinceEn: json['province_en'] as String,
        provinceKm: json['province_km'] as String,
        addressEn: json['address_en'] as String,
        addressKm: json['address_km'] as String,
        latitude: (json['latitude'] as num).toDouble(),
        longitude: (json['longitude'] as num).toDouble(),
        entranceFeeNoteEn: (json['entrance_fee_note_en'] ?? '') as String,
        entranceFeeNoteKm: (json['entrance_fee_note_km'] ?? '') as String,
        openingHoursNoteEn: (json['opening_hours_note_en'] ?? '') as String,
        openingHoursNoteKm: (json['opening_hours_note_km'] ?? '') as String,
        travelTipsEn: (json['travel_tips_en'] ?? '') as String,
        travelTipsKm: (json['travel_tips_km'] ?? '') as String,
        imageUrl: json['image_url'] as String?,
        isPopular: (json['is_popular'] ?? false) as bool,
        isFeatured: (json['is_featured'] ?? false) as bool,
        isRecommended: (json['is_recommended'] ?? false) as bool,
      );

  String localizedName(String lang) => lang == 'km' ? nameKm : nameEn;
  String localizedDesc(String lang) => lang == 'km' ? descriptionKm : descriptionEn;
  String localizedProvince(String lang) => lang == 'km' ? provinceKm : provinceEn;
  String localizedAddress(String lang) => lang == 'km' ? addressKm : addressEn;
  String localizedFee(String lang) => lang == 'km' ? entranceFeeNoteKm : entranceFeeNoteEn;
  String localizedHours(String lang) => lang == 'km' ? openingHoursNoteKm : openingHoursNoteEn;
  String localizedTips(String lang) => lang == 'km' ? travelTipsKm : travelTipsEn;
}

class TripModel {
  final int id;
  final String title;
  final String startDate;
  final String endDate;
  final String notes;
  final List<DestinationModel> destinations;

  TripModel({
    required this.id,
    required this.title,
    required this.startDate,
    required this.endDate,
    required this.notes,
    required this.destinations,
  });

  factory TripModel.fromJson(Map<String, dynamic> json) => TripModel(
        id: json['id'] as int,
        title: json['title'] as String,
        startDate: json['start_date'] as String,
        endDate: json['end_date'] as String,
        notes: (json['notes'] ?? '') as String,
        destinations: (json['destinations'] as List<dynamic>? ?? [])
            .map((e) => DestinationModel.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

class UserModel {
  final int id;
  final String name;
  final String email;
  final String role;
  final String preferredLanguage;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.preferredLanguage,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['id'] as int,
        name: json['name'] as String,
        email: json['email'] as String,
        role: (json['role'] ?? 'tourist') as String,
        preferredLanguage: (json['preferred_language'] ?? 'en') as String,
      );
}
