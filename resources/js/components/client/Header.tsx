import { useInitials } from "@/hooks/use-initials"
import { Link, usePage } from "@inertiajs/react"
import { LogOut, Search, Loader2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SharedData } from "@/types"
import { SearchBar } from "./SearchBar"

// Define the Event type for search results


export function Header() {
  const { auth } = usePage<SharedData>().props
  const getInitials = useInitials()

  // Search state


  // Handle search input change


  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">TicketHub</span>
          </Link>
        </div>

        <SearchBar />

        {auth?.user ? (
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex md:gap-2">
              <Button variant="ghost" asChild>
                <Link href="/my-tickets">My Tickets</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href={route("events.create")}>Sell Tickets</Link>
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarImage src={auth.user.avatar || "/placeholder.svg"} alt={auth.user.name} />
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
                  <Link href={route('events.create')} className="flex w-full">
                    Sell Tickets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="flex w-full items-center" method="post" href={route("logout")} as="button">
                    <LogOut className="mr-2" />
                    Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
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
  )
}
