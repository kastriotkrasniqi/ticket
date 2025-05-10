import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';


export function PurchaseTicket({ isOfferExpired, eventId }: { isOfferExpired: boolean | undefined; eventId: string }) {
    const [loading, setLoading] = useState(false);

    const handlePurchaseTicket = async () => {
        setLoading(true);

        try {
            const response = await axios.post(route('events.purchase-ticket'), { event_id: eventId });
            const data = response.data;
            window.location.href = data.url;
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || 'Unable to create payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button className="w-full" onClick={handlePurchaseTicket} disabled={isOfferExpired || loading}>
            {isOfferExpired ? 'Offer expired' : loading ? 'Processing...' : 'Purchase Ticket'}
        </Button>
    );
}
