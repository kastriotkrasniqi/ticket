import { useInitials } from '@/hooks/use-initials';
import { Link } from '@inertiajs/react';
import { LogOut, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function Header() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    return (
            <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold">TicketHub</span>
                        </Link>
                    </div>

                    <div className="relative mx-4 w-full max-w-md md:mx-8">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input type="search" placeholder="Search for events..." className="bg-background w-full  appearance-none pl-8 shadow-none" />
                    </div>
                    {auth?.user ? (
                        <div className="ml-auto flex items-center gap-2">
                            <div className="hidden md:flex md:gap-2">
                                <Button variant="ghost" asChild>
                                    <Link href="/my-tickets">My Tickets</Link>
                                </Button>
                                <Button variant="default" asChild>
                                    <Link href="/sell-tickets">Sell Tickets</Link>
                                </Button>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href="/profile" className="flex w-full">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/settings" className="flex w-full">
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="md:hidden">
                                        <Link href="/my-tickets" className="flex w-full">
                                            My Tickets
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="md:hidden">
                                        <Link href="/sell-tickets" className="flex w-full">
                                            Sell Tickets
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                    <Link className="flex w-full items-center" method="post" href={route('logout')} as="button" >
                                        <LogOut className="mr-2" />
                                        Log out
                                    </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) :  (
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="default" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </div>
                    )}

                </div>
            </header>
    );
}
