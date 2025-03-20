<?php

namespace App\Filament\Resources\StandResource\Pages;

use App\Filament\Resources\StandResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStands extends ListRecords
{
    protected static string $resource = StandResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
