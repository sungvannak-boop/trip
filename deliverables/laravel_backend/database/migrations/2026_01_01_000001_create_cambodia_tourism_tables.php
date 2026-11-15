<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['tourist', 'admin'])->default('tourist')->after('password');
            }
            if (!Schema::hasColumn('users', 'preferred_language')) {
                $table->enum('preferred_language', ['en', 'km'])->default('en')->after('role');
            }
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('name_en', 120);
            $table->string('name_km', 120);
            $table->string('icon', 60)->default('landmark');
            $table->text('description_en')->nullable();
            $table->text('description_km')->nullable();
            $table->timestamps();
        });

        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('slug', 140)->unique();
            $table->string('name_en', 160);
            $table->string('name_km', 160);
            $table->text('description_en');
            $table->text('description_km');
            $table->string('province_en', 100)->index();
            $table->string('province_km', 100);
            $table->string('address_en', 255);
            $table->string('address_km', 255);
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->text('entrance_fee_note_en');
            $table->text('entrance_fee_note_km');
            $table->text('opening_hours_note_en');
            $table->text('opening_hours_note_km');
            $table->text('travel_tips_en')->nullable();
            $table->text('travel_tips_km')->nullable();
            $table->string('image_url', 255)->nullable();
            $table->boolean('is_popular')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_recommended')->default(false);
            $table->boolean('requires_verification')->default(true);
            $table->timestamps();

            $table->index(['category_id', 'is_popular']);
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained('destinations')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'destination_id']);
        });

        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 160);
            $table->date('start_date');
            $table->date('end_date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'start_date']);
        });

        Schema::create('trip_destinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained('trips')->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained('destinations')->cascadeOnDelete();
            $table->unsignedSmallInteger('visit_order')->default(1);
            $table->unsignedSmallInteger('day_number')->default(1);
            $table->string('note', 255)->nullable();
            $table->timestamps();

            $table->unique(['trip_id', 'destination_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_destinations');
        Schema::dropIfExists('trips');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('destinations');
        Schema::dropIfExists('categories');
    }
};
