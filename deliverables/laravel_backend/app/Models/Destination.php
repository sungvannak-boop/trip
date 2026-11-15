<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    protected $fillable = [
        'category_id',
        'slug',
        'name_en',
        'name_km',
        'description_en',
        'description_km',
        'province_en',
        'province_km',
        'address_en',
        'address_km',
        'latitude',
        'longitude',
        'entrance_fee_note_en',
        'entrance_fee_note_km',
        'opening_hours_note_en',
        'opening_hours_note_km',
        'travel_tips_en',
        'travel_tips_km',
        'image_url',
        'is_popular',
        'is_featured',
        'is_recommended',
        'requires_verification',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'is_popular' => 'boolean',
        'is_featured' => 'boolean',
        'is_recommended' => 'boolean',
        'requires_verification' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function trips(): BelongsToMany
    {
        return $this->belongsToMany(Trip::class, 'trip_destinations')
            ->withPivot(['visit_order', 'day_number', 'note'])
            ->withTimestamps();
    }
}
