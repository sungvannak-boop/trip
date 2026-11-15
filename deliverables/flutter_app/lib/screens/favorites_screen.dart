import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/tourism_providers.dart';
import '../widgets/destination_card.dart';
import 'destination_detail_screen.dart';

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(localeProvider).languageCode;
    final favorites = ref.watch(favoritesProvider);
    final destinationsAsync = ref.watch(destinationsProvider);

    return Scaffold(
      appBar: AppBar(title: Text(lang == 'km' ? 'ទីតាំងដែលចូលចិត្ត' : 'Favorites')),
      body: destinationsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (destinations) {
          final saved = destinations.where((d) => favorites.contains(d.id)).toList();
          if (saved.isEmpty) {
            return Center(
              child: Text(
                lang == 'km' ? 'មិនទាន់មានទីតាំងដែលបានរក្សាទុកទេ។' : 'No saved destinations yet.',
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: saved.length,
            separatorBuilder: (_, __) => const SizedBox(height: 14),
            itemBuilder: (_, idx) {
              final dest = saved[idx];
              return DestinationCard(
                destination: dest,
                lang: lang,
                isFavorite: true,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => DestinationDetailScreen(destination: dest),
                  ),
                ),
                onToggleFavorite: () =>
                    ref.read(favoritesProvider.notifier).toggle(dest.id),
              );
            },
          );
        },
      ),
    );
  }
}
