<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Local;
use App\Models\RequisicaoMaterial;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Buscar todos os materiais com suas relações
        $materiais = Material::with(['locais'])
            ->select('id', 'nome', 'descricao')
            ->get()
            ->map(function($material) {
                // Calcular quantidade total disponível somando de todos os locais
                $quantidade_disponivel = $material->locais->sum('pivot.quantidade');

                return [
                    'id' => $material->id,
                    'nome' => $material->nome,
                    'descricao' => $material->descricao,
                    'quantidade_disponivel' => $quantidade_disponivel
                ];
            });

        // Buscar categorias para os filtros
        $categorias = Categoria::select('id', 'nome')->get();

        return Inertia::render('materiais/index', [
            'materiais' => $materiais,
            'categorias' => $categorias,
            'isAdmin' => auth()->user()->isAdmin()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Verificar se o usuário tem permissão de admin
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        // Buscar locais disponíveis para associar ao material
        $locais = Local::select('id', 'nome')->get();

        return Inertia::render('materiais/create', [
            'locais' => $locais
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'nome' => 'required|string|min:3|max:255',
            'descricao' => 'required|string|min:10',
            'locais' => 'required|array|min:1',
            'locais.*.id' => 'required|exists:locais,id',
            'locais.*.quantidade' => 'required|integer|min:0'
        ]);

        // Criar o material
        $material = Material::create([
            'nome' => $validated['nome'],
            'descricao' => $validated['descricao']
        ]);

        // Associar aos locais com as quantidades
        foreach ($validated['locais'] as $local) {
            $material->locais()->attach($local['id'], [
                'quantidade' => $local['quantidade']
            ]);
        }

        return redirect()->route('materiais.index')
            ->with('message', 'Material cadastrado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Material $material)
    {
        $material->load('locais');

        // Contar total de requisições
        $totalRequisicoes = RequisicaoMaterial::where('material_id', $material->id)->count();

        // Calcular quantidade total disponível
        $quantidadeDisponivel = $material->locais->sum('pivot.quantidade');

        return Inertia::render('materiais/show', [
            'material' => [
                'id' => $material->id,
                'nome' => $material->nome,
                'descricao' => $material->descricao,
                'quantidade_disponivel' => $quantidadeDisponivel,
                'historico_requisicoes' => $totalRequisicoes,
                'locais' => $material->locais->map(function($local) {
                    return [
                        'id' => $local->id,
                        'nome' => $local->nome,
                        'quantidade' => $local->pivot->quantidade
                    ];
                }),
                'created_at' => $material->created_at,
                'updated_at' => $material->updated_at
            ],
            'isAdmin' => auth()->user()->isAdmin()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Material $material)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $material->load('locais');
        $locais = Local::select('id', 'nome')->get();

        return Inertia::render('materiais/create', [
            'material' => [
                'id' => $material->id,
                'nome' => $material->nome,
                'descricao' => $material->descricao,
                'locais' => $material->locais->map(function($local) {
                    return [
                        'id' => $local->id,
                        'quantidade' => $local->pivot->quantidade
                    ];
                })
            ],
            'locais' => $locais
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Material $material)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'nome' => 'required|string|min:3|max:255',
            'descricao' => 'required|string|min:10',
            'locais' => 'required|array|min:1',
            'locais.*.id' => 'required|exists:locais,id',
            'locais.*.quantidade' => 'required|integer|min:0'
        ]);

        // Atualizar dados básicos do material
        $material->update([
            'nome' => $validated['nome'],
            'descricao' => $validated['descricao']
        ]);

        // Sincronizar relações com locais
        $syncData = [];
        foreach ($validated['locais'] as $local) {
            $syncData[$local['id']] = ['quantidade' => $local['quantidade']];
        }
        $material->locais()->sync($syncData);

        return redirect()->route('materiais.index')
            ->with('message', 'Material atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Material $material)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        // Verificar se existem requisições pendentes
        $requisicoesPendentes = RequisicaoMaterial::where('material_id', $material->id)
            ->where('estado_id', 1) // Estado pendente
            ->exists();

        if ($requisicoesPendentes) {
            return back()->with('error', 'Não é possível excluir um material com requisições pendentes.');
        }

        // Remover relações com locais
        $material->locais()->detach();

        // Excluir o material
        $material->delete();

        return redirect()->route('materiais.index')
            ->with('message', 'Material excluído com sucesso!');
    }
}
