<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class LocalMaterial extends Pivot
{
    protected $table = 'local_material';

    protected $fillable = [
        'quantidade',
        'id_local',
        'id_material'
    ];

    public $timestamps = true;
}
