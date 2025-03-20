<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
// use App\Models\Local;
// use App\Models\Material;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
     public function up()
     {
         Schema::create('local_material', function (Blueprint $table) {
             $table->id();
             $table->foreignId('local_id')->constrained('locais')->onDelete('cascade');
             $table->foreignId('material_id')->constrained('materiais')->onDelete('cascade');
             $table->unsignedInteger('quantidade')->default(1); // Atributo extra
             $table->timestamps();
         });
     }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('local_material');
    }
};
