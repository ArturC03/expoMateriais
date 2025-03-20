<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/*
* @extends Model
* @method static create(array $attributes)
*/
class Cargo extends Model
{
    protected $fillable = [
        'nome',
        'descricao'
    ];

    /**
     * Get the users that belong to the cargo.
     * @return HasMany
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
