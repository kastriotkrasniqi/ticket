import Spinner from '@/components/client/Spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Event, type EventQueuePosition, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarIcon, Clock, OctagonXIcon } from 'lucide-react';

export function JoinQueue({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const isSoldOut = event.available_spots >= event.total_tickets;
    const isPastEvent = event.is_past_event;
    const queuePosition: EventQueuePosition | undefined = event.queue_position;

    console.log('queuePosition', queuePosition);
    console.log('event', event);

    // Early return for loading state or missing event/queuePosition
    if (!event) {
        return <Spinner />;
    }

    const isEventOwner = event.is_event_owner;
    const isLoggedIn = auth?.user;

    // Render messages based on the event status
    if (isSoldOut || isPastEvent || isEventOwner) {
        return (
            <div>
                {isEventOwner && (
                    <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-700">
                        <OctagonXIcon className="h-5 w-5" />
                        <span>You cannot buy a ticket for your own event</span>
                    </div>
                )}

                {isPastEvent && !isEventOwner && (
                    <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-500">
                        <Clock className="h-5 w-5" />
                        <span>Event has ended</span>
                    </div>
                )}

                {isSoldOut && !event.is_canceled && (
                    <div className="p-4 text-center">
                        <p className="text-lg font-semibold text-red-600">Sorry, this event is sold out</p>
                    </div>
                )}

                {!event.available && !isPastEvent && !isEventOwner && (
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">{isLoggedIn ? 'Tickets are not available' : 'Please log in to buy tickets'}</p>
                        {!isLoggedIn && (
                            <Button variant="outline" className="mt-4 w-full">
                                <Link method="get" href={route('login')} as="button">
                                    Login
                                </Link>
                            </Button>
                        )}
                    </div>
                )}

                {event.is_canceled && (
                    <div className="py-2 text-center">
                        <Badge variant="destructive">Event Canceled</Badge>
                    </div>
                )}

                {!event.is_canceled && !event.available && (
                    <div className="py-2 text-center">
                        <Badge variant="secondary">Sold Out</Badge>
                    </div>
                )}
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="text-center">
                <p className="text-muted-foreground text-sm">Please log in to buy tickets</p>
                <Button variant="outline" className="mt-4 w-full">
                    <Link method="get" href={route('login')} as="button">
                        Login
                    </Link>
                </Button>
            </div>
        );
    }

    // Render Buy Ticket and Add to Calendar buttons if the user is logged in
    return (
        <div className="space-y-4">
            <Button onClick={() => {}} disabled={isPastEvent || isEventOwner} variant="default" className="w-full">
                Buy Ticket
            </Button>
            <Button variant="outline" className="w-full">
                <CalendarIcon /> Add to Calendar
            </Button>
        </div>
    );
}
