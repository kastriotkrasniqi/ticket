import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import axios from 'axios';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from "@inertiajs/react"
import type { Event } from "@/types"


export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Event[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
            setSearchResults([]);
        }
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
        setShowDropdown(false);
        setSearchResults([]);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await axios.get(route('events.search', { query: debouncedSearchQuery }));
                setSearchResults(response.data || []);
            } catch (error) {
                console.error('Error searching events:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        fetchSearchResults();
    }, [debouncedSearchQuery]);

    return (
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
                    className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
                    onClick={clearSearch}
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}

            {/* Search Results Dropdown */}
            {showDropdown && (
                <div className="bg-background absolute top-full right-0 left-0 z-50 mt-1 max-h-[70vh] overflow-auto rounded-md border shadow-lg">
                    {isSearching ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                            <span className="ml-2 text-sm">Searching...</span>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="py-2">
                            <div className="text-muted-foreground px-3 py-1.5 text-xs font-medium">Search Results</div>
                            {searchResults.map((event) => (
                                <Link
                                    key={event.id}
                                    href={route('events.show', event.id)}
                                    className="hover:bg-muted flex items-center px-3 py-2 transition-colors"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                                        <img src={event.image || '/placeholder.svg'} alt={event.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{event.name}</p>
                                        <div className="text-muted-foreground flex items-center text-xs">
                                            <span className="truncate">{event.location}</span>
                                            <span className="mx-1">•</span>
                                            <span>{event.humanDate}</span>
                                        </div>
                                    </div>
                                    <div className="ml-3 text-sm font-medium">${event.price.toFixed(2)}</div>
                                </Link>
                            ))}
                            <div className="mt-1 border-t px-3 pt-2 pb-1">
                                <Link
                                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                    className="text-primary text-xs hover:underline"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    View all results
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-muted-foreground p-4 text-center text-sm">No events found matching "{searchQuery}"</div>
                    )}
                </div>
            )}
        </div>
    );
}
