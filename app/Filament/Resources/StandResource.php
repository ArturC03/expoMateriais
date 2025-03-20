<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StandResource\Pages;
use App\Models\Curso;
use App\Models\Local;
use App\Models\Stand;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class StandResource extends Resource
{
    protected static ?string $model = Stand::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('curso_id')
                    ->relationship(name: 'curso', titleAttribute: 'nome')
                    ->required()
                    ->label('Curso'),
                Forms\Components\Select::make('local_id')
                    ->relationship(name: 'local', titleAttribute: 'nome')
                    ->required()
                    ->label('Local'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('curso.nome')
                    ->sortable()
                    ->searchable()
                    ->label('Curso'),
                Tables\Columns\TextColumn::make('local.nome')
                    ->sortable()
                    ->searchable()
                    ->label('Local'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Criado em'),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Atualizado em'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStands::route('/'),
            'create' => Pages\CreateStand::route('/create'),
            'edit' => Pages\EditStand::route('/{record}/edit'),
        ];
    }
}
