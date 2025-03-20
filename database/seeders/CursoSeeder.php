<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Curso;
use App\Models\User;

class CursoSeeder extends Seeder
{
    /**
     * Lista de cursos a serem criados.
     *
     * @var array<int, array<string, string>>
     */
    protected array $cursos = [
        [
            'nome' => 'Informática e Tecnologias Multimédia',
            'sigla' => 'ITM',
            'diretor_nome' => 'Maria José Costa'
        ],
        [
            'nome' => 'Tecnologias e Sistemas de Informação',
            'sigla' => 'TSI',
            'diretor_nome' => 'Jorge Vieira'
        ],
    ];

    /**
     * Run the database seeds.
     * @return void
     */
    public function run(): void
    {
        foreach ($this->cursos as $curso) {
            Curso::create([
                'nome' => $curso['nome'],
                'sigla' => $curso['sigla'],
                'diretor_curso_id' => User::where('name', $curso['diretor_nome'])->first()->id
            ]);
        }
    }
}
