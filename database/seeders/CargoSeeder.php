<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cargo;

class CargoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cargos = [
            ['nome' => 'teste'],
            ['nome' => 'Professor'],
            ['nome' => 'Funcionário'],
            ['nome' => 'Diretor'],
            ['nome' => 'Administrativo'],
            ['nome' => 'Administrador'],
        ];

        foreach ($cargos as $cargo) {
            Cargo::create($cargo);
        }
    }
}
