<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Projeto extends Model
{
    protected $table = 'projetos';

    protected $fillable = [
        'curso_id',
        'titulo',
        'descricao',
    ];

    /**
     * Curso a que o projeto pertence.
     * @return BelongsTo
     */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }
}
