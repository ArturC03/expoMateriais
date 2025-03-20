<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estados = [
            ['nome' => 'pendente'],
            ['nome' => 'aprovado'],
            ['nome' => 'rejeitado'],
        ];

        foreach ($estados as $estado) {
            DB::table('estados')->insert($estado);
        }
    }
}
