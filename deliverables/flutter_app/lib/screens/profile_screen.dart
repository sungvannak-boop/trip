import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../providers/tourism_providers.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final _emailCtrl = TextEditingController(text: 'tourist@cambodia.guide');
  final _passCtrl = TextEditingController(text: 'password123');

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(localeProvider).languageCode;
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(title: Text(lang == 'km' ? 'គណនី' : 'Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.language, color: AppTheme.emeraldPrimary),
              title: Text(lang == 'km' ? 'ភាសាកម្មវិធី' : 'App Language'),
              trailing: SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'en', label: Text('English')),
                  ButtonSegment(value: 'km', label: Text('ខ្មែរ')),
                ],
                selected: {lang},
                onSelectionChanged: (sel) {
                  ref.read(localeProvider.notifier).state = Locale(sel.first);
                },
              ),
            ),
          ),
          const SizedBox(height: 16),
          authState.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => Text('Auth error: $e', style: const TextStyle(color: Colors.red)),
            data: (user) {
              if (user == null) {
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          lang == 'km' ? 'ចូលប្រើគណនី' : 'Sign In',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _emailCtrl,
                          decoration: const InputDecoration(labelText: 'Email'),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _passCtrl,
                          obscureText: true,
                          decoration: const InputDecoration(labelText: 'Password'),
                        ),
                        const SizedBox(height: 16),
                        FilledButton(
                          onPressed: () async {
                            await ref.read(authProvider.notifier).login(
                                  _emailCtrl.text.trim(),
                                  _passCtrl.text,
                                );
                            await ref.read(favoritesProvider.notifier).sync();
                            await ref.read(tripsProvider.notifier).fetchTrips();
                          },
                          child: Text(lang == 'km' ? 'ចូលប្រើ' : 'Sign In'),
                        ),
                      ],
                    ),
                  ),
                );
              }

              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${user.email} · ${user.role}'),
                      const SizedBox(height: 16),
                      OutlinedButton.icon(
                        onPressed: () => ref.read(authProvider.notifier).logout(),
                        icon: const Icon(Icons.logout),
                        label: Text(lang == 'km' ? 'ចាកចេញ' : 'Sign Out'),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
