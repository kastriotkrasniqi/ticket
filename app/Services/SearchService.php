<?php

namespace App\Services;

use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Support\Facades\Config;

class SearchService
{
    public function search(string $query): \Illuminate\Http\JsonResponse
    {
        if (empty($query)) {
            return response()->json([]);
        }

        try {
            $events = $this->useTypesense()
                ? $this->typesenseSearch($query)
                : $this->defaultSearch($query);

            return response()->json(EventResource::collection($events));
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Error occurred while searching.'], 500);
        }
    }

    protected function useTypesense(): bool
    {
        return Config::get('services.typesense.enabled', false);
    }

    protected function typesenseSearch(string $query)
    {
        return Event::search($query)->options([
            'query_by' => 'name, description', 'location',
        ])->get();
    }

    protected function defaultSearch(string $query)
    {
        return Event::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->orWhere('location', 'like', "%{$query}%")
            ->get();
    }
}
