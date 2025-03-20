<?php

namespace App\Filament\Resources\Widgets;

use App\Models\RequisicaoMaterial;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RequisicoesMateriaisPendentes extends BaseWidget
{
    protected static ?int $sort = 1;

    // Make the widget full-width
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                RequisicaoMaterial::query()->latest()
            )
            ->columns([
                TextColumn::make('projeto.nome')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('material.nome')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('quantidade')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('finalidade')
                    ->searchable()
                    ->limit(50),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Data de Requisição'),
            ]);
    }
}
