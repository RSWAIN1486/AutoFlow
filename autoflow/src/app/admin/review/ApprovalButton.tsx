'use client';

interface ApprovalButtonProps {
  applicationId: number;
  status: string;
}

export default function ApprovalButton({ applicationId, status }: ApprovalButtonProps) {
  const handleApproval = () => {
    // This will be implemented in the next task (Task 9)
    alert('Lender approval simulation will be implemented in the next step!');
  };

  if (status !== 'documents-uploaded') {
    return null;
  }

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
      onClick={handleApproval}
    >
      Simulate Lender Approval
    </button>
  );
} 