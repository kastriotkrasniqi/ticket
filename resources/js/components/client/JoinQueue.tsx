import { AddToCalendar } from '@/components/client/AddToCalendar';
import Spinner from '@/components/client/Spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Event, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Clock, OctagonXIcon, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function JoinQueue({ event }: { event: Event }) {
    const { auth } = usePage<SharedData>().props;
    const [loading, setLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');
    const isLoggedIn = !!auth?.user;

    const expiresAt = event.queue_position?.expires_at ? event.queue_position.expires_at * 1000 : null;
    const isOfferExpired = expiresAt && Date.now() > expiresAt;

    // Listen for real-time updates if in queue
    useEffect(() => {
        if (!auth?.user?.id) return;

        const channelName = `App.Models.User.${auth.user.id}`;
        const channel = window.Echo.private(channelName);

        if (event?.queue_position?.status === 'waiting') {
            channel.listen('WaitingStatusUpdate', (e: any) => {
                console.log('Received update:', e);
                try {
                    router.reload();
                } catch {
                    toast.error('Failed to refresh. Please try manually.');
                }
            });
        }

        return () => {
            channel.stopListening('WaitingStatusUpdate');
            window.Echo.leave(channelName);
        };
    }, [auth?.user?.id, event?.queue_position?.status]);

    // Timer logic for offered ticket
    useEffect(() => {
        const updateTime = () => {
            const now = Date.now();

            if (!expiresAt || now >= expiresAt) {
                setTimeRemaining('Expired');
                return;
            }

            const diff = expiresAt - now;
            const minutes = Math.floor(diff / 1000 / 60);
            const seconds = Math.floor((diff / 1000) % 60);

            const timeStr =
                minutes > 0
                    ? `${minutes}m ${seconds}s`
                    : `${seconds}s`;

            setTimeRemaining(timeStr);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const handleJoinQueue = () => {
        if (event.queue_position) {
            toast('You are already in the queue or have an offer.');
            return;
        }

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

    const handleReleaseOffer = (status: string) => {
        setLoading(true);
        axios
            .post(route('events.release-offer', event.id), { status })
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
        // TODO: Implement actual checkout logic
        toast('Redirecting to purchase... (not implemented)');
    };

    if (!event) return <Spinner />;

    if (event.is_owner) return <Message icon={<OctagonXIcon />} text="You cannot buy a ticket for your own event" />;

    if (event.is_past_event) return <Message icon={<Clock />} text="Event has ended" muted />;

    if (event.is_canceled) {
        return (
            <div className="py-2 text-center">
                <Badge variant="secondary" className="text-muted-foreground w-full py-2 text-sm">
                    Event Canceled
                </Badge>
            </div>
        );
    }

    if (!isLoggedIn) return <LoginPrompt />;

    if (event.queue_position?.status === 'offered') {
        return (
            <div className="space-y-2 text-center">
                <p className="text-foreground text-sm font-medium">
                    🎟️ You have an offer! Time left: <span className="font-bold">{timeRemaining}</span>
                </p>
                <Button className="w-full" onClick={handlePurchaseTicket} disabled={isOfferExpired}>
                    {isOfferExpired ? 'Offer expired' : 'Purchase Ticket'}
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleReleaseOffer('offered')}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Release Offer
                </Button>
            </div>
        );
    }

    if (event.queue_position?.status === 'waiting') {
        return (
            <div className="space-y-2 text-center">
                <p className="text-muted-foreground text-sm">
                    You're in the queue. Position: <span className="font-bold">{event.queue_position.position}</span>
                </p>
                <Button variant="outline" disabled className="w-full">
                    Waiting...
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleReleaseOffer('waiting')} disabled={loading}>
                    {loading && <Loader2 className="animate-spin h-4 w-4 mr-1" />}
                    Leave the waiting list
                </Button>
            </div>
        );
    }

    if (!event.available || event.is_sold_out) {
        return (
            <div className="space-y-2 text-center">
                <p className="text-muted-foreground text-sm">
                    {event.is_sold_out ? 'Sold Out.' : 'Tickets are not available, but you can join the waiting list.'}
                </p>
                <Button onClick={handleJoinQueue} variant="default" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Joining queue...
                        </>
                    ) : (
                        'Buy the ticket'
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-2 text-center">
            <Button onClick={handleJoinQueue} variant="default" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Joining queue...
                    </>
                ) : (
                    'Buy the ticket'
                )}
            </Button>
            <AddToCalendar event={event} />
        </div>
    );
}

const Message = ({ icon, text, muted }: { icon: any; text: string; muted?: boolean }) => {
    return (
        <div className={`space-y-2 text-center ${muted ? 'text-muted-foreground' : 'text-foreground'}`}>
            <div className="text-foreground flex items-center justify-center">{icon}</div>
            <p className="text-sm">{text}</p>
        </div>
    );
};

const LoginPrompt = () => (
    <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm">Please log in to buy the ticket</p>
        <Link as="button" href={route('login')} className="w-full cursor-pointer">
            <Button className="w-full" variant={'outline'}>
                Log in
            </Button>
        </Link>
    </div>
);
