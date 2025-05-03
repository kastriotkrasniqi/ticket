import { AddToCalendar } from '@/components/client/AddToCalendar';
import Spinner from '@/components/client/Spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Event, SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { CalendarIcon, Clock, OctagonXIcon , XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

export function JoinQueue({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');

    const expiresAt = event.queue_position?.expires_at
    ? event.queue_position.expires_at * 1000
    : null;

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = Date.now();

            if (!expiresAt || now >= expiresAt) {
                setTimeRemaining('Expired');
                return;
            }

            const diff = expiresAt - now;
            const minutes = Math.floor(diff / 1000 / 60);
            const seconds = Math.floor((diff / 1000) % 60);

            if (minutes > 0) {
                setTimeRemaining(
                    `${minutes} minute${minutes === 1 ? '' : 's'} ${seconds} second${seconds === 1 ? '' : 's'}`
                );
            } else {
                setTimeRemaining(`${seconds} second${seconds === 1 ? '' : 's'}`);
            }
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const isLoggedIn = !!auth?.user;

    const handleJoinQueue = () => {
        setLoading(true);
        axios
            .post(route('events.join-waiting-list', event.id))
            .then((res) => {
                toast.success(res.data.message);
                router.reload();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Failed to join the queue');
            })
            .finally(() => setLoading(false));
    };

    const handleReleaseOffer = () => {
        setLoading(true);
        axios
            .post(route('events.release-offer', event.id))
            .then((res) => {
                toast.success(res.data.message);
                router.reload();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Failed to release offer');
            })
            .finally(() => setLoading(false));
    };

    const handlePurchaseTicket = () => {
        // TODO: Navigate to checkout
        toast('Redirecting to purchase... (not implemented)');
    };

    if (!event) return <Spinner />;

    if (event.is_owner) {
        return <Message icon={<OctagonXIcon />} text="You cannot buy a ticket for your own event" />;
    }

    if (event.is_past_event) {
        return <Message icon={<Clock />} text="Event has ended" muted />;
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
        return <LoginPrompt />;
    }

    if (event.queue_position?.status === 'offered') {
        return (
            <div className="space-y-2 text-center">
                <p className="text-sm text-foreground font-medium">
                    🎟️ You have an offer! Time left: <span className="font-bold">{timeRemaining}</span>
                </p>
                <Button className="w-full" onClick={handlePurchaseTicket} disabled={timeRemaining === 'Expired'}>
                    Purchase Ticket
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleReleaseOffer}>
                <XCircle className="w-4 h-4" />
                    Release Offer
                </Button>
            </div>
        );
    }

    if (event.queue_position?.status === 'waiting') {
        return (
            <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    You're in the queue. Position: <span className="font-bold">{event.queue_position.position}</span>
                </p>
                <Button variant="outline" disabled className="w-full">
                    Waiting...
                </Button>
            </div>
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
                {loading ? 'Processing...' : 'Join Queue'}
            </Button>
            <AddToCalendar event={event} />
        </div>
    );
}

function Message({ icon, text, muted = false }: { icon: JSX.Element; text: string; muted?: boolean }) {
    return (
        <div
            className={`mb-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                muted ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-700'
            }`}
        >
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
