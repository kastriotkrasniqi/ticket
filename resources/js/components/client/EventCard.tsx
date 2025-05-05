import { type Event, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, Check, CircleArrowRight, LoaderCircle, MapPin, PencilIcon, StarIcon, Ticket, XCircle } from 'lucide-react';

export function EventCard({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const isPastEvent = event.is_past_event;
    const isEventOwner = event.is_owner;
    const queuePosition = event.queue_position;
    const imageUrl = event.image;

    const renderQueuePosition = () => {
        if (!queuePosition) return null;

        const isSoldOut = event.purchased_count >= event.total_tickets;
        const isEventCanceled = event.is_canceled;
        const isNextInLine = queuePosition.position === 2;

        if (isSoldOut) {
            return <QueueStatus status="sold-out" message="Event is sold out" />;
        }

        if (isEventCanceled) {
            return <QueueStatus status="canceled" message="Event is canceled" />;
        }

        if (isNextInLine) {
            return (
                <QueueStatus
                    status="next"
                    message={`You're next in line! (Queue position: ${queuePosition.position})`}
                    extra={
                        <div className="flex items-center">
                            <LoaderCircle className="mr-1 h-4 w-4 animate-spin text-amber-500" />
                            <span className="text-sm text-amber-600">Waiting for ticket</span>
                        </div>
                    }
                />
            );
        }

        return (
            <QueueStatus
                status="in-queue"
                message="Queue position"
                extra={<span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">#{queuePosition.position}</span>}
            />
        );
    };

    const QueueStatus = ({ status, message, extra }: { status: 'sold-out' | 'canceled' | 'next' | 'in-queue', message: string, extra?: any }) => {
        const statusStyles = {
            'sold-out': 'bg-gray-50 text-gray-600',
            'canceled': 'bg-gray-50 text-gray-600',
            'next': 'bg-amber-50 text-amber-700',
            'in-queue': 'bg-blue-50 text-blue-700',
        };

        return (
            <div className={`flex items-center justify-between rounded-lg border border-${statusStyles[status]} p-3`}>
                <div className="flex items-center">
                    <Ticket className="mr-2 h-5 w-5" />
                    <span className="font-medium">{message}</span>
                </div>
                {extra}
            </div>
        );
    };

    const renderTicketStatus = () => {
        if (!auth.user) return null;

        if (isEventOwner) {
            return (
                <div className="mt-4">
                    <Link
                        href={route('events.show', event.id)}
                        as="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-200"
                    >
                        <PencilIcon className="h-5 w-5" />
                        Edit Event
                    </Link>
                </div>
            );
        }

        if (event.user_ticket) {
            return (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-green-100 bg-green-50 p-3">
                    <div className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-700">You have a ticket!</span>
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-green-700"
                    >
                        View your ticket
                    </a>
                </div>
            );
        }

        if (queuePosition) {
            return (
                <div className="mt-4 space-y-2">
                    {renderQueuePosition()}
                    {queuePosition.status === 'expired' && (
                        <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                            <span className="flex items-center font-medium text-red-700">
                                <XCircle className="mr-2 h-5 w-5" />
                                Offer expired
                            </span>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <Link href={route('events.show', event.id)} className="block" as="button">
            <div
                className={`group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
                    isPastEvent ? 'opacity-75 hover:opacity-100' : ''
                }`}
            >
                {/* Event Image */}
                {imageUrl && (
                    <div className="relative h-48 w-full">
                        <img src={imageUrl} alt={event.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-3 left-3">
                            {isEventOwner && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white shadow">
                                    <StarIcon className="h-3 w-3" />
                                    Your Event
                                </span>
                            )}
                        </div>
                        <div className="absolute top-3 right-3 space-y-1 text-right">
                            {event.is_canceled ? (
                                <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 shadow">
                                    Canceled
                                </span>
                            ) : event.is_past_event ? (
                                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                                    Past Event
                                </span>
                            ) : (
                                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 shadow">
                                    £{event.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Event Info */}
                <div className="space-y-4 p-5 text-left">
                    <h2 className="line-clamp-2 text-xl font-semibold text-gray-900">{event.name}</h2>

                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-gray-500" />
                            <span>
                                {event.humanDate} {isPastEvent && <span className="ml-1 text-xs text-gray-500">(Ended)</span>}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-gray-500" />

                            <span>
                                {!event.is_canceled && !event.is_past_event ? (
                                    `${event.total_tickets - event.purchased_count} / ${event.total_tickets} available`
                                ) : (
                                    <span>Not available</span>
                                )}
                                {!event.is_past_event && event.active_offers > 0 && (
                                    <span className="ml-2 text-xs text-amber-600">({event.active_offers} trying to buy)</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <p className="line-clamp-3 text-sm text-gray-700">{event.description}</p>

                    <div onClick={(e) => e.stopPropagation()}>{!isPastEvent && renderTicketStatus()}</div>
                </div>
            </div>
        </Link>
    );
}
