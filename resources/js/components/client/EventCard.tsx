import { type Event, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, CircleArrowRight, Edit, LoaderCircle, MapPin, Ticket } from 'lucide-react';

export function EventCard({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const isPastEvent = event.is_past_event;
    const isEventOwner = event.is_owner;
    const queuePosition = event.queue_position;
    const imageUrl = event.image;
    console.log(event);

    const renderQueuePosition = () => {
        if (!queuePosition) return null;

        const isSoldOut = event.purchased_count >= event.total_tickets;
        const expiresAt = event.queue_position?.expires_at ? event.queue_position.expires_at * 1000 : null;
        const isOfferExpired: boolean | undefined = expiresAt !== null && expiresAt !== 0 ? Date.now() > expiresAt : undefined;


        if (isSoldOut) {
            return (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <Ticket className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">Event is sold out</span>
                    </div>
                </div>
            );
        }

        if(isOfferExpired) {
            return (
                 <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 ">
                    <p className="flex items-center gap-2 text-amber-700">
                        <span className="text-xl">🎟️</span>
                        <span className="font-medium">Ticket offer: Expired </span>
                    </p>
                </div>
            );
        }



        if (queuePosition.position === 2) {
            return (
                <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center">
                        <CircleArrowRight className="w-5 h-5 text-amber-500 mr-2" />
                        <span className="text-amber-700 font-medium">
                            You're next in line! (Queue position: {queuePosition.position})
                        </span>
                    </div>
                    <div className="flex items-center">
                        <LoaderCircle className="w-4 h-4 mr-1 animate-spin text-amber-500" />
                        <span className="text-amber-600 text-sm">Waiting for ticket</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center">
                    <LoaderCircle className="w-4 h-4 mr-2 animate-spin text-blue-500" />
                    <span className="text-blue-700">Queue position</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    #{queuePosition.position}
                </span>
            </div>
        );
    };

    return (
        <Link href={route('events.show', event.id)} className="group block" as="button">
            <div
                className={`relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${
                    isPastEvent ? 'opacity-75 hover:opacity-100' : ''
                }`}
            >
                {/* Event Image */}
                <div className="relative h-48 w-full  transition-transform duration-300 ease-in-out hover:scale-99">
                    <img src={imageUrl} alt={`${event.name} event cover`} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4">
                        <h2 className="line-clamp-2 text-xl font-semibold text-white">{event.name}</h2>
                    </div>
                    {/* Status Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {event.is_canceled ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 shadow ring-1 ring-red-200">
                                Canceled
                            </span>
                        ) : event.is_past_event ? (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 shadow ring-1 ring-gray-200">
                                Past Event
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 shadow ring-1 ring-green-200">
                                £{event.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span>
                                {event.humanDate} {isPastEvent && <span className="ml-1 text-xs text-gray-500">(Ended)</span>}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="flex items-center gap-2">
                                {!event.is_canceled && !event.is_past_event ? (
                                    <>
                                        <span className="truncate">
                                            {event.total_tickets - event.purchased_count} / {event.total_tickets} available
                                        </span>
                                        {event.active_offers > 0 && (
                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 ring-1 ring-amber-200">
                                                {event.active_offers} trying to buy
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span>Not available</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-left text-sm text-gray-700">
                        {!event.queue_position && !event.is_owner && event.description}
                    </p>

                    {event.is_owner && (
                        <Link
                            href={`/events/${event.id}/edit`}
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                            <div className="flex items-center">
                                <Edit className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="font-medium text-gray-700">Edit your event</span>
                            </div>
                        </Link>
                    )}

                    {/* Ticket Status */}
                    <div onClick={(e) => e.stopPropagation()}>{!isPastEvent && renderQueuePosition()}</div>
                </div>
            </div>
        </Link>
    );
}
