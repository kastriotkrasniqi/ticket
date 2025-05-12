import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const CompleteSetup = () => {
    const [stripeAccountLinkUrl, setStripeAccountLinkUrl] = useState<string | null>(null);

    // Fetch Stripe Account Link URL when the component mounts
    useEffect(() => {
        const fetchStripeAccountLink = async () => {
            try {
                const response = await axios.get(route('stripe.onboard'));
                setStripeAccountLinkUrl(response.data.url);
            } catch (error) {
                console.error('Error fetching Stripe account link:', error);
            }
        };

        fetchStripeAccountLink();
    }, []);

    if (!stripeAccountLinkUrl) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-200">
            <div className="flex flex-col">
                <p className="text-lg font-medium text-gray-800">Complete Account Setup</p>
                <p className="text-sm text-gray-500 mt-1">Finish setting up your account to start receiving payments.</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 text-primary hover:text-white border-primary hover:bg-primary transition-all duration-300" asChild>
                <a href={stripeAccountLinkUrl} target="_blank" rel="noopener noreferrer">
                    <span className="text-sm font-medium">Complete Setup</span>
                    <ExternalLink className="ml-1 h-4 w-4 text-primary" />
                </a>
            </Button>
        </div>
    );
};

export default CompleteSetup;
