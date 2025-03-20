<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LocalResource\Pages;
use App\Filament\Resources\LocalResource\RelationManagers;
use App\Models\Local;
use App\Filament\Resources\LocalResource\RelationManagers\MateriaisRelationManager;
// use App\Models\Material;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
// use App\Models\Material;

class LocalResource extends Resource
{
    protected static ?string $model = Local::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $pluralModelLabel = 'Locais';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
            Forms\Components\TextInput::make('nome')
                ->required()
                ->maxLength(255),
            Forms\Components\Textarea::make('descricao')
                    ->label('Descrição')
                ->required()
                    ->maxLength(255),
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
                    ->searchable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('nome')
                    ->label('Nome')
                    ->options(function() {
                        $locais = Local::all()->pluck('nome')->toArray();
                        return array_combine($locais, $locais);
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
            MateriaisRelationManager::Class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLocals::route('/'),
            'create' => Pages\CreateLocal::route('/create'),
            'edit' => Pages\EditLocal::route('/{record}/edit'),
        ];
    }
}
