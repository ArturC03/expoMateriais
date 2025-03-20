<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CursoResource\Pages;
use App\Filament\Resources\CursoResource\RelationManagers;
use App\Models\Curso;
use App\Models\User;
use App\Models\Projeto;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CursoResource extends Resource
{
    protected static ?string $model = Curso::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';

    protected static ?string $navigationLabel = 'Cursos';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('nome')
                    ->required()
                    ->maxLength(255)
                    ->label('Nome do Curso'),
                Forms\Components\TextInput::make('sigla')
                    ->required()
                    ->maxLength(255)
                    ->label('Sigla'),
                Forms\Components\Select::make('diretor_curso_id')
                    ->relationship('diretorCurso', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Diretor do Curso')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nome')
                    ->searchable()
                    ->sortable()
                    ->label('Nome'),
                Tables\Columns\TextColumn::make('sigla')
                    ->searchable()
                    ->sortable()
                    ->label('Sigla'),
                Tables\Columns\TextColumn::make('diretorCurso.name')
                    ->searchable()
                    ->sortable()
                    ->label('Diretor do Curso'),
                Tables\Columns\TextColumn::make('projetos_count')
                    ->counts('projetos')
                    ->sortable()
                    ->label('Número de Projetos'),
                // Tables\Columns\TextColumn::make('created_at')
                //     ->dateTime()
                //     ->sortable()
                //     ->toggleable(isToggledHiddenByDefault: true)
                //     ->label('Data de Criação'),
                // Tables\Columns\TextColumn::make('updated_at')
                //     ->dateTime()
                //     ->sortable()
                //     ->toggleable(isToggledHiddenByDefault: true)
                //     ->label('Data de Atualização'),
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
            RelationManagers\ProjetosRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCursos::route('/'),
            'create' => Pages\CreateCurso::route('/create'),
            'edit' => Pages\EditCurso::route('/{record}/edit'),
        ];
    }
}
