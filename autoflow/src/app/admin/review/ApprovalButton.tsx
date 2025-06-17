'use client';

import { useState } from 'react';
import Toast from './Toast';

interface ApprovalButtonProps {
  applicationId: number;
  status: string;
}

export default function ApprovalButton({ applicationId, status }: ApprovalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [approvalResult, setApprovalResult] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleApproval = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/lender-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setApprovalResult(result.approvalTerms);
        setToastMessage(`✅ Approval Complete! Loan: $${result.approvalTerms.loanAmount.toLocaleString()}, Rate: ${result.approvalTerms.interestRate}% APR, Payment: $${result.approvalTerms.monthlyPayment}/mo`);
        setToastType('success');
        setShowToast(true);
        // Show success animation for 3 seconds, then refresh
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setToastMessage(`❌ Error: ${result.error || 'Failed to simulate approval'}`);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error simulating approval:', error);
      setToastMessage('❌ Error simulating approval. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'documents-uploaded') {
    return null;
  }

  // Show success animation after approval
  if (approvalResult) {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-md">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2"></div>
          <span className="text-green-700 text-sm font-medium">
            ✅ Approved! Refreshing...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleApproval}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Processing...
          </div>
        ) : (
          'Simulate Lender Approval'
        )}
      </button>
      
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
} 