interface SearchButtonProps {
    className?: string;
    onOpen: () => void;
}

const SearchButton = ({ className = '', onOpen }: SearchButtonProps) => (
    <div className={`flex justify-center ${className}`}>
        <button
            type="button"
            className="z-30 flex h-12 w-72 items-center space-x-3 rounded-lg bg-white px-4 text-left text-slate-400 shadow-sm ring-1 ring-slate-900/10 transition hover:ring-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:bg-black dark:text-slate-300 dark:shadow-[0_0_25px_5px_rgba(0,125,255,0.8)] dark:hover:bg-gray-900 dark:hover:shadow-blue-800"
            onClick={onOpen}
        >
            <svg
                width="24"
                height="24"
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

export default SearchButton;
