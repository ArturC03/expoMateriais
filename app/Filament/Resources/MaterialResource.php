<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MaterialResource\RelationManagers\LocaisRelationManager;
use App\Filament\Resources\MaterialResource\Pages;
use App\Filament\Resources\MaterialResource\RelationManagers;
use App\Models\Material;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Models\Categoria;

class MaterialResource extends Resource
{
    protected static ?string $model = Material::class;
    protected static ?string $pluralModelLabel = 'Materiais';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('nome')
                    ->required()
                    ->maxLength(255),
                    \Filament\Forms\Components\Textarea::make('descricao')
                    ->label('Descrição')
                    ->required()
                    ->maxLength(255),
                    Forms\Components\Select::make('categoria')
                    ->label('Categoria')
                    ->options(function() {
                    $materiais = Material::all()->pluck('nome')->toArray();
                    return array_combine($materiais, $materiais);
                    })
                    ->required(),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nome')
                ->label('Nome')
                ->sortable()
                ->searchable(),

                Tables\Columns\TextColumn::make('descricao')
                ->label('Descrição')
                ->sortable()
                ->searchable(),
            ])
            ->filters([
            Tables\Filters\SelectFilter::make('nome')
                ->label('Nome')
                ->options(function() {
                    $materiais = Material::all()->pluck('nome')->toArray();
                    return array_combine($materiais, $materiais);
                })
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
            LocaisRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMaterials::route('/'),
            'create' => Pages\CreateMaterial::route('/create'),
            'edit' => Pages\EditMaterial::route('/{record}/edit'),
        ];
    }
}
