<?php

namespace App\Filament\Resources\LocalResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use PHPUnit\Framework\Test;

class MateriaisRelationManager extends RelationManager
{
    protected static string $relationship = 'materiais';
    protected static ?string $inverseRelationship = 'locais'; // Since the inverse related model is `Category`, this is normally `category`, not `section`.

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('nome')
                    ->label('Nome')
                    ->required()
                    ->maxLength(255),

                    Forms\Components\TextInput::make('quantidade')
                    ->numeric()
                    ->label('Quantidade')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('nome')
            ->columns([
                Tables\Columns\TextColumn::make('nome')->Label('Nome'),
                Tables\Columns\TextColumn::make('descricao')->Label('Descrição'),
                Tables\Columns\TextColumn::make('quantidade')->Label('Quantidade'),

            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\AttachAction::make()->label('Adicionar'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DetachAction::make()->label('Remover'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DetachBulkAction::make()

                ]),
            ]);
    }
}
