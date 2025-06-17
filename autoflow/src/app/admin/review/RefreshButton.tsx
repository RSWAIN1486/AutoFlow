'use client';

import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    // Force a hard refresh with timestamp to bypass caching
    window.location.href = window.location.pathname + '?t=' + Date.now();
  };

  return (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      title="Refresh Dashboard"
    >
      <ArrowPathIcon className="h-4 w-4 mr-2" />
      Refresh
    </button>
  );
} 