<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estado extends Model
{
    protected $fillable = [
        'nome',
    ];

    /**
     * Get the requisicoes for the estado.
     * @@return HasMany
     */
    public function requisicoes(): HasMany
    {
        return $this->hasMany(RequisicaoMaterial::class);
    }
}
