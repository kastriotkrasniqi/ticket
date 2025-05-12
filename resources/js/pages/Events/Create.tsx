import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/client/app-layout';
import { cn } from '@/lib/utils';
import { Head, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ImageIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useState, type FormEvent , useRef } from 'react';
import { LocationInput } from '@/components/ui/location-input';
import { Event } from '@/types';
import { Progress  } from '@/components/ui/progress';


export default function EventForm({ event, stripeReady }: { event?: Event; stripeReady?: any }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);



    const { data, setData, post, put, processing, errors, reset, progress } = useForm({
        name: event?.name || '',
        description: event?.description || '',
        location: event?.location || '',
        lat: event?.lat || '',
        lng: event?.lng || '',
        date: event?.isoDate || '',
        price: event?.price || '',
        total_tickets: event?.total_tickets || '',
        image: event?.image || null,
        _method: event ? 'PUT' : 'POST',
    });



    useEffect(() => {
        if (event?.date) {
            const parsed = new Date(event.date);
            setSelectedDate(parsed);
        }

        if (event?.image) {
            setImagePreview(event.image);
        } else {
            setImagePreview(event?.image ?? null);
        }
    }, [event]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setData('date', formattedDate);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // const method = event ? put : post;
        const url = event ? route('events.update', event.id) : route('events.store');

        router.post(url,data, {
            onSuccess: () => {
                if (!event) {
                    reset();
                    setImagePreview(null);
                    setSelectedDate(undefined);
                }
            },
        });
    };

    if (!stripeReady) {
        return (
            <AppLayout>
                <Head title="Complete Stripe Setup" />
                <div className="mx-auto max-w-2xl px-8 py-24 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Finish Setting Up Payments</h1>
                    <p className="text-muted-foreground mb-6">
                        You need to complete your Stripe Connect setup before creating an event. This ensures you can receive payments from ticket
                        sales.
                    </p>
                    <a href={route('settings.stripe')} className="inline-block">
                        <Button className='cursor-pointer'>Connect with Stripe</Button>
                    </a>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={event ? event?.name : 'Create Event'} />

            <div className="mx-auto max-w-6xl px-8 py-6 md:py-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold md:text-3xl">{event ? 'Edit Event' : 'Create New Event'}</h1>
                    <p className="text-muted-foreground mt-2">
                        {event ? 'Update your event details' : 'Fill in the details to create a new event listing'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Main Form Content */}
                        <div className="space-y-8 md:col-span-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Provide the essential details about your event</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Event Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value )}
                                            placeholder="Enter event name"
                                            className={errors.name ? 'border-destructive' : ''}
                                        />
                                        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe your event"
                                            rows={5}
                                            className={errors.description ? 'border-destructive' : ''}
                                        />
                                        {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
                                    </div>

                                    <LocationInput
                                        value={data.location}
                                        onChange={(val, lat, lng) => {
                                            setData('location', val);
                                            setData('lat', lat !== undefined ? lat.toString() : '');
                                            setData('lng', lng !== undefined ? lng.toString() : '');
                                        }}
                                        error={errors.location}
                                    />
                                </CardContent>
                            </Card>

                            {/* Date */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Date</CardTitle>
                                    <CardDescription>When will your event take place?</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Event Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !selectedDate && 'text-muted-foreground',
                                                        errors.date && 'border-destructive',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={handleDateChange}
                                                    initialFocus
                                                    disabled={(date) => date < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.date && <p className="text-destructive text-xs">{errors.date}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tickets and Pricing */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tickets and Pricing</CardTitle>
                                    <CardDescription>Set up your ticket availability and pricing</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Ticket Price ($)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                className={errors.price ? 'border-destructive' : ''}
                                            />
                                            {errors.price && <p className="text-destructive text-xs">{errors.price}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="total_tickets">Total Tickets Available</Label>
                                            <Input
                                                id="total_tickets"
                                                type="number"
                                                min="1"
                                                value={data.total_tickets}
                                                onChange={(e) => setData('total_tickets', e.target.value)}
                                                placeholder="100"
                                                className={errors.total_tickets ? 'border-destructive' : ''}
                                            />
                                            {errors.total_tickets && <p className="text-destructive text-xs">{errors.total_tickets}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Image Upload */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Image</CardTitle>
                                    <CardDescription>Upload an image for your event</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col items-center justify-center">
                                        <div
                                            className={cn(
                                                'border-muted-foreground/25 bg-muted relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed',
                                                errors.image && 'border-destructive',
                                            )}
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Event preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                                    <ImageIcon className="text-muted-foreground mb-2 h-8 w-8" />
                                                    <p className="text-muted-foreground text-sm">Drag and drop or click to upload</p>
                                                    <p className="text-muted-foreground text-xs">Recommended size: 1200 x 675 pixels</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                            />
                                        </div>
                                        {progress && (
                                            <Progress className="mt-2" value={progress.percentage}>
                                                {progress.percentage}%
                                            </Progress>
                                        )}
                                        {errors.image && <p className="text-destructive mt-2 text-xs">{errors.image}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <Card>
                                <CardContent className="">
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                                {event ? 'Updating Event...' : 'Creating Event...'}
                                            </>
                                        ) : event ? (
                                            'Update Event'
                                        ) : (
                                            'Create Event'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
