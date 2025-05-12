import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Event, SharedData } from '@/types';
import { CalendarIcon } from 'lucide-react';

export function AddToCalendar({ event }: { event: Event }) {

    const addEventToCalendar = () => {
        if (!event) return;


        const date = new Date(event.isoDate);

        const formatGoogleCalendarDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0];
        };

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formatGoogleCalendarDate(date)}/${formatGoogleCalendarDate(date)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;

        window.open(googleCalendarUrl, '_blank');
    };

    return (
        <Button variant="outline" className="w-full" onClick={addEventToCalendar}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add to Calendar
        </Button>
    );
}
