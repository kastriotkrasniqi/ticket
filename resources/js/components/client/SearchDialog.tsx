import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, MapPinIcon, XIcon } from 'lucide-react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface MeiliSearchHit {
    id: string;
    name: string;
    date: string;
    location: string;
    image: string;
    price: number;
    description?: string;
    _formatted?: {
        name: string;
        description?: string;
        [key: string]: any;
    };
}

interface MeiliSearchResponse {
    hits: MeiliSearchHit[];
    query: string;
    processingTimeMs: number;
    limit: number;
    offset: number;
    estimatedTotalHits: number;
}

interface SearchDialogProps {
    className?: string;
    onClose: () => void;
}

const SearchDialog = ({ className = '', onClose }: SearchDialogProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(searchValue);
    const [searchResponse, setSearchResponse] = useState<MeiliSearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [onClose]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(searchValue), 300);
        return () => clearTimeout(handler);
    }, [searchValue]);

    useEffect(() => {
        if (debouncedValue.trim().length < 2) {
            setSearchResponse(null);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.post('/search', { keyword: debouncedValue });
                if (response.data.result) {
                    setSearchResponse(response.data.result);
                } else {
                    setError('Invalid response format from search service');
                }
            } catch (err) {
                console.error('Search error:', err);
                setError('An error occurred while searching. Please try again.');
                setSearchResponse(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedValue]);

    const formatEventDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'EEE, MMM d, yyyy • h:mm a');
        } catch {
            return 'Date unavailable';
        }
    };

    const renderHighlightedText = (html: string) => ({ __html: html });

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm ${className}`} onClick={onClose}>
            <div
                ref={dialogRef}
                className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center border-b p-4">
                    <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-slate-300 dark:text-slate-400"
                    >
                        <path d="M19 19L15.5 15.5" />
                        <circle cx="11" cy="11" r="6" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchValue}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                        placeholder="Search for events, venues, or artists..."
                        className="flex-1 bg-transparent px-2 py-1 text-base outline-none"
                    />
                    {searchValue && (
                        <button
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSearchValue('');
                            }}
                        >
                            <XIcon className="h-4 w-4" />
                            <span className="sr-only">Clear search</span>
                        </button>
                    )}
                    <div className="bg-muted ml-2 flex-shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium">ESC</div>
                </div>

                {/* Search Results */}
                <div className="max-h-[calc(85vh-4rem)] overflow-y-auto px-4 py-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="text-primary h-8 w-8 animate-spin" />
                            <span className="text-muted-foreground ml-2">Searching...</span>
                        </div>
                    ) : error ? (
                        <div className="text-destructive p-4 text-center">
                            <p>{error}</p>
                            <Button variant="outline" className="mt-2" onClick={() => setError(null)}>
                                Try Again
                            </Button>
                        </div>
                    ) : searchResponse && searchResponse.hits.length > 0 ? (
                        <div className="space-y-2">
                            <h3 className="text-muted-foreground px-2 text-sm font-medium">
                                {searchResponse.estimatedTotalHits} result
                                {searchResponse.estimatedTotalHits !== 1 && 's'} found
                                {/* {searchResponse.processingTimeMs && (
                                    <span className="text-muted-foreground ml-1 text-xs">
                                        in {(searchResponse.processingTimeMs / 1000).toFixed(2)}s
                                    </span>
                                )} */}
                            </h3>
                            {searchResponse.hits.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="hover:bg-muted flex gap-4 rounded-lg p-3 transition-colors"
                                    onClick={onClose}
                                >
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                        <img src={event.image || '/placeholder.svg'} alt={event.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        {!!event._formatted?.name ? (
                                            <h4
                                                className="line-clamp-1 font-medium"
                                                dangerouslySetInnerHTML={renderHighlightedText(event._formatted.name)}
                                            />
                                        ) : (
                                            <h4 className="line-clamp-1 font-medium">{event.name}</h4>
                                        )}
                                        <div className="text-muted-foreground mt-1 flex items-center text-sm">
                                            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                                            <span>{formatEventDate(event.date)}</span>
                                        </div>
                                        <div className="text-muted-foreground mt-1 flex items-center text-sm">
                                            <MapPinIcon className="mr-1 h-3.5 w-3.5" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                        {(event._formatted?.description || event.description) && (
                                            <p
                                                className="text-muted-foreground mt-1 line-clamp-2 text-sm"
                                                dangerouslySetInnerHTML={
                                                    event._formatted?.description
                                                        ? renderHighlightedText(event._formatted.description)
                                                        : { __html: event.description || '' }
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="ml-2 flex-shrink-0 self-start">
                                        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-sm font-medium">
                                            ${event.price.toFixed(2)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {searchResponse.estimatedTotalHits > searchResponse.hits.length && (
                                <div className="flex justify-center pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
                                        }}
                                    >
                                        View all results
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : searchValue.trim().length > 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <svg
                                width="48"
                                height="48"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-slate-300 dark:text-slate-400"
                            >
                                <path d="M19 19L15.5 15.5" />
                                <circle cx="11" cy="11" r="6" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium">No results found</h3>
                            <p className="text-muted-foreground mt-1 text-sm">We couldn't find any events matching "{searchValue}"</p>
                            <Button asChild className="mt-4">
                                <Link href="/events">Browse All Events</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <svg
                                width="48"
                                height="48"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-slate-300 dark:text-slate-400"
                            >
                                <path d="M19 19L15.5 15.5" />
                                <circle cx="11" cy="11" r="6" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium">Search for events</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Type at least 2 characters to search for events, venues, or artists</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchDialog;
