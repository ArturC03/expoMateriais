<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cargo;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            CargoSeeder::class,
            EstadoSeeder::class,
        ]);

        $professorCargoId = Cargo::where('nome', 'Professor')->first()->id;

        User::factory()->createMany([
            [
                'name' => 'Maria José Costa',
                'email' => 'maria.jose.costa@example.com',
                'id_cargo' => $professorCargoId,
            ],
            [
                'name' => 'Jorge Vieira',
                'email' => 'jorge.vieira@example.com',
                'id_cargo' => $professorCargoId,
            ]
        ]);

        // Seed other models here
        $this->call([
            CursoSeeder::class,
        ]);
    }
}
