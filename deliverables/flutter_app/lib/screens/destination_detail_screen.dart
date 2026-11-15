import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/app_theme.dart';
import '../models/models.dart';
import '../providers/tourism_providers.dart';

class DestinationDetailScreen extends ConsumerWidget {
  const DestinationDetailScreen({super.key, required this.destination});

  final DestinationModel destination;

  Future<void> _openGoogleMaps() async {
    final uri = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}',
    );
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(localeProvider).languageCode;
    final favorites = ref.watch(favoritesProvider);
    final isFav = favorites.contains(destination.id);

    return Scaffold(
      appBar: AppBar(
        title: Text(destination.localizedName(lang)),
        actions: [
          IconButton(
            onPressed: () => ref.read(favoritesProvider.notifier).toggle(destination.id),
            icon: Icon(
              isFav ? Icons.favorite : Icons.favorite_border,
              color: isFav ? AppTheme.angkorGold : null,
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            destination.nameEn,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          Text(
            destination.nameKm,
            style: const TextStyle(fontSize: 18, color: AppTheme.emeraldPrimary),
          ),
          const SizedBox(height: 12),
          Text(
            '${destination.localizedProvince(lang)} · ${destination.localizedAddress(lang)}',
            style: const TextStyle(fontSize: 13, color: Color(0xFF5A655F)),
          ),
          const SizedBox(height: 6),
          Text(
            'GPS: ${destination.latitude.toStringAsFixed(4)}, ${destination.longitude.toStringAsFixed(4)}',
            style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
          ),
          const SizedBox(height: 16),
          Text(
            destination.localizedDesc(lang),
            style: const TextStyle(fontSize: 15, height: 1.6),
          ),
          const SizedBox(height: 20),
          _InfoCard(
            title: lang == 'km' ? 'តម្លៃសំបុត្រចូល (ត្រូវផ្ទៀងផ្ទាត់)' : 'Entrance Fee (Verify on site)',
            body: destination.localizedFee(lang),
            icon: Icons.confirmation_number_outlined,
          ),
          const SizedBox(height: 12),
          _InfoCard(
            title: lang == 'km' ? 'ម៉ោងបើកទស្សនា (ត្រូវផ្ទៀងផ្ទាត់)' : 'Opening Hours (Verify on site)',
            body: destination.localizedHours(lang),
            icon: Icons.schedule,
          ),
          const SizedBox(height: 12),
          _InfoCard(
            title: lang == 'km' ? 'គន្លឹះធ្វើដំណើរ' : 'Travel Tips',
            body: destination.localizedTips(lang),
            icon: Icons.tips_and_updates_outlined,
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: _openGoogleMaps,
            icon: const Icon(Icons.directions),
            label: Text(lang == 'km' ? 'បើកទិសដៅក្នុង Google Maps' : 'Directions in Google Maps'),
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(50),
              backgroundColor: AppTheme.emeraldPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({required this.title, required this.body, required this.icon});

  final String title;
  final String body;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: AppTheme.emeraldPrimary),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 4),
                  Text(body, style: const TextStyle(fontSize: 13, height: 1.5)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
