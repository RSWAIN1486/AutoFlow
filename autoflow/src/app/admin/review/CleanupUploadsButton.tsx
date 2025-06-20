'use client';

import { useState } from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';

export default function CleanupUploadsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCleanup = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/cleanup-uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to cleanup uploads'
        });
      }
    } catch (error) {
      console.error('Error cleaning up uploads:', error);
      setMessage({
        type: 'error',
        text: 'Network error occurred while cleaning up uploads'
      });
    } finally {
      setIsLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCleanup}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-2 border border-orange-300 shadow-sm text-sm leading-4 font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Clean up orphaned files in uploads directory"
      >
        <FolderIcon className="h-4 w-4 mr-2" />
        {isLoading ? 'Cleaning...' : 'Cleanup Files'}
      </button>

      {/* Success/Error Message */}
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-md p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 