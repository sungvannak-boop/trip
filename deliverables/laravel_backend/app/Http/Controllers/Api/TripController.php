<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTripRequest;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TripController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $trips = Trip::with('destinations')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['trips' => $trips]);
    }

    public function store(StoreTripRequest $request): JsonResponse
    {
        $data = $request->validated();

        $trip = Trip::create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'notes' => $data['notes'] ?? null,
        ]);

        $syncPayload = [];
        foreach (array_values($data['destinations']) as $index => $destinationId) {
            $syncPayload[$destinationId] = [
                'visit_order' => $index + 1,
                'day_number' => 1,
            ];
        }
        $trip->destinations()->sync($syncPayload);

        return response()->json(['trip' => $trip->load('destinations')], 201);
    }

    public function update(StoreTripRequest $request, Trip $trip): JsonResponse
    {
        if ($trip->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validated();
        $trip->update([
            'title' => $data['title'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'notes' => $data['notes'] ?? null,
        ]);

        $syncPayload = [];
        foreach (array_values($data['destinations']) as $index => $destinationId) {
            $syncPayload[$destinationId] = [
                'visit_order' => $index + 1,
                'day_number' => 1,
            ];
        }
        $trip->destinations()->sync($syncPayload);

        return response()->json(['trip' => $trip->load('destinations')]);
    }

    public function destroy(Request $request, Trip $trip): JsonResponse
    {
        if ($trip->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $trip->delete();

        return response()->json(['message' => 'Trip deleted.']);
    }
}
