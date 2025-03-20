<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequisicaoMaterial extends Model
{
    protected $table = 'requisicoes_materiais';

    protected $fillable = [
        'projeto_id',
        'material_id',
        'estado_id',
        'quantidade',
        'finalidade',
    ];

    /**
     * Projeto relacionado à requisição.
     * @return BelongsTo
     */
    public function projeto(): BelongsTo
    {
        return $this->belongsTo(Projeto::class);
    }

    /**
     * Material relacionado à requisição.
     * @return BelongsTo
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    /**
     * Estado relacionado à requisição.
     * @return BelongsTo
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class);
    }
}
