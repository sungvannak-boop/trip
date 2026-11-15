import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../providers/tourism_providers.dart';
import '../widgets/destination_card.dart';
import 'destination_detail_screen.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(localeProvider).languageCode;
    final categoriesAsync = ref.watch(categoriesProvider);
    final destinationsAsync = ref.watch(destinationsProvider);
    final favorites = ref.watch(favoritesProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(lang == 'km' ? 'មគ្គុទ្ទេសក៍កម្ពុជា' : 'Kingdom Compass'),
        actions: [
          TextButton(
            onPressed: () {
              ref.read(localeProvider.notifier).state =
                  lang == 'km' ? const Locale('en') : const Locale('km');
            },
            child: Text(lang == 'km' ? 'EN' : 'ខ្មែរ'),
          ),
        ],
      ),
      body: destinationsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (destinations) {
          final featured = destinations.where((d) => d.isFeatured).toList();
          final popular = destinations.where((d) => d.isPopular).toList();

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.emeraldPrimary,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      lang == 'km'
                          ? 'ស្វែងយល់ពីប្រាសាទ និងធម្មជាតិនៅកម្ពុជា'
                          : 'Discover Temples, Rivers & Islands Across Cambodia',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      lang == 'km'
                          ? 'រៀបចំផែនការធ្វើដំណើរ និងរក្សាទុកទីតាំងដែលអ្នកចូលចិត្ត'
                          : 'Explore heritage landmarks, GPS routes, and plan your trip.',
                      style: const TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Text(
                lang == 'km' ? 'ប្រភេទតំបន់ទេសចរណ៍' : 'Categories',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              categoriesAsync.when(
                loading: () => const SizedBox(height: 44),
                error: (_, __) => const SizedBox.shrink(),
                data: (cats) => SizedBox(
                  height: 42,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: cats.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (_, idx) => Chip(
                      label: Text(cats[idx].localizedName(lang)),
                      backgroundColor: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                lang == 'km' ? 'តំបន់ទេសចរណ៍ពិសេស' : 'Featured Landmarks',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              ...featured.map(
                (dest) => Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: DestinationCard(
                    destination: dest,
                    lang: lang,
                    isFavorite: favorites.contains(dest.id),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DestinationDetailScreen(destination: dest),
                      ),
                    ),
                    onToggleFavorite: () =>
                        ref.read(favoritesProvider.notifier).toggle(dest.id),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                lang == 'km' ? 'តំបន់ពេញនិយម' : 'Popular Destinations',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              ...popular.map(
                (dest) => Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: DestinationCard(
                    destination: dest,
                    lang: lang,
                    isFavorite: favorites.contains(dest.id),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DestinationDetailScreen(destination: dest),
                      ),
                    ),
                    onToggleFavorite: () =>
                        ref.read(favoritesProvider.notifier).toggle(dest.id),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
