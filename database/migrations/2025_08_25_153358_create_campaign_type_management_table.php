<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaign_type_management', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_management_id')->constrained('type_management')->onDelete('cascade');
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->boolean('is_active')->default(1); // opcional: activo por asignación
            $table->timestamps();

            $table->unique(['type_management_id', 'campaign_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_type_management');
    }
};
