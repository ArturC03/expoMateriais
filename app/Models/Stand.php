<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Stand extends Model
{
    protected $fillable = [
        'curso_id',
        'local_id',
    ];

    /**
     * Curso relacionado ao stand.
     * @return BelongsTo
     */
    public function curso():BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    /**
     * Stand relacionado ao curso.
     * @return BelongsTo
     */
    public function local(): BelongsTo
    {
        return $this->belongsTo(Local::class);
    }
}
