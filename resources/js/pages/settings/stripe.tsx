import { Head } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stripe setup',
        href: '/settings/stripe',
    },
];

interface StripeSetupProps {
    isConnected: boolean;
    stripeAccount?: {
        id: string;
        name: string;
        email: string;
        payouts_enabled: boolean;
        charges_enabled: boolean;
        individual: {
            first_name: string;
            last_name: string;
        };
        requirements?: {
            current_deadline: number;
            currently_due: string[];
            eventually_due: string[];
            past_due: string[];
            disabled_reason: string;
        };
    };
}

export default function StripeSetup({ isConnected = false, stripeAccount }: StripeSetupProps) {
    const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);

    console.log(stripeAccount);

    const handleConnectStripe = () => {
        router.get(route('stripe.onboard'));
    };

    const handleDisconnectStripe = () => {
        router.post(route('stripe.disconnect'));
        setIsDisconnectDialogOpen(false);
    };

    // Function to format the list of incomplete requirements
    const renderRequirements = (requirements: string[]) => {
        return requirements.map((req, index) => (
            <li key={index} className="flex items-start">
                <AlertCircle className="mt-0.5 mr-2 h-4 w-4 text-yellow-500" />
                <span>{req}</span>
            </li>
        ));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stripe setup" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Stripe settings" description="Connect your Stripe account to receive payments" />

                    {!isConnected ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <svg
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                        className="as-x as-y as-z as-10 as-9g as-12 as-13 as-9l ⚙1dh787r mr-2 h-6 w-6 rounded-full"
                                    >
                                        <g fill="none" fill-rule="evenodd">
                                            <path fill="#6772E5" d="M0 0h32v32H0z"></path>
                                            <path
                                                fill="#FFF"
                                                fill-rule="nonzero"
                                                d="M14.56 12.33c0-.78.64-1.08 1.7-1.08 1.52 0 3.43.46 4.95 1.28v-4.7c-1.66-.65-3.3-.91-4.95-.91-4.05 0-6.75 2.11-6.75 5.65 0 5.5 7.59 4.63 7.59 7 0 .92-.8 1.22-1.92 1.22-1.65 0-3.77-.68-5.45-1.6v4.75c1.86.8 3.74 1.14 5.45 1.14 4.15 0 7-2.05 7-5.63-.01-5.94-7.62-4.89-7.62-7.12z"
                                            ></path>
                                        </g>
                                    </svg>
                                    Connect with Stripe
                                </CardTitle>
                                <CardDescription>
                                    Stripe is our payment processor. Connect your Stripe account to start receiving payments for ticket sales.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Not connected</AlertTitle>
                                    <AlertDescription>
                                        You cannot receive payments without connecting a Stripe account. All ticket sales will be processed through
                                        Stripe.
                                    </AlertDescription>
                                </Alert>

                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-2 font-medium">Why connect with Stripe?</h3>
                                    <ul className="text-muted-foreground space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <CheckCircle className="mt-0.5 mr-2 h-4 w-4 text-green-500" />
                                            <span>Securely receive payments from ticket sales</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="mt-0.5 mr-2 h-4 w-4 text-green-500" />
                                            <span>Automatic payouts to your bank account</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="mt-0.5 mr-2 h-4 w-4 text-green-500" />
                                            <span>Detailed financial reporting and transaction history</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleConnectStripe} className="flex items-center">
                                    Connect with Stripe
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center">
                                        <svg
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 32 32"
                                            className="as-x as-y as-z as-10 as-9g as-12 as-13 as-9l ⚙1dh787r mr-2 h-6 w-6 rounded-full"
                                        >
                                            <g fill="none" fill-rule="evenodd">
                                                <path fill="#6772E5" d="M0 0h32v32H0z"></path>
                                                <path
                                                    fill="#FFF"
                                                    fill-rule="nonzero"
                                                    d="M14.56 12.33c0-.78.64-1.08 1.7-1.08 1.52 0 3.43.46 4.95 1.28v-4.7c-1.66-.65-3.3-.91-4.95-.91-4.05 0-6.75 2.11-6.75 5.65 0 5.5 7.59 4.63 7.59 7 0 .92-.8 1.22-1.92 1.22-1.65 0-3.77-.68-5.45-1.6v4.75c1.86.8 3.74 1.14 5.45 1.14 4.15 0 7-2.05 7-5.63-.01-5.94-7.62-4.89-7.62-7.12z"
                                                ></path>
                                            </g>
                                        </svg>
                                        Stripe Account
                                    </CardTitle>
                                    <StatusBadge status="active">Connected</StatusBadge>
                                </div>
                                <CardDescription>Your Stripe account is connected and ready to process payments</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg border p-4">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Account ID</p>
                                            <p className="font-mono text-sm">{stripeAccount?.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Account Name</p>
                                            <p className="text-sm">
                                                {stripeAccount?.individual?.first_name} {stripeAccount?.individual?.last_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Email</p>
                                            <p className="text-sm">{stripeAccount?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">Status</p>
                                            <div className="flex items-center gap-2">
                                                {stripeAccount?.payouts_enabled && stripeAccount?.charges_enabled ? (
                                                    <StatusBadge status="active" />
                                                ) : (
                                                    <Badge variant="destructive" className="mt-1">
                                                        Incomplete
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {stripeAccount?.requirements &&
                                    (stripeAccount.requirements.currently_due.length > 0 || stripeAccount.requirements.eventually_due.length > 0) && (
                                        <div className="rounded-lg border  bg-white p-4">
                                            <h3 className="mb-3 text-sm font-medium ">Required Information</h3>

                                            {stripeAccount.requirements.currently_due.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="mb-2 font-medium ">Action Required:</p>
                                                    <ul className="list-disc pl-5 text-sm text-red-600">
                                                        {stripeAccount.requirements.currently_due.map((req) => (
                                                            <li key={req}>{req.replace(/_/g, ' ')}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {stripeAccount.requirements.eventually_due.length > 0 && (
                                                <div>
                                                    <p className="mb-2 font-medium ">Eventually Needed:</p>
                                                    <ul className="list-disc pl-5 text-sm text-red-600">
                                                        {stripeAccount.requirements.eventually_due.map((req) => (
                                                            <li key={req}>{req.replace(/_/g, ' ')}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {stripeAccount ? (
                                    stripeAccount.payouts_enabled || stripeAccount.charges_enabled ? (
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <h3 className="font-medium">Stripe Dashboard</h3>
                                                <p className="text-muted-foreground text-sm">View your payouts, transactions, and account settings</p>
                                            </div>
                                            <Button variant="outline" className="flex items-center gap-1" asChild>
                                                <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                                                    Open Dashboard
                                                    <ExternalLink className="ml-1 h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between rounded-lg border bg-white p-6 transition-all duration-200">
                                            <div className="flex flex-col">
                                                <p className="text-md font-medium text-gray-800">Complete Account Setup</p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Finish setting up your account to start receiving payments.
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="text-primary border-primary flex items-center gap-2 transition-all duration-300"
                                                asChild
                                            >
                                                <Link
                                                    href={route('stripe.onboard')}
                                                    method="get"
                                                    target="_blank"
                                                    as="button"
                                                    rel="noopener noreferrer"
                                                >
                                                    <span className="text-sm font-medium">Complete Setup</span>
                                                    <ExternalLink className="text-primary ml-1 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )
                                ) : null}
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-2 border-t pt-6">
                                <h3 className="text-sm font-medium">Disconnect Stripe</h3>
                                <p className="text-muted-foreground text-sm">
                                    Disconnecting your Stripe account will prevent you from receiving payments. All existing tickets will remain
                                    valid.
                                </p>
                                <Dialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="mt-2 border-red-200 text-red-600 hover:bg-red-50">
                                            Disconnect Stripe
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Disconnect Stripe Account</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to disconnect your Stripe account? You will no longer be able to receive
                                                payments for ticket sales until you reconnect.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="gap-2">
                                            <Button variant="ghost" onClick={() => setIsDisconnectDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={handleDisconnectStripe}>
                                                Disconnect
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
