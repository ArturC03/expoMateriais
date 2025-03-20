<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Material;
use App\Models\RequisicaoMaterial;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\RequisicaoController;
use App\Http\Controllers\SettingsController;

// Rota pública para a página inicial
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Rotas protegidas por autenticação
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
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

    // Rotas para materiais
    Route::prefix('materiais')->name('materiais.')->group(function () {
        Route::get('/', [MaterialController::class, 'index'])->name('index');
        Route::get('/create', [MaterialController::class, 'create'])->name('create');
        Route::post('/', [MaterialController::class, 'store'])->name('store');
        Route::get('/{material}', [MaterialController::class, 'show'])->name('show');
        Route::get('/{material}/edit', [MaterialController::class, 'edit'])->name('edit');
        Route::put('/{material}', [MaterialController::class, 'update'])->name('update');
        Route::delete('/{material}', [MaterialController::class, 'destroy'])->name('destroy');
    });

    // Rotas para requisições
    Route::prefix('requisicoes')->name('requisicoes.')->group(function () {
        Route::get('/', [RequisicaoController::class, 'index'])->name('index');
        Route::get('/create', [RequisicaoController::class, 'create'])->name('create');
        Route::post('/', [RequisicaoController::class, 'store'])->name('store');
        Route::get('/{requisicao}', [RequisicaoController::class, 'show'])->name('show');
        Route::get('/{requisicao}/responder', [RequisicaoController::class, 'responderForm'])->name('responder.form');
        Route::post('/{requisicao}/responder', [RequisicaoController::class, 'responder'])->name('responder');
        Route::put('/{requisicao}', [RequisicaoController::class, 'update'])->name('update');
        Route::delete('/{requisicao}', [RequisicaoController::class, 'destroy'])->name('destroy');
    });

    // Rotas para configurações
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/profile', [SettingsController::class, 'profile'])->name('profile');
        Route::post('/profile', [SettingsController::class, 'updateProfile'])->name('profile.update');

        Route::get('/password', [SettingsController::class, 'password'])->name('password');
        Route::post('/password', [SettingsController::class, 'updatePassword'])->name('password.update');

        Route::get('/appearance', [SettingsController::class, 'appearance'])->name('appearance');
        Route::post('/appearance', [SettingsController::class, 'updateAppearance'])->name('appearance.update');
    });
});

// Inclui rotas de configurações e autenticação
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
