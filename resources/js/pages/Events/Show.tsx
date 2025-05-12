import { JoinQueue } from '@/components/client/JoinQueue';
import Spinner from '@/components/client/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/client/app-layout';
import { type Event } from '@/types';
import { Head,router } from '@inertiajs/react';
import { AlertCircleIcon, ArrowLeftIcon, CalendarIcon, MapPinIcon, TicketIcon, UserIcon } from 'lucide-react';

export default function Show({ event }: { event: Event }) {
    if (!event) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }


    return (
        <AppLayout>
            <Head title={event.name} />

            <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-6 -ml-2 text-gray-600 hover:text-gray-900"
                    onClick={() => router.get(route('events.index'))}
                >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to events
                </Button>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Event Status Banner */}
                        {event.is_canceled && (
                            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
                                <p className="font-medium">This event has been canceled</p>
                            </div>
                        )}

                        {/* Event Image */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-gray-100">
                            <img
                                src={event.image || '/placeholder.svg?height=400&width=800'}
                                alt={event.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        {/* Event Details Tabs */}
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">About</TabsTrigger>
                                <TabsTrigger value="location">Location</TabsTrigger>
                                <TabsTrigger value="organizer">Organizer</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4 pt-6">
                                <h2 className="text-2xl font-bold">About This Event</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="whitespace-pre-line">{event.description}</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="location" className="space-y-4 pt-4">
                                <h2 className="text-2xl font-bold">Event Location</h2>
                                <div className="space-y-2">
                                    <p className="font-medium">{event.location}</p>
                                    <div className="aspect-video w-full overflow-hidden rounded-md border">
                                        {/* Placeholder for map - in a real app, you'd integrate Google Maps or similar */}
                                        <div className="bg-muted flex h-full w-full items-center justify-center">
                                            <p className="text-muted-foreground">Map view would be displayed here</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="organizer" className="space-y-4 pt-4">
                                <h2 className="text-2xl font-bold">Event Organizer</h2>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                                        <UserIcon className="text-muted-foreground h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Organizer Name</p>
                                        <p className="text-muted-foreground text-sm">Contact: organizer@example.com</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="sticky top-6">
                            {/* Event Summary Card */}
                            <Card>
                                <CardContent className="pt-6">
                                    <h1 className="mb-4 text-2xl font-bold">{event.name}</h1>

                                    <div className="space-y-6">
                                        {/* Info Items */}
                                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <CalendarIcon className="mt-1 h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Date and Time</p>
                                                    <p className="text-gray-600">{event.humanDate}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <MapPinIcon className="mt-1 h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Location</p>
                                                    <p className="text-gray-600">{event.location}</p>
                                                </div>
                                            </div>

                                            {!event.is_past_event && (
                                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                    <p className="font-medium text-gray-900">Price per ticket</p>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {event.is_canceled ? (
                                                            <span className="text-sm text-red-600">Canceled</span>
                                                        ) : (
                                                            `$${event.price.toFixed(2)}`
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Availability */}
                                        {!event.is_past_event && !event.is_canceled && (
                                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                                <div className="flex items-center gap-2">
                                                    <TicketIcon className="h-5 w-5 text-gray-500" />
                                                    <span className="font-medium text-gray-900">
                                                        {event.total_tickets - event.purchased_count} tickets left
                                                    </span>
                                                </div>
                                                {event.active_offers > 0 && (
                                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600 ring-1 ring-amber-200">
                                                        {event.active_offers} in queue
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <Separator />

                                        {/* Ticket Purchase */}
                                        <JoinQueue event={event} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Share Card */}
                            {!event.is_canceled && !event.is_past_event && (
                                <Card className="mt-6">
                                    <CardContent className="pt-6">
                                        <h3 className="mb-4 font-medium">Share this event</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <Button variant="outline" size="sm" className="w-full">
                                                Facebook
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-full">
                                                Twitter
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-full">
                                                Email
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
