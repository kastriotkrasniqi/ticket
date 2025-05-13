import { loadConnectAndInitialize } from '@stripe/connect-js';
import { ConnectComponentsProvider, ConnectPayments } from '@stripe/react-connect-js';
import { useState } from 'react';
import axios from 'axios';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function PaymentStats() {

    const breadcrumbs = [
        {
            title: 'Payments',
            href: route('payments.stats'),
        },
    ];

    const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
        try {
            const response = await axios.post(route('stripe.account-session'));

            const clientSecret = response.data.client_secret;
            return clientSecret;
        } catch (error) {
            // Handle client-side error
            if (error.response) {
                console.error('Error fetching client secret:', error.response.data);
            } else {
                console.error('Unexpected error:', error.message);
            }
            return undefined;
        }
    };

    return loadConnectAndInitialize({
        publishableKey: 'pk_test_51RMWqvQ9qrq0m0KgoV05wRCBsRuP027rBzJHUkz4uRaXbFEOCSCft9R2XW5XQ6AOkzuUleHnnUWC38fGZaUxbKpt00Tlz1BIdR',
        fetchClientSecret: fetchClientSecret,
        appearance: {
            overlays: 'dialog',
            variables: {
                colorPrimary: '#625afa',
            },
        },
    });
});


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container">
                    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                        <ConnectPayments />
                    </ConnectComponentsProvider>
                </div>
            </div>
        </AppLayout>
    );
}
