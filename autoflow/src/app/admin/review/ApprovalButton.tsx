'use client';

import { useState } from 'react';

interface ApprovalButtonProps {
  applicationId: number;
  status: string;
}

export default function ApprovalButton({ applicationId, status }: ApprovalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [approvalResult, setApprovalResult] = useState<any>(null);

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
        alert(`✅ Approval Simulation Complete!\n\nLoan Amount: $${result.approvalTerms.loanAmount.toLocaleString()}\nInterest Rate: ${result.approvalTerms.interestRate}% APR\nTerm: ${result.approvalTerms.termLength} months\nMonthly Payment: $${result.approvalTerms.monthlyPayment.toLocaleString()}\n\nApproval ID: ${result.approvalTerms.approvalId}`);
        // Refresh the page to show updated status
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert(`❌ Error: ${result.error || 'Failed to simulate approval'}`);
      }
    } catch (error) {
      console.error('Error simulating approval:', error);
      alert('Error simulating approval. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'documents-uploaded') {
    return null;
  }

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleApproval}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Simulate Lender Approval'}
    </button>
  );
} 