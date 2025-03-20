<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categoria extends Model
{
    protected $fillable = ['nome'];

    /*
     * Relacionamento com a tabela Material
     * @return hasMany
     */
    public function materiais(): HasMany
    {
        return $this->hasMany(Material::class);
    }
}
