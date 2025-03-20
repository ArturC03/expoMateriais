<?php

namespace App\Filament\Resources\CursoResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProjetosRelationManager extends RelationManager
{
    protected static string $relationship = 'projetos';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('titulo')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('descricao')
                ->label('Descrição')
                ->required()
                    ->maxLength(65535),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('titulo')
            ->columns([
                Tables\Columns\TextColumn::make('titulo')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('descricao')
                    ->limit(50)
                    ->label('Descrição')
                    ->searchable()
                    ->tooltip(function ($record) {
                        return $record->descricao;
                    }),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\AttachAction::make()
                ->label('Adicionar'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DetachAction::make()
                ->label('Remover'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DetachBulkAction::make(),
                ]),
            ]);
    }
}
