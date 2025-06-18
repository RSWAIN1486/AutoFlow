'use client';

import { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface SendContractButtonProps {
  applicationId: number;
  onSuccess?: () => void;
}

export default function SendContractButton({ applicationId, onSuccess }: SendContractButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendContract = async () => {
    setIsSending(true);
    
    try {
      const response = await fetch('/api/contract-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          action: 'send-contract'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSent(true);
        // Call parent refresh function if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000); // Show success message for 2 seconds before refreshing
        }
      } else {
        console.error('Failed to send contract:', data.error);
        alert(data.error || 'Failed to send contract. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contract:', error);
      alert('An error occurred while sending the contract. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
        Contract Sent! Customer will receive e-sign notification
      </div>
    );
  }

  return (
    <button
      onClick={handleSendContract}
      disabled={isSending}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Sending Contract...
        </>
      ) : (
        <>
          <DocumentTextIcon className="h-4 w-4" />
          Send for E-Contracting
        </>
      )}
    </button>
  );
} 