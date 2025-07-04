'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DocumentTextIcon, PencilSquareIcon, PaperAirplaneIcon, TruckIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { CreditApplication } from '@/lib/applicationStore';

interface EContractingClientProps {
  application: CreditApplication;
}

export default function EContractingClient({ application }: EContractingClientProps) {
  const router = useRouter();
  const [isSigning, setIsSigning] = useState(false);
  const [showSigningAnimation, setShowSigningAnimation] = useState(false);

  const handleSignNow = async () => {
    setIsSigning(true);
    setShowSigningAnimation(true);
    
    try {
      const response = await fetch('/api/contract-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          action: 'sign-contract'
        }),
      });

      if (response.ok) {
        // Simulate signing process
        setTimeout(() => {
          setIsSigning(false);
          setShowSigningAnimation(false);
          // Navigate to delivery options page (now exists)
          router.push(`/delivery-options/${application.id}?token=${application.token}`);
        }, 3000);
      } else {
        console.error('Failed to update contract status');
        // Still proceed for demo purposes
        setTimeout(() => {
          setIsSigning(false);
          setShowSigningAnimation(false);
          router.push(`/delivery-options/${application.id}?token=${application.token}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      // Still proceed for demo purposes
      setTimeout(() => {
        setIsSigning(false);
        setShowSigningAnimation(false);
        router.push(`/delivery-options/${application.id}?token=${application.token}`);
      }, 3000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Electronic Contract</h1>
        <p className="text-sm sm:text-base text-gray-600">Review and sign your loan agreement</p>
      </div>

      {/* Contract Summary */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
          Loan Summary
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center text-sm sm:text-base">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Borrower Information
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-gray-800"><span className="font-semibold text-gray-900">Name:</span> {application.firstName} {application.lastName}</p>
              <p className="text-gray-800 break-all"><span className="font-semibold text-gray-900">Email:</span> {application.email}</p>
              <p className="text-gray-800"><span className="font-semibold text-gray-900">Phone:</span> {application.phone}</p>
              <p className="text-gray-800"><span className="font-semibold text-gray-900">Annual Income:</span> {formatCurrency(parseInt(application.annualIncome))}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center text-sm sm:text-base">
              <Image 
                src="/westlake-logo.png" 
                alt="Westlake Financial Logo" 
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain mr-2"
              />
              Lender Information
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-gray-800"><span className="font-semibold text-gray-900">Lender:</span> Westlake Financial Services</p>
              <p className="text-gray-800 break-words"><span className="font-semibold text-gray-900">Address:</span> 4751 Wilshire Blvd, Los Angeles, CA 90010</p>
              <p className="text-gray-800"><span className="font-semibold text-gray-900">Phone:</span> (888) 893-7937</p>
              <p className="text-gray-800"><span className="font-semibold text-gray-900">License:</span> CA-DBO-603 K456</p>
            </div>
          </div>
        </div>

        {application.selectedVehicle && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Vehicle Information</h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {application.selectedVehicle.year} {application.selectedVehicle.make} {application.selectedVehicle.model}
              </p>
              <p className="text-green-600 font-semibold text-sm sm:text-base">
                {formatCurrency(application.selectedVehicle.price)}
              </p>
            </div>
          </div>
        )}

        {application.approvalTerms && (
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center text-sm sm:text-base">
              <Image 
                src="/westlake-logo.png" 
                alt="Westlake Financial Logo" 
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain mr-2"
              />
              Loan Terms
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="font-medium text-blue-800">Loan Amount:</span>
                <div className="text-blue-700 font-semibold text-sm sm:text-lg">{formatCurrency(application.approvalTerms.loanAmount)}</div>
              </div>
              <div>
                <span className="font-medium text-blue-800">Interest Rate:</span>
                <div className="text-blue-700 font-semibold text-sm sm:text-lg">{application.approvalTerms.interestRate}% APR</div>
              </div>
              <div>
                <span className="font-medium text-blue-800">Term:</span>
                <div className="text-blue-700 font-semibold text-sm sm:text-lg">{application.approvalTerms.termLength} months</div>
              </div>
              <div>
                <span className="font-medium text-blue-800">Monthly Payment:</span>
                <div className="text-blue-700 font-semibold text-sm sm:text-lg">{formatCurrency(application.approvalTerms.monthlyPayment)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contract Preview */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Contract Preview</h2>
        
        {/* Mock Contract Display */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 bg-gray-50 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Sample Auto Loan Agreement</h3>
          <div className="bg-white rounded border border-gray-200 p-3 sm:p-6 text-left text-xs sm:text-sm w-full max-w-full mx-auto overflow-hidden">
            <div className="text-center mb-4">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base">AUTO LOAN AGREEMENT</h4>
              <p className="text-gray-600 text-xs sm:text-sm break-all">Contract #: {application.approvalTerms?.approvalId}</p>
            </div>
            
            <div className="space-y-2 sm:space-y-3 text-gray-700">
              <p className="break-words"><strong>BORROWER:</strong> {application.firstName} {application.lastName}</p>
              <p><strong>LENDER:</strong> Westlake Financial Services</p>
              {application.selectedVehicle && (
                <p className="break-words"><strong>VEHICLE:</strong> {application.selectedVehicle.year} {application.selectedVehicle.make} {application.selectedVehicle.model}</p>
              )}
              {application.approvalTerms && (
                <>
                  <p><strong>LOAN AMOUNT:</strong> {formatCurrency(application.approvalTerms.loanAmount)}</p>
                  <p><strong>ANNUAL PERCENTAGE RATE:</strong> {application.approvalTerms.interestRate}%</p>
                  <p><strong>TERM:</strong> {application.approvalTerms.termLength} months</p>
                  <p><strong>MONTHLY PAYMENT:</strong> {formatCurrency(application.approvalTerms.monthlyPayment)}</p>
                </>
              )}
            </div>
            
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-xs text-gray-500">
              <p>This is a sample contract preview. The actual contract will contain complete terms and conditions, payment schedules, and legal disclosures as required by federal and state law.</p>
            </div>
            
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">BORROWER SIGNATURE</p>
                  <div className="border-b border-gray-400 w-full max-w-48 mt-2 sm:mt-4"></div>
                  <p className="text-xs text-gray-500 mt-1">Date: ___________</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">LENDER REPRESENTATIVE</p>
                  <div className="border-b border-gray-400 w-full max-w-48 mt-2 sm:mt-4"></div>
                  <p className="text-xs text-gray-500 mt-1">Date: ___________</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-500 mt-4 text-xs sm:text-sm">
            📄 This is a simplified preview. The full contract contains additional terms and conditions.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Contract Status & Next Steps</h2>
        
        {/* Contract Already Signed */}
        {application.status === 'contract-signed' && (
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg mb-6">
              <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-0 sm:mr-3 mb-2 sm:mb-0" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-800">Contract Signed Successfully!</h3>
                <p className="text-sm sm:text-base text-green-700">Your loan contract has been signed. Moving to delivery options...</p>
              </div>
            </div>
            
            <Link 
              href={`/delivery-options/${application.id}?token=${application.token}`}
              className="inline-flex items-center bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <TruckIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Continue to Delivery Options
            </Link>
          </div>
        )}

        {/* Contract Sent for Signature */}
        {application.status === 'contract-sent' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <PaperAirplaneIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-0 sm:mr-3 mb-2 sm:mb-0" />
              <div>
                <h3 className="font-medium text-blue-800 text-sm sm:text-base">Contract Sent for E-Signature</h3>
                <p className="text-blue-700 text-xs sm:text-sm">Ready for your digital signature</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Sign Your Contract</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Review and digitally sign the contract to proceed to delivery options.
              </p>
              
              {showSigningAnimation ? (
                <div className="flex items-center justify-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="animate-pulse flex items-center">
                    <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-700 text-xs sm:text-sm font-medium">
                      Processing digital signature...
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSignNow}
                  disabled={isSigning}
                  className="w-full bg-green-600 text-white px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                >
                  {isSigning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Sign Now
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Contract Approved - Waiting for Admin to Send */}
        {application.status === 'approved' && (
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <PaperAirplaneIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-0 sm:mr-3 mb-2 sm:mb-0" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-800">Contract Ready</h3>
                <p className="text-sm sm:text-base text-blue-700">Your loan has been approved! An admin will send the contract for your signature shortly.</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-xs sm:text-sm">
              You will receive an email notification when the contract is ready for signing.
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Need help? Contact Westlake Financial at (888) 893-7937
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
            >
              ← Return to Home
            </Link>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link 
              href={`/portal/${application.id}?token=${application.token}`}
              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
            >
              Customer Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 