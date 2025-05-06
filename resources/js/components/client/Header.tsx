"use client"

import type React from "react"

import { useInitials } from "@/hooks/use-initials"
import { Link, usePage } from "@inertiajs/react"
import { LogOut, Search, Loader2, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useDebounce } from "@/hooks/use-debounce"

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
import { Input } from "@/components/ui/input"
import type { SharedData } from "@/types"
import { formatDate } from "@/lib/utils"

// Define the Event type for search results
interface SearchEvent {
  id: string
  name: string
  location: string
  date: string
  image: string
  price: number
}

export function Header() {
  const { auth } = usePage<SharedData>().props
  const getInitials = useInitials()

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchEvent[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
      setSearchResults([])
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setShowDropdown(false)
    setSearchResults([])
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        // Make the request to the Laravel API
        const response = await axios.get(route('events.search', { query: debouncedSearchQuery }))
        setSearchResults(response.data || []) // Assuming Typesense response structure\
        console.log(searchResults);
      } catch (error) {
        console.error("Error searching events:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchQuery])

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">TicketHub</span>
          </Link>
        </div>

        <div className="relative mx-4 w-full max-w-md md:mx-8" ref={searchRef}>
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for events..."
            className="bg-background w-full appearance-none pl-8 shadow-none"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowDropdown(true)}
          />
          {searchQuery && (
            <button
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-background shadow-lg z-50 max-h-[70vh] overflow-auto">
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Search Results</div>
                  {searchResults.map((event) => (
                    <Link
                      key={event.id}
                      href={route("events.show", event.id)}
                      className="flex items-center px-3 py-2 hover:bg-muted transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md mr-3">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="truncate">{event.location}</span>
                          <span className="mx-1">•</span>
                          <span>{event.humanDate}</span>
                        </div>
                      </div>
                      <div className="ml-3 text-sm font-medium">${event.price.toFixed(2)}</div>
                    </Link>
                  ))}
                  <div className="px-3 pt-2 pb-1 border-t mt-1">
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="text-xs text-primary hover:underline"
                      onClick={() => setShowDropdown(false)}
                    >
                      View all results
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No events found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
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
                  <Link href="/sell-tickets" className="flex w-full">
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
