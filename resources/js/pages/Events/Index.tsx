import EventCard from '@/components/client/EventCard';
import { Event, PaginatedResponse } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { router,WhenVisible } from '@inertiajs/react';
import Spinner from '@/components/client/Spinner';

export default function EventsIndex({ events,perPage }: { events: PaginatedResponse<Event>  ,perPage: number }) {
    useEffect(() => {
      console.log(events);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
            <Head>
                <title>Events</title>
                <meta name="description" content="Events lists" />
            </Head>
            <div className="grid grid-cols-4 gap-4">
                {events.data.map((event: Event) => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
            <div className="my-6"></div>
            {events.meta.total > perPage ? (
                <WhenVisible
                    always={true}
                    params={{
                        data: {
                            perPage: events.meta.per_page + 5
                        },
                        only: ['events', 'perPage'],
                    }}
                    fallback={<p>You reached the end.</p>}
                >
                    <Spinner />
                </WhenVisible>
            ) : (
                <p className="text-center text-gray-500">No more events to load.</p>
            )}
        </div>
    );
}
