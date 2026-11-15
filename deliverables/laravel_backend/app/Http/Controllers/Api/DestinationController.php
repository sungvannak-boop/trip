<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDestinationRequest;
use App\Models\Category;
use App\Models\Destination;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Destination::query()->with('category');

        if ($search = $request->string('search')->trim()->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_km', 'like', "%{$search}%")
                    ->orWhere('province_en', 'like', "%{$search}%")
                    ->orWhere('province_km', 'like', "%{$search}%");
            });
        }

        if ($categorySlug = $request->string('category')->trim()->toString()) {
            if ($categorySlug !== 'all') {
                $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
            }
        }

        if ($province = $request->string('province')->trim()->toString()) {
            if ($province !== 'all') {
                $query->where('province_en', $province);
            }
        }

        if ($request->boolean('popular')) {
            $query->where('is_popular', true);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        return response()->json([
            'destinations' => $query->orderBy('id')->get(),
        ]);
    }

    public function show(Destination $destination): JsonResponse
    {
        return response()->json([
            'destination' => $destination->load('category'),
        ]);
    }

    public function store(StoreDestinationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $destination = Destination::create([
            ...$data,
            'slug' => Str::slug($data['name_en']) . '-' . uniqid(),
            'requires_verification' => true,
        ]);

        return response()->json(['destination' => $destination], 201);
    }

    public function update(StoreDestinationRequest $request, Destination $destination): JsonResponse
    {
        $destination->update($request->validated());

        return response()->json(['destination' => $destination->fresh()]);
    }

    public function destroy(Destination $destination): JsonResponse
    {
        $destination->delete();

        return response()->json(['message' => 'Destination deleted.']);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $path = $request->file('image')->store('destinations', 'public');

        return response()->json([
            'image_url' => Storage::url($path),
        ], 201);
    }

    public function adminStats(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'destinations' => Destination::count(),
                'categories' => Category::count(),
                'users' => User::count(),
                'trips' => Trip::count(),
            ],
        ]);
    }
}
