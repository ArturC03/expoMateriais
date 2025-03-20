<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RequisicaoMaterialResource\Pages;
use App\Filament\Resources\RequisicaoMaterialResource\RelationManagers;
use App\Models\RequisicaoMaterial;
use App\Models\Projeto;
use App\Models\Material;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RequisicaoMaterialResource extends Resource
{
    protected static ?string $model = RequisicaoMaterial::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationLabel = 'Requisições de Materiais';

    protected static ?string $modelLabel = 'Requisição de Material';

    protected static ?string $pluralModelLabel = 'Requisições de Materiais';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('projeto_id')
                ->relationship(name: 'projeto', titleAttribute: 'titulo')
                ->label('Projeto')
                    ->required(),

                Forms\Components\Select::make('material_id')
                    ->label('Material')
                    ->relationship('material', 'nome')
                    ->required(),

                Forms\Components\TextInput::make('quantidade')
                    ->required()
                    ->numeric()
                    ->minValue(1),

                Forms\Components\Textarea::make('finalidade')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('projeto.titulo')
                    ->label('Projeto')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('projeto.curso.sigla')
                    ->label('Curso')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('material.nome')
                    ->label('Material')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('quantidade')
                    ->sortable(),

                Tables\Columns\TextColumn::make('finalidade')
                    ->limit(50),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Data de Criação')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
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
            'index' => Pages\ListRequisicaoMaterials::route('/'),
            'create' => Pages\CreateRequisicaoMaterial::route('/create'),
            'edit' => Pages\EditRequisicaoMaterial::route('/{record}/edit'),
        ];
    }
}
