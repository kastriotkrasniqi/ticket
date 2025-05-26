<?php

namespace App\Services;

use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;

class SearchService
{
    public function search(string $keyword): JsonResponse
    {
        if (empty($keyword)) {
            return response()->json([
                'result' => [
                    'hits' => [],
                    'estimatedTotalHits' => 0,
                    'processingTimeMs' => 0,
                    'query' => $keyword,
                    'limit' => 0,
                    'offset' => 0
                ]
            ]);
        }

        try {
            if (!$this->useScout()) {
                return response()->json([
                    'result' => [
                        'hits' => EventResource::collection($this->defaultSearch($keyword)),
                        'estimatedTotalHits' => $this->defaultSearch($keyword)->count(),
                        'processingTimeMs' => 0,
                        'query' => $keyword,
                        'limit' => 0,
                        'offset' => 0
                    ]
                ]);
            }

            $results = $this->scoutSearch($keyword);

            return response()->json([
                'result' => $results
            ]);
        } catch (\Throwable $th) {
            report($th);
            return response()->json(['error' => 'Error occurred while searching.'], 500);
        }
    }

    protected function useScout(): bool
    {
        return Config::get('services.scout.enabled', false);
    }

    protected function scoutSearch(string $keyword): array
    {
        return Event::search($keyword, function ($meiliSearch, string $query, array $options) {
            $options['attributesToHighlight'] = ['name', 'description'];
            $options['highlightPreTag'] = "<em class=\"highlighted\">";
            $options['highlightPostTag'] = "</em>";
            return $meiliSearch->search($query, $options);
        })->raw();
    }

    protected function defaultSearch(string $keyword): Collection
    {
        return Event::where('name', 'like', "%{$keyword}%")
            ->orWhere('slug', 'like', "%{$keyword}%")
            ->orWhere('description', 'like', "%{$keyword}%")
            ->orWhere('location', 'like', "%{$keyword}%")
            ->get();
    }

}
