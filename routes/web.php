<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Material;
use App\Models\RequisicaoMaterial;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Obtenha todos os materiais com informações necessárias
        $materiais = Material::with('locais')->get()->map(function ($material) {
            // Calcular quantidade total disponível em todos os locais
            $quantidadeTotal = $material->locais->sum('pivot.quantidade');

            return [
                'id' => $material->id,
                'nome' => $material->nome,
                'descricao' => $material->descricao,
                'quantidade_disponivel' => $quantidadeTotal
            ];
        });

        // Obtenha as requisições do usuário atual
        $requisicoes = RequisicaoMaterial::with(['projeto', 'material', 'estado'])
            ->whereHas('projeto', function ($query) {
                $query->where('curso_id', auth()->user()->curso->id ?? null);
            })
            ->latest()
            ->take(5)
            ->get();

        // Estatísticas de requisições
        $estatisticas = [
            'total' => RequisicaoMaterial::count(),
            'pendentes' => RequisicaoMaterial::where('estado_id', 1)->count(), // Assumindo que o estado_id 1 é pendente
            'aprovadas' => RequisicaoMaterial::where('estado_id', 2)->count(), // Assumindo que o estado_id 2 é aprovado
            'rejeitadas' => RequisicaoMaterial::where('estado_id', 3)->count(), // Assumindo que o estado_id 3 é rejeitado
        ];

        // Materiais mais requisitados (top 5)
        $materiaisMaisRequisitados = RequisicaoMaterial::select('material_id')
            ->selectRaw('COUNT(*) as total_requisicoes')
            ->with('material:id,nome')
            ->groupBy('material_id')
            ->orderByDesc('total_requisicoes')
            ->take(5)
            ->get()
            ->map(function ($req) {
                return [
                    'id' => $req->material_id,
                    'nome' => $req->material->nome,
                    'total' => $req->total_requisicoes
                ];
            });

        return Inertia::render('dashboard', [
            'user' => auth()->user(),
            'cargo' => auth()->user()->cargos ? auth()->user()->cargos->nome : null,
            'curso' => auth()->user()->curso ? auth()->user()->curso->nome : null,
            'materiais' => $materiais,
            'requisicoes' => $requisicoes,
            'estatisticas' => $estatisticas,
            'materiaisMaisRequisitados' => $materiaisMaisRequisitados
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
