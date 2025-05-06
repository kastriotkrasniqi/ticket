<?php
namespace App\Http\Controllers;

use App\Models\Event;
use App\Jobs\IssueOfferJob;
use App\Enums\WaitingStatus;
use Illuminate\Http\Request;
use App\Models\WaitingListEntry;
use App\Events\QueueStatusUpdated;
use Illuminate\Support\Facades\DB;
use App\Events\WaitingStatusUpdate;
use App\Jobs\ExpireWaitingListOffer;
use App\Services\WaitingListService;
use App\Jobs\IssueNextWaitingListOffer;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class WaitingListController extends Controller
{

    public function joinWaitingList($eventId)
    {
        // $key = 'waiting-list-limiter:' . $eventId . ':' . ($user?->id ?? request()->ip());
        // if (RateLimiter::tooManyAttempts($key, 3)) {
        //     $seconds = RateLimiter::availableIn($key);
        //     return response()->json([
        //         'message' => "Too many attempts. Try again in " . ceil($seconds / 60) . " min."
        //     ], 429);
        // }
        // RateLimiter::hit($key, 1800);

        $user = auth()->user();
        $event = Event::where('id', $eventId)->firstOrFail();

        try {
            $result = WaitingListService::join($event, $user);

            return response()->json([
                'success' => true,
                'status' => $result['status'],
                'message' => $result['message'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }


    public function releaseOffer($eventId, Request $request)
    {
        $entry = WaitingListEntry::where('event_id', $eventId)
            ->where('user_id', auth()->id())
            ->where('status', $request->status)
            ->first();

        if (!$entry) {
            return response()->json(['message' => 'No active offer to release'], 422);
        }

        $event = Event::findOrFail($eventId);

        if ($entry->status === WaitingStatus::OFFERED) {
            $entry->update(['status' => WaitingStatus::EXPIRED]);

            // If this release creates availability, immediately offer to next
            if ($event->availableSpots() > 0) {
                IssueNextWaitingListOffer::dispatch($eventId);
            }

        } else {
            $entry->delete();
        }

        return response()->json(['message' => 'Offer released']);
    }



}
