import { EventCard, type Event } from '@/components/client/EventCard';
import Spinner from '@/components/client/Spinner';
import AppLayout from '@/layouts/client/app-layout';
import type { PaginatedResponse } from '@/types';
import { Head, WhenVisible } from '@inertiajs/react';

export default function EventsIndex({
    events,
    perPage,
    title = 'Upcoming Events',
}: {
    events: PaginatedResponse<Event>;
    perPage: number;
    title?: string;
}) {
    return (
        <AppLayout>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Events lists" />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center p-8">
                <section className="py-8">
                    <div className="container">
                        <h2 className="mb-6 text-3xl font-bold tracking-tight">{title}</h2>

                        {events.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No events found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {events.data.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                {events.meta.total > perPage ? (
                    <WhenVisible
                        always={true}
                        params={{
                            data: {
                                perPage: events.meta.per_page + 5,
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
        </AppLayout>
    );
}
