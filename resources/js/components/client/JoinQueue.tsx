import Spinner from '@/components/client/Spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Event, SharedData } from '@/types';
import { Link, usePage,router } from '@inertiajs/react';
import { CalendarIcon, Clock, OctagonXIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export function JoinQueue({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(true);

    const handleJoinQueue = async () => {
        setLoading(true);
        const response = axios.post(route('events.join-waiting-list', event.id));
        console.log(response);
        setLoading(false);
    };

    if (!event) {
        return <Spinner />;
    }

    return (
        <div>
            {event.is_owner && (
                <div className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-700">
                    <OctagonXIcon className="h-5 w-5" />
                    <span>You cannot buy a ticket for your own event</span>
                </div>
            )}

            {event.is_past_event && !event.is_owner && (
                <div className="mb-2 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-500">
                    <Clock className="h-5 w-5" />
                    <span>Event has ended</span>
                </div>
            )}

            {event.is_sold_out && !event.is_canceled && (
                <div className="p-4 text-center">
                    <p className="text-lg font-semibold text-red-600">Sorry, this event is sold out</p>
                </div>
            )}

            {!event.available && !event.is_past_event && !event.is_owner && (
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">{auth?.user ? 'Tickets are not available' : 'Please log in to buy tickets'}</p>
                    {!auth?.user && (
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
                    <Badge variant="secondary" className="text-muted-foreground w-full py-2 text-sm">
                        Event Canceled
                    </Badge>
                </div>
            )}

            {!event.is_canceled && !event.available && (
                <div className="py-2 text-center">
                    <Badge variant="secondary">Sold Out</Badge>
                </div>
            )}

            {event.available && !event.is_past_event && !event.is_owner && !event.is_canceled && auth?.user && (
                <div className="space-y-2 text-center">
                    <Button onClick={handleJoinQueue}
                         variant="default" className="w-full">
                        Buy Ticket
                    </Button>
                    <Button variant="outline" className="w-full">
                        <CalendarIcon /> Add to Calendar
                    </Button>
                </div>
            )}
        </div>
    );
}
