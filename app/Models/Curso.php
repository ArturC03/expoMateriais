<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

/**
 * Curso Model
 * @method static \App\Models\Curso create(array $attributes = [])
 * @method static \App\Models\Curso find(int $id)
 * @method static \App\Models\Curso findOrFail(int $id)
 * @method static \App\Models\Curso firstOrCreate(array $attributes = [])
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Curso where($column, $operator = null, $value = null, $boolean = 'and')
 */
class Curso extends Model
{
    use HasFactory;

    protected $table = 'cursos';

    protected $fillable = [
        'nome',
        'sigla',
        'diretor_curso_id'
    ];

    /**
     * Get the diretor de curso that owns the curso.
     * @return BelongsTo
     */
    public function diretorCurso(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diretor_curso_id');
    }

    /**
     * Get the projetos that belong to the curso.
     * @return HasMany
     */
    public function projetos(): HasMany
    {
        return $this->hasMany(Projeto::class);
    }
}
