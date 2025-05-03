import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/client/app-layout';
import { SharedData, type Event } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircleIcon, ArrowLeftIcon, CalendarIcon, MapPinIcon, TicketIcon, UserIcon } from 'lucide-react';
import { JoinQueue } from '@/components/client/JoinQueue';
import Spinner from '@/components/client/Spinner';

export default function Show({ event }: { event: Event }) {

    if (!event) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <Spinner />
          </div>
        );
      }



    return (

        <AppLayout>
            <Head title={event.name} />

            <div className="px-8 py-8">
                {/* Back Button */}
                <Button variant="ghost" className="mb-6 pl-0" onClick={() => window.history.back()}>
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to events
                </Button>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content - 2/3 width on desktop */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Event Status */}
                        {event.is_canceled && (
                            <div className="bg-destructive/10 border-destructive text-destructive flex items-center rounded-md border px-4 py-3">
                                <AlertCircleIcon className="mr-2 h-5 w-5" />
                                <p className="font-medium">This event has been canceled</p>
                            </div>
                        )}

                        {/* Event Image */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                            <img
                                src={event.image || '/placeholder.svg?height=400&width=800'}
                                alt={event.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Event Details Tabs */}
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="location">Location</TabsTrigger>
                                <TabsTrigger value="organizer">Organizer</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4 pt-4">
                                <h2 className="text-2xl font-bold">About This Event</h2>
                                <p className="whitespace-pre-line">{event.description}</p>
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

                    {/* Sidebar - 1/3 width on desktop */}
                    <div className="space-y-6">
                        {/* Event Summary Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <h1 className="mb-2 text-2xl font-bold">{event.name}</h1>

                                <div className="space-y-4">
                                    {/* Date and Time */}
                                    <div className="flex items-start">
                                        <CalendarIcon className="text-muted-foreground mt-0.5 mr-2 h-5 w-5" />
                                        <div>
                                            <p className="font-medium">Date and Time</p>
                                            <p className="text-muted-foreground">{event.humanDate}</p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start">
                                        <MapPinIcon className="text-muted-foreground mt-0.5 mr-2 h-5 w-5" />
                                        <div>
                                            <p className="font-medium">Location</p>
                                            <p className="text-muted-foreground">{event.location}</p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center">
                                        <div className="font-medium">Price:</div>
                                        <div className="ml-auto text-xl font-bold">${event.price.toFixed(2)}</div>
                                    </div>

                                    {/* Availability */}
                                    <div className="flex items-center">
                                        <TicketIcon className="text-muted-foreground mr-2 h-5 w-5" />
                                        {event.available && !event.is_past_event && !event.is_canceled ? (
                                            <p>{event.available_spots} tickets available</p>
                                        ) : (
                                            <p className="text-muted-foreground font-medium">Not available</p>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Ticket Purchase */}


                                    <JoinQueue event={event} />

                                </div>
                            </CardContent>
                        </Card>

                        {/* Share Card */}
                        <Card>
                            <CardContent>
                                <h3 className="mb-4 font-medium">Share this event</h3>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        Facebook
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        Twitter
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        Email
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
