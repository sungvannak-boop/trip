<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name_en' => ['required', 'string', 'max:160'],
            'name_km' => ['required', 'string', 'max:160'],
            'description_en' => ['required', 'string'],
            'description_km' => ['required', 'string'],
            'province_en' => ['required', 'string', 'max:100'],
            'province_km' => ['required', 'string', 'max:100'],
            'address_en' => ['required', 'string', 'max:255'],
            'address_km' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'entrance_fee_note_en' => ['required', 'string'],
            'entrance_fee_note_km' => ['required', 'string'],
            'opening_hours_note_en' => ['required', 'string'],
            'opening_hours_note_km' => ['required', 'string'],
            'travel_tips_en' => ['nullable', 'string'],
            'travel_tips_km' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:255'],
            'is_popular' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_recommended' => ['boolean'],
        ];
    }
}
