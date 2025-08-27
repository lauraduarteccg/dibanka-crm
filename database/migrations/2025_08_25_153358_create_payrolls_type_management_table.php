<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payrolls_type_management', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_management_id')->constrained('type_management')->onDelete('cascade');
            $table->foreignId('payroll_id')->constrained('payrolls')->onDelete('cascade');
            $table->boolean('is_active')->default(1);
            $table->timestamps();

            $table->unique(['type_management_id', 'payroll_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls_type_management');
    }
};
