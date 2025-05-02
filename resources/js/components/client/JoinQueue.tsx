import Spinner from '@/components/client/Spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Event, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarIcon, Clock, OctagonXIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export function JoinQueue({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);

    if (!event) return <Spinner />;

    const isLoggedIn = !!auth?.user;

    const handleJoinQueue = async () => {
        try {
            setLoading(true);
            const response = await axios.post(route('events.join-waiting-list', event.id));
            console.log(response.data);
        } catch (error) {
            console.error('Error joining queue:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Conditional Rendering Blocks ---
    if (event.is_owner) {
        return (
            <Message icon={<OctagonXIcon />} text="You cannot buy a ticket for your own event" />
        );
    }

    if (event.is_past_event) {
        return (
            <Message icon={<Clock />} text="Event has ended" muted />
        );
    }

    if (event.is_canceled) {
        return (
            <div className="py-2 text-center">
                <Badge variant="secondary" className="text-muted-foreground w-full py-2 text-sm">
                    Event Canceled
                </Badge>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <LoginPrompt />
        );
    }

    if (!event.available) {
        return (
            <div className="text-center space-y-2">
                <p className="text-muted-foreground text-sm">
                    {event.is_sold_out ? 'Sorry, this event is sold out' : 'Tickets are not available'}
                </p>
                <LoginPrompt />
            </div>
        );
    }

    return (
        <div className="space-y-2 text-center">
            <Button onClick={handleJoinQueue} variant="default" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Buy Ticket'}
            </Button>
            <Button variant="outline" className="w-full">
                <CalendarIcon /> Add to Calendar
            </Button>
        </div>
    );
}

// --- Helper Components ---
function Message({ icon, text, muted = false }: { icon: JSX.Element, text: string, muted?: boolean }) {
    return (
        <div className={`mb-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 ${muted ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-700'}`}>
            {icon}
            <span>{text}</span>
        </div>
    );
}

function LoginPrompt() {
    return (
        <div className="text-center">
            <p className="text-muted-foreground text-sm">Please log in to buy tickets</p>
            <Button variant="outline" className="mt-4 w-full">
                <Link method="get" href={route('login')} as="button">
                    Login
                </Link>
            </Button>
        </div>
    );
}
