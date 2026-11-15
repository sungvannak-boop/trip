<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::with('destination')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'favorite_ids' => $favorites->pluck('destination_id'),
            'destinations' => $favorites->pluck('destination')->filter()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'destination_id' => ['required', 'integer', 'exists:destinations,id'],
        ]);

        Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'destination_id' => $validated['destination_id'],
        ]);

        $ids = Favorite::where('user_id', $request->user()->id)->pluck('destination_id');

        return response()->json(['favorite_ids' => $ids], 201);
    }

    public function destroy(Request $request, Destination $destination): JsonResponse
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('destination_id', $destination->id)
            ->delete();

        $ids = Favorite::where('user_id', $request->user()->id)->pluck('destination_id');

        return response()->json(['favorite_ids' => $ids]);
    }
}
