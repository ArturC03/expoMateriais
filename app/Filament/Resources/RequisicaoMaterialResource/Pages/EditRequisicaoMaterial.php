<?php

namespace App\Filament\Resources\RequisicaoMaterialResource\Pages;

use App\Filament\Resources\RequisicaoMaterialResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRequisicaoMaterial extends EditRecord
{
    protected static string $resource = RequisicaoMaterialResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
