import 'package:flutter/material.dart';
import '../core/app_theme.dart';
import '../models/models.dart';

class DestinationCard extends StatelessWidget {
  const DestinationCard({
    super.key,
    required this.destination,
    required this.lang,
    required this.isFavorite,
    required this.onTap,
    required this.onToggleFavorite,
  });

  final DestinationModel destination;
  final String lang;
  final bool isFavorite;
  final VoidCallback onTap;
  final VoidCallback onToggleFavorite;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                AspectRatio(
                  aspectRatio: 16 / 10,
                  child: destination.imageUrl != null
                      ? Image.network(destination.imageUrl!, fit: BoxFit.cover)
                      : Container(
                          color: AppTheme.emeraldPrimary.withValues(alpha: 0.12),
                          child: const Center(
                            child: Icon(Icons.temple_buddhist, size: 42, color: AppTheme.emeraldPrimary),
                          ),
                        ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: IconButton.filledTonal(
                    onPressed: onToggleFavorite,
                    icon: Icon(
                      isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: isFavorite ? AppTheme.angkorGold : AppTheme.inkDark,
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    destination.localizedProvince(lang),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.emeraldPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    destination.localizedName(lang),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    destination.localizedDesc(lang),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 13, color: Color(0xFF4B5650)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
