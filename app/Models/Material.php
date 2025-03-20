<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Material extends Model
{
    protected $table = 'materiais';

    protected $fillable = [
        'nome',
        'categoria_id',
        'descricao',
    ];

    /**
     * Locais onde o material está armazenado.
     * @return BelongsToMany
     */
    public function locais(): BelongsToMany
    {
        return $this->belongsToMany(Local::class, 'local_material', 'material_id', 'local_id')
        ->using(LocalMaterial::class)
        ->withPivot('quantidade')
        ->withTimestamps();
    }

    /**
     * Categoria do material.
     * @return BelongsTo
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }
}
