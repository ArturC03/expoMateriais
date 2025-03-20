<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;



class Local extends Model
{
    protected $table = 'locais';

    protected $fillable = [
        'nome',
        'descricao',
    ];

    /**
     * Materiais associados a este local.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function materiais(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'local_material', 'local_id', 'material_id')
                    ->using(LocalMaterial::class)
                    ->withPivot('quantidade')
                    ->withTimestamps();
    }

    /**
     * Estandes associados a este local.
     * @return HasMany
     */
    public function stands(): HasMany
    {
        return $this->hasMany(Stand::class);
    }

}
