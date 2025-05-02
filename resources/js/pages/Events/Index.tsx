import { EventCard } from '@/components/client/EventCard';
import Spinner from '@/components/client/Spinner';
import AppLayout from '@/layouts/client/app-layout';
import { Head, WhenVisible } from '@inertiajs/react';
import { type Event } from "@/types"

export default function EventsIndex({
    events,
    current,
    last,
    title = 'Upcoming Events',
}: {
    events: Event[];
    current: number;
    last:number,
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
                        {events.length !== 0 && <h2 className="mb-6 text-3xl font-bold tracking-tight">{title}</h2>}

                        {events.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No events found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                {current < last ? (
                    <WhenVisible
                        always
                        params={{
                            data: {
                                page: current + 1,
                            },
                            only: ['events', 'current'],
                            preserveUrl: true,
                        }}
                        fallback={<Spinner />} // Shown while loading new events
                    >
                        <Spinner />
                    </WhenVisible>
                ) : (
                    <div className="pt-12 text-center">
                        <p className="text-muted-foreground">No more events</p>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
