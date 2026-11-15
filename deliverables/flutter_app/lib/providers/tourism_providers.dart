import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/api_client.dart';
import '../models/models.dart';

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

final localeProvider = StateProvider<Locale>((ref) => const Locale('en'));

final categoriesProvider = FutureProvider<List<CategoryModel>>((ref) async {
  final api = ref.read(apiClientProvider);
  final data = await api.get('/categories');
  return (data['categories'] as List<dynamic>)
      .map((e) => CategoryModel.fromJson(e as Map<String, dynamic>))
      .toList();
});

final destinationsProvider = FutureProvider<List<DestinationModel>>((ref) async {
  final api = ref.read(apiClientProvider);
  final data = await api.get('/destinations');
  return (data['destinations'] as List<dynamic>)
      .map((e) => DestinationModel.fromJson(e as Map<String, dynamic>))
      .toList();
});

class AuthNotifier extends StateNotifier<AsyncValue<UserModel?>> {
  AuthNotifier(this._api) : super(const AsyncValue.data(null)) {
    restoreSession();
  }

  final ApiClient _api;

  Future<void> restoreSession() async {
    final token = await _api.getToken();
    if (token == null) return;
    state = const AsyncValue.loading();
    try {
      final res = await _api.get('/auth/user');
      state = AsyncValue.data(UserModel.fromJson(res['user'] as Map<String, dynamic>));
    } catch (_) {
      await _api.clearToken();
      state = const AsyncValue.data(null);
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final res = await _api.post('/auth/login', {'email': email, 'password': password});
      await _api.saveToken(res['token'] as String);
      state = AsyncValue.data(UserModel.fromJson(res['user'] as Map<String, dynamic>));
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> register(String name, String email, String password, String lang) async {
    state = const AsyncValue.loading();
    try {
      final res = await _api.post('/auth/register', {
        'name': name,
        'email': email,
        'password': password,
        'preferred_language': lang,
      });
      await _api.saveToken(res['token'] as String);
      state = AsyncValue.data(UserModel.fromJson(res['user'] as Map<String, dynamic>));
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout', {});
    } catch (_) {}
    await _api.clearToken();
    state = const AsyncValue.data(null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<UserModel?>>(
  (ref) => AuthNotifier(ref.read(apiClientProvider)),
);

class FavoritesNotifier extends StateNotifier<Set<int>> {
  FavoritesNotifier(this._api) : super({});
  final ApiClient _api;

  Future<void> sync() async {
    try {
      final res = await _api.get('/favorites');
      final ids = (res['favorite_ids'] as List<dynamic>).map((e) => e as int).toSet();
      state = ids;
    } catch (_) {}
  }

  Future<void> toggle(int destinationId) async {
    final isFav = state.contains(destinationId);
    if (isFav) {
      state = {...state}..remove(destinationId);
      await _api.delete('/favorites/$destinationId');
    } else {
      state = {...state, destinationId};
      await _api.post('/favorites', {'destination_id': destinationId});
    }
  }
}

final favoritesProvider = StateNotifierProvider<FavoritesNotifier, Set<int>>(
  (ref) => FavoritesNotifier(ref.read(apiClientProvider)),
);

class TripsNotifier extends StateNotifier<AsyncValue<List<TripModel>>> {
  TripsNotifier(this._api) : super(const AsyncValue.data([]));
  final ApiClient _api;

  Future<void> fetchTrips() async {
    state = const AsyncValue.loading();
    try {
      final res = await _api.get('/trips');
      final list = (res['trips'] as List<dynamic>)
          .map((e) => TripModel.fromJson(e as Map<String, dynamic>))
          .toList();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createTrip({
    required String title,
    required String startDate,
    required String endDate,
    required String notes,
    required List<int> destinationIds,
  }) async {
    await _api.post('/trips', {
      'title': title,
      'start_date': startDate,
      'end_date': endDate,
      'notes': notes,
      'destinations': destinationIds,
    });
    await fetchTrips();
  }

  Future<void> deleteTrip(int id) async {
    await _api.delete('/trips/$id');
    await fetchTrips();
  }
}

final tripsProvider = StateNotifierProvider<TripsNotifier, AsyncValue<List<TripModel>>>(
  (ref) => TripsNotifier(ref.read(apiClientProvider)),
);
