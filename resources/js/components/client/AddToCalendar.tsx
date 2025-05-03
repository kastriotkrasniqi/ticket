import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Event, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { CalendarIcon } from 'lucide-react';

export function AddToCalendar({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');

    const addEventToCalendar = () => {

    }

    return (
        <Button variant="outline" className="w-full" onClick={addEventToCalendar} disabled={loading}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add to Calendar
        </Button>
    );
}
