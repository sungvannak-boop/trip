import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/tourism_providers.dart';

class TripsScreen extends ConsumerWidget {
  const TripsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(localeProvider).languageCode;
    final tripsAsync = ref.watch(tripsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(lang == 'km' ? 'គម្រោងដំណើររបស់ខ្ញុំ' : 'My Trips'),
      ),
      body: tripsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (trips) {
          if (trips.isEmpty) {
            return Center(
              child: Text(
                lang == 'km' ? 'មិនទាន់មានគម្រោងដំណើរទេ។' : 'No travel plans created yet.',
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: trips.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (_, idx) {
              final trip = trips[idx];
              return Card(
                child: ListTile(
                  title: Text(trip.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${trip.startDate} – ${trip.endDate}\n${trip.notes}'),
                  isThreeLine: true,
                  trailing: IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                    onPressed: () => ref.read(tripsProvider.notifier).deleteTrip(trip.id),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
