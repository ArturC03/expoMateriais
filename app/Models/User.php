<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Cargo;
use App\Models\Curso;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the cargo associated with the user.
     *
     * @return BelongsTo
     */
    public function cargos(): BelongsTo
    {
        return $this->belongsTo(Cargo::class);
    }

    /**
     * Get the curso associated with the user.
     *
     * @return HasOne
     */
    public function curso(): HasOne
    {
        return $this->hasOne(Curso::class, 'diretor_curso_id');
    }

    public function isAdmin(): bool
    {
        return $this->cargos()->where('nome', 'Administrador')->exists();
    }

}
