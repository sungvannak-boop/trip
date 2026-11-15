<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'categories' => Category::orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_en' => ['required', 'string', 'max:120'],
            'name_km' => ['required', 'string', 'max:120'],
            'icon' => ['nullable', 'string', 'max:60'],
            'description_en' => ['nullable', 'string'],
            'description_km' => ['nullable', 'string'],
        ]);

        $category = Category::create([
            ...$validated,
            'slug' => Str::slug($validated['name_en']) . '-' . uniqid(),
            'icon' => $validated['icon'] ?? 'compass',
        ]);

        return response()->json(['category' => $category], 201);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->destinations()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that still contains destinations.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}
