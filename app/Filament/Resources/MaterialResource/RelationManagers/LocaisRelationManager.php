<?php

namespace App\Filament\Resources\MaterialResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Models\Local;

class LocaisRelationManager extends RelationManager
{
    protected static string $relationship = 'locais';
    protected static ?string $inverseRelationship = 'materiais'; // Since the inverse related model is `Category`, this is normally `category`, not `section`.

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('nome')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('pivot.quantidade')
                    ->numeric()
                    ->required()
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('nome')
            ->columns([
                Tables\Columns\TextColumn::make('nome')->label('Nome')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('descricao')->label('Descrição')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('pivot.quantidade')->label('Quantidade')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('nome')
                    ->label('Nome')
                    ->options(Local::pluck('nome', 'nome'))
                    ->searchable(),
            ])
            ->headerActions([
                Tables\Actions\AttachAction::make()
                    ->preloadRecordSelect()
                    ->label('Adicionar')
                    ->form(fn (Tables\Actions\AttachAction $action): array => [
                        $action->getRecordSelect(),
                        Forms\Components\TextInput::make('quantidade')
                            ->numeric()
                            ->required(),
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->form(fn (Tables\Actions\EditAction $action): array => [
                        Forms\Components\TextInput::make('quantidade')
                            ->numeric()
                            ->required(),
                    ]),
                Tables\Actions\DetachAction::make()->label('Remover'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DetachBulkAction::make(),
                ]),
            ]);
    }
}
