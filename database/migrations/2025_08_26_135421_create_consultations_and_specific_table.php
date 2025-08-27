<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('consultations_and_specific', function (Blueprint $table) {            
            $table->id();
            $table->foreignId('consultation_id')->constrained('consultations')->onDelete('cascade');
            $table->foreignId('consultation_specific_id')->constrained('consultation_specifics')->onDelete('cascade');
            $table->boolean('is_active')->default(1); // opcional: activo por asignación
            $table->timestamps();

            $table->unique(['consultation_id', 'consultation_specific_id'], 'consult_spec_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations_and_specific');
    }
};
