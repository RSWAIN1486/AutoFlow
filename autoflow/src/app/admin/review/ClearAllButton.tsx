'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ClearAllButtonProps {
  applicationCount: number;
}

export default function ClearAllButton({ applicationCount }: ClearAllButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleClearAll = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/clear-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Successfully cleared ${applicationCount} applications and ${data.deletedFiles?.length || 0} files`
        });
        setShowConfirmation(false);
        
        // Refresh the page to show the updated state
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to clear applications'
        });
      }
    } catch (error) {
      console.error('Error clearing applications:', error);
      setMessage({
        type: 'error',
        text: 'Network error occurred while clearing applications'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (applicationCount === 0) {
    return null; // Don't show the button if there are no applications
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirmation(true)}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Clear all applications and documents"
      >
        <TrashIcon className="h-4 w-4 mr-2" />
        {isLoading ? 'Clearing...' : 'Clear All'}
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Clear All Applications
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                This action will permanently delete:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li><strong>{applicationCount}</strong> applications and all their data</li>
                <li>All uploaded documents from the server</li>
                <li>All approval terms and status information</li>
              </ul>
              <p className="text-sm text-red-600 font-medium mt-3">
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Clearing...' : 'Clear All Applications'}
              </button>
            </div>
          </div>
        </div>
      )}

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