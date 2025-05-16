import { Search } from 'lucide-react';
import { useEffect } from 'react';

interface SearchButtonProps {
    className?: string;
    onClick: () => void;
}

const SearchButton = ({ className = '', onClick }: SearchButtonProps) => {
    // Add keyboard shortcut listener (⌘K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onClick();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClick]);

    return (
        <div className={`flex justify-center ${className}`}>
            <button
                type="button"
                className="z-30 flex h-12 w-72 items-center space-x-3 rounded-lg bg-white px-4 text-left text-slate-400 shadow-sm ring-1 ring-slate-900/10 transition hover:ring-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:bg-black dark:text-slate-300 dark:shadow-[0_0_25px_5px_rgba(0,125,255,0.8)] dark:hover:bg-gray-900 dark:hover:shadow-blue-800"
                onClick={onClick}
            >
                <Search className="h-5 w-5 text-slate-300 dark:text-slate-400" />
                <span className="flex-auto">Search events...</span>
                <kbd className="font-sans font-semibold text-slate-400 dark:text-slate-500">
                    <abbr title="Command" className="no-underline">
                        ⌘
                    </abbr>{' '}
                    K
                </kbd>
            </button>
        </div>
    );
};

export default SearchButton;
