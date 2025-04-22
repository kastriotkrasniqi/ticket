import { Link } from '@inertiajs/react';
import SearchBar from "./SearchBar";
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useState } from 'react';

function Header() {
  const { auth } = usePage<SharedData>().props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="border-b">
      <div className="flex flex-col items-center gap-4 p-4 lg:flex-row">
        {/* Logo */}
        <div className="flex w-full items-center justify-between lg:w-auto">
          <Link href="/" className="shrink-0 font-bold">
            <img src="/images/logo.png" alt="logo" width={100} height={100} className="w-24 lg:w-28" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>

        {/* Dropdown User Menu */}
        {auth.user && (
          <div className="relative ml-auto hidden lg:block">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              {auth.user.name}
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Log Out
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
