import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/tourism_providers.dart';
import '../widgets/destination_card.dart';
import 'destination_detail_screen.dart';

class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  String _query = '';
  int? _categoryId;
  bool _onlyPopular = false;

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(localeProvider).languageCode;
    final categoriesAsync = ref.watch(categoriesProvider);
    final destinationsAsync = ref.watch(destinationsProvider);
    final favorites = ref.watch(favoritesProvider);

    return Scaffold(
      appBar: AppBar(title: Text(lang == 'km' ? 'ស្វែងរកទីតាំង' : 'Explore Cambodia')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: TextField(
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search),
                hintText: lang == 'km' ? 'ស្វែងរកឈ្មោះ ឬខេត្ត...' : 'Search name or province...',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onChanged: (val) => setState(() => _query = val.trim().toLowerCase()),
            ),
          ),
          categoriesAsync.when(
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
            data: (cats) => SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Row(
                children: [
                  FilterChip(
                    label: Text(lang == 'km' ? 'ទាំងអស់' : 'All'),
                    selected: _categoryId == null,
                    onSelected: (_) => setState(() => _categoryId = null),
                  ),
                  const SizedBox(width: 8),
                  FilterChip(
                    label: Text(lang == 'km' ? 'ពេញនិយម' : 'Popular'),
                    selected: _onlyPopular,
                    onSelected: (v) => setState(() => _onlyPopular = v),
                  ),
                  ...cats.map(
                    (c) => Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: FilterChip(
                        label: Text(c.localizedName(lang)),
                        selected: _categoryId == c.id,
                        onSelected: (_) => setState(
                          () => _categoryId = _categoryId == c.id ? null : c.id,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: destinationsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
              data: (items) {
                final filtered = items.where((d) {
                  if (_onlyPopular && !d.isPopular) return false;
                  if (_categoryId != null && d.categoryId != _categoryId) return false;
                  if (_query.isNotEmpty) {
                    final hay = '${d.nameEn} ${d.nameKm} ${d.provinceEn} ${d.provinceKm}'.toLowerCase();
                    if (!hay.contains(_query)) return false;
                  }
                  return true;
                }).toList();

                if (filtered.isEmpty) {
                  return Center(
                    child: Text(lang == 'km' ? 'រកមិនឃើញទីតាំងទេ' : 'No matching destinations.'),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 14),
                  itemBuilder: (_, idx) {
                    final dest = filtered[idx];
                    return DestinationCard(
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
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
