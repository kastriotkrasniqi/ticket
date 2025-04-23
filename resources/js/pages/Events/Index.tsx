import EventCard from '@/components/client/EventCard';
import { Event, PaginatedResponse } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function EventsIndex({ events }: { events: PaginatedResponse<Event> }) {
    useEffect(() => {
        console.log('EventsIndex', events);
    }, [events]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <Head>
                <title>Events</title>
                <meta name="description" content="Events lists" />
            </Head>
            <div className="grid grid-cols-4 gap-4">
                {events.data.map((event: Event) => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
        </div>
    );
}
