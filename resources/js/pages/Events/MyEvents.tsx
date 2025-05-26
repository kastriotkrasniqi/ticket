import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronRightIcon, EditIcon, EyeIcon, PlusIcon, RotateCcw, SearchIcon, SlidersHorizontalIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/client/app-layout';
import { Event } from '@/types';
import { router } from '@inertiajs/react';

interface MyEventsProps {
    events: {
        data: Event[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
            per_page: number;
        };
    };
}

export default function MyEvents({ events }: MyEventsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToCancel, setEventToCancel] = useState<Event | null>(null);

    const total_revenue = events.data.reduce((acc, event) => acc + event.price * event.purchased_count, 0);

    // Filter events based on search query
    const filteredEvents = events.data.filter((event) => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        const eventName = event.name?.toLowerCase() || '';
        const eventLocation = event.location?.toLowerCase() || '';
        const eventDescription = event.description?.toLowerCase() || '';

        return eventName.includes(query) || eventLocation.includes(query) || eventDescription.includes(query);
    });

    // Filter events based on selected tab
    const getFilteredEvents = () => {
        if (selectedTab === 'all') return filteredEvents;

        if (selectedTab === 'upcoming') {
            const now = new Date();
            return filteredEvents.filter((event) => new Date(event.date).getTime() > now.getTime());
        } else if (selectedTab === 'ongoing') {
            const now = new Date();
            return filteredEvents.filter((event) => new Date(event.date).getTime() < now.getTime());
        } else if (selectedTab === 'past') {
            const now = new Date();
            return filteredEvents.filter((event) => new Date(event.date).getTime() < now.getTime());
        }

        return filteredEvents.filter((event) => event.status === selectedTab);
    };

    // Sort events
    const sortedEvents = [...getFilteredEvents()].sort((a, b) => {
        if (sortBy === 'date-asc') {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'date-desc') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortBy === 'name-asc') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'name-desc') {
            return b.name.localeCompare(a.name);
        } else if (sortBy === 'sales-asc') {
            return a.purchased_count - b.purchased_count;
        } else if (sortBy === 'sales-desc') {
            return b.purchased_count - a.purchased_count;
        }
        return 0;
    });

    // Format date for display
    const formatEventDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'EEE, MMM d, yyyy • h:mm a');
        } catch (error) {
            return 'Date unavailable';
        }
    };

    // Calculate sales percentage
    const calculateSalesPercentage = (sold: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((sold / total) * 100);
    };

    // Handle event deletion
    const confirmDelete = (event: Event) => {
        setEventToCancel(event);
        setDeleteDialogOpen(true);
    };

    const handleCancelEvent = () => {
        if (eventToCancel) {
            router.post(
                '/events/' + eventToCancel.id + '/cancel-event',
                {},
                {
                    onSuccess: () => {
                        setDeleteDialogOpen(false);
                        setEventToCancel(null);
                    },
                },
            );
        }
    };

    return (
        <AppLayout>
            <Head title="My Events" />

            <div className="px-10 py-6 md:py-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">My Events</h1>
                        <p className="text-muted-foreground mt-2">Manage all your created events</p>
                    </div>
                    <Button asChild>
                        <Link href="/events/create">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Create New Event
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Total Events</p>
                                <p className="text-2xl font-bold">{events.data.length}</p>
                            </div>
                            <div className="bg-primary/10 text-primary rounded-full p-2">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Active Events</p>
                                <p className="text-2xl font-bold">{events.data.filter((event) => event.is_canceled === false).length}</p>
                            </div>
                            <div className="rounded-full bg-green-500/10 p-2 text-green-500">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Tickets Sold</p>
                                <p className="text-2xl font-bold">{events.data.reduce((total, event) => total + event.purchased_count, 0)}</p>
                            </div>
                            <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
                                <UsersIcon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold">${total_revenue}</p>
                            </div>
                            <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                    <path d="M12 18V6" />
                                </svg>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Search events..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Sort by:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-desc">Date (Latest first)</SelectItem>
                                <SelectItem value="date-asc">Date (Earliest first)</SelectItem>
                                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                <SelectItem value="sales-desc">Sales (Highest first)</SelectItem>
                                <SelectItem value="sales-asc">Sales (Lowest first)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="mb-6 grid w-full grid-cols-5 sm:w-auto">
                        <TabsTrigger value="all" className="text-xs sm:text-sm">
                            All
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                            Upcoming
                        </TabsTrigger>
                        <TabsTrigger value="ongoing" className="text-xs sm:text-sm">
                            Ongoing
                        </TabsTrigger>
                        <TabsTrigger value="past" className="text-xs sm:text-sm">
                            Past
                        </TabsTrigger>
                        <TabsTrigger value="draft" className="text-xs sm:text-sm">
                            Drafts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                        <EventsList events={sortedEvents} onDelete={confirmDelete} />
                    </TabsContent>

                    <TabsContent value="upcoming" className="mt-0">
                        <EventsList events={sortedEvents} onDelete={confirmDelete} />
                    </TabsContent>

                    <TabsContent value="ongoing" className="mt-0">
                        <EventsList events={sortedEvents} onDelete={confirmDelete} />
                    </TabsContent>

                    <TabsContent value="past" className="mt-0">
                        <EventsList events={sortedEvents} onDelete={confirmDelete} />
                    </TabsContent>

                    <TabsContent value="draft" className="mt-0">
                        <EventsList events={sortedEvents} onDelete={confirmDelete} />
                    </TabsContent>
                </Tabs>

                {/* Pagination */}
                {events.meta.last_page > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={`/my-events?page=${Math.max(1, events.meta.current_page - 1)}`} />
                            </PaginationItem>

                            {Array.from({ length: events.meta.last_page }).map((_, index) => {
                                const page = index + 1;

                                // Show first page, last page, and pages around current page
                                if (
                                    page === 1 ||
                                    page === events.meta.last_page ||
                                    (page >= events.meta.current_page - 1 && page <= events.meta.current_page + 1)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink href={`/my-events?page=${page}`} isActive={page === events.meta.current_page}>
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }

                                // Show ellipsis for gaps
                                if (page === 2 || page === events.meta.last_page - 1) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext href={`/my-events?page=${Math.min(events.meta.last_page, events.meta.current_page + 1)}`} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cancel Event</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to cancel this event? This action cannot be undone and will refund all associated tickets.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {eventToCancel && (
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                        <img
                                            src={eventToCancel.image || '/placeholder.svg'}
                                            alt={eventToCancel.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{eventToCancel.name}</h4>
                                        <p className="text-muted-foreground text-sm">{formatEventDate(eventToCancel.date)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleCancelEvent}>
                                Cancel Event
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

// Events list component
function EventsList({ events, onDelete }: { events: Event[]; onDelete: (event: Event) => void }) {
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <CalendarIcon className="text-muted-foreground/50 h-12 w-12" />
                <h3 className="mt-4 text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground mt-1 text-sm">You don't have any events in this category</p>
                <Button asChild className="mt-4">
                    <Link href={route('events.create')}>Create New Event</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <EventCard key={event.id} event={event} onDelete={onDelete} />
            ))}
        </div>
    );
}

// Event card component
function EventCard({ event, onDelete }: { event: Event; onDelete: (event: Event) => void }) {
    // Get status badge based on event status
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return <StatusBadge status="active" />;
            case 'ongoing':
                return <StatusBadge status="pending" />;
            case 'past':
                return <StatusBadge status="inactive" />;
            case 'canceled':
                return <StatusBadge status="error" />;
            case 'draft':
                return <StatusBadge status="warning" />;
            default:
                return <StatusBadge status="pending" />;
        }
    };

    // Calculate sales percentage
    const salesPercentage = Math.round((event.purchased_count / event.total_tickets) * 100) || 0;

    // Format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'EEE, MMM d, yyyy • h:mm a');
        } catch (error) {
            return 'Date unavailable';
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
                    {/* Event Image */}
                    <div className="relative aspect-video md:aspect-auto md:h-full">
                        <img
                            src={event.image || '/placeholder.svg?height=200&width=400'}
                            alt={event.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {event.is_canceled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <Badge variant="destructive" className="px-3 py-1.5 text-lg">
                                    Canceled
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Event Details */}
                    <div className="flex flex-col p-4 md:p-6">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Link href={route('events.show', event.slug)} className="text-lg font-bold hover:underline md:text-xl">
                                        {event.name}
                                    </Link>
                                    <div>{getStatusBadge(event.status)}</div>
                                </div>
                                <div className="text-muted-foreground mt-1 flex items-center text-sm">
                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="text-muted-foreground mt-1 flex items-center text-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1 h-4 w-4"
                                    >
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <SlidersHorizontalIcon className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={route('events.show', event.slug)} className="flex w-full cursor-pointer items-center">
                                            <EyeIcon className="mr-2 h-4 w-4" />
                                            View Event
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('events.edit', event.slug)} className="flex w-full cursor-pointer items-center">
                                            <EditIcon className="mr-2 h-4 w-4" />
                                            Edit Event
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(event)}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Cancel Event
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mt-2">
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Ticket Sales</span>
                                <span className="font-medium">
                                    {event.purchased_count} / {event.total_tickets}
                                </span>
                            </div>
                            <Progress value={salesPercentage} className="h-2" />
                            <div className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
                                <span>{salesPercentage}% sold</span>
                                <span>{event.available_spots} tickets remaining</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">Revenue</div>
                                <div className="text-lg font-bold">${(event.purchased_count * event.price).toLocaleString()}</div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('events.show', event.slug)}>
                                        View Details
                                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href={route('events.edit', event.slug)}>
                                        <EditIcon className="mr-1 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
