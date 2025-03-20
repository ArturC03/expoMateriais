<?php

namespace App\Filament\Resources\RequisicaoMaterialResource\Pages;

use App\Filament\Resources\RequisicaoMaterialResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListRequisicaoMaterials extends ListRecords
{
    protected static string $resource = RequisicaoMaterialResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
