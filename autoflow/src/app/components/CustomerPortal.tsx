'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircleIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ApplicationData {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  selectedVehicle?: {
    year: number;
    make: string;
    model: string;
  };
  token: string;
  approvalTerms?: {
    loanAmount: number;
    interestRate: number;
    termLength: number;
    monthlyPayment: number;
  };
  uploadedDocuments: number;
}

export default function CustomerPortal() {
  const [applicationId, setApplicationId] = useState('');
  const [searchResult, setSearchResult] = useState<ApplicationData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusDisplayColor = (status: string) => {
    switch (status) {
      case 'documents-pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'documents-uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'under-review':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'contract-sent':
        return 'bg-orange-100 text-orange-800';
      case 'contract-signed':
        return 'bg-emerald-100 text-emerald-800';
      case 'awaiting-delivery':
        return 'bg-teal-100 text-teal-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'documents-pending':
        return 'Documents Pending';
      case 'documents-uploaded':
        return 'Under Review';
      case 'under-review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'contract-sent':
        return 'E-Sign Pending';
      case 'contract-signed':
        return 'Contract Signed';
      case 'awaiting-delivery':
        return 'Awaiting Delivery';
      case 'rejected':
        return 'Not Approved';
      default:
        return 'In Process';
    }
  };

  const handleSearch = async () => {
    if (!applicationId.trim()) return;
    
    setIsSearching(true);
    setShowResult(false);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/search?id=${encodeURIComponent(applicationId.trim())}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResult(data.application);
      } else {
        setSearchResult(null);
        setError(data.error || 'Application not found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResult(null);
      setError('Failed to search for application. Please try again.');
    } finally {
      setShowResult(true);
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };



  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2">
          Access Your Application
        </h3>
        <p className="text-gray-300">
          Enter your application ID to check status and continue your application process
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Application ID (e.g., 1750255028667)"
            className="flex-1 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={isSearching || !applicationId.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5" />
            )}
            {isSearching ? 'Searching...' : 'Search'}
          </motion.button>
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {searchResult ? (
              <div className="bg-slate-600 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-3">
                  <CheckCircleIcon className="h-8 w-8 text-green-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Application Found!</h3>
                </div>
                
                <div className="space-y-2 text-sm text-slate-200 mb-4">
                  <p><span className="font-semibold text-white">Name:</span> {searchResult.firstName} {searchResult.lastName}</p>
                  <p><span className="font-semibold text-white">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusDisplayColor(searchResult.status)}`}>
                      {getStatusDisplayText(searchResult.status)}
                    </span>
                  </p>
                  {searchResult.selectedVehicle && (
                    <p><span className="font-semibold text-white">Vehicle:</span> {searchResult.selectedVehicle.year} {searchResult.selectedVehicle.make} {searchResult.selectedVehicle.model}</p>
                  )}
                </div>

                {searchResult.status === 'approved' && searchResult.approvalTerms && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="text-green-600 text-lg">🎉</div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-blue-800">Congratulations! Your loan is approved!</h4>
                        <p className="text-sm text-blue-600">Approved by Westlake Financial</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium text-blue-800">Loan Amount:</span>
                        <div className="text-blue-700 font-semibold">${searchResult.approvalTerms.loanAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Monthly Payment:</span>
                        <div className="text-blue-700 font-semibold">${searchResult.approvalTerms.monthlyPayment.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Interest Rate:</span>
                        <div className="text-blue-700 font-semibold">{searchResult.approvalTerms.interestRate}% APR</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Term:</span>
                        <div className="text-blue-700 font-semibold">{searchResult.approvalTerms.termLength} months</div>
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 bg-blue-100 rounded p-3">
                      <p><strong>Next Step:</strong> Please wait for our team to prepare your e-contracting documents. You will be notified when they are ready for your signature.</p>
                      <p className="mt-1 text-xs">Expected timeline: 1-2 business hours</p>
                    </div>
                  </div>
                )}

                {searchResult.status === 'contract-sent' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="text-orange-600 text-lg">📤</div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-orange-800">E-Contract Ready for Signature!</h4>
                        <p className="text-sm text-orange-600">Your loan documents are ready to be signed</p>
                      </div>
                    </div>
                    <div className="text-sm text-orange-700">
                      <p>Your e-contracting documents have been prepared and are ready for your digital signature.</p>
                    </div>
                  </div>
                )}

                {searchResult.status === 'contract-signed' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="text-emerald-600 text-lg">✍️</div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-emerald-800">Contract Signed Successfully!</h4>
                        <p className="text-sm text-emerald-600">Moving to delivery options</p>
                      </div>
                    </div>
                    <div className="text-sm text-emerald-700">
                      <p>Your loan contract has been signed. Next step is to arrange vehicle delivery.</p>
                    </div>
                  </div>
                )}

                {searchResult.status === 'awaiting-delivery' && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="text-teal-600 text-lg">🚚</div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-teal-800">Delivery Arranged!</h4>
                        <p className="text-sm text-teal-600">Your vehicle delivery has been scheduled</p>
                      </div>
                    </div>
                    <div className="text-sm text-teal-700">
                      <p>Your delivery options have been confirmed. Our team will contact you with final delivery details.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {searchResult.status === 'documents-pending' && (
                    <Link
                      href={`/upload-documents/${searchResult.id}?token=${searchResult.token}`}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      📄 Continue - Upload Documents
                    </Link>
                  )}

                  {searchResult.status === 'documents-uploaded' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      <p className="text-yellow-800 font-medium">Documents Uploaded Successfully</p>
                      <p className="text-yellow-600 text-sm">Under review by our lenders</p>
                    </div>
                  )}

                  {searchResult.status === 'under-review' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                      <p className="text-purple-800 font-medium">Application Under Review</p>
                      <p className="text-purple-600 text-sm">We will notify you once approved</p>
                    </div>
                  )}

                  {searchResult.status === 'contract-sent' && (
                    <Link
                      href={`/e-contracting/${searchResult.id}`}
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      ✍️ Continue to E-Contracting
                    </Link>
                  )}

                  {searchResult.status === 'contract-signed' && (
                    <Link
                      href={`/delivery-options/${searchResult.id}`}
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      🚚 Continue to Delivery Options
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-400 mr-2" />
                  <h4 className="text-xl font-semibold text-white">
                    Application Not Found
                  </h4>
                </div>
                <p className="text-gray-300 mb-4">
                  {error || `No application found with ID "${applicationId}". Please check your application ID and try again.`}
                </p>
                <p className="text-sm text-gray-400">
                  Need help? Contact our support team or visit your email for your application details.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/20 text-center">
        <p className="text-sm text-gray-400 mb-2">
          Do not have an application yet?
        </p>
        <Link
          href="/apply"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Start Your Application →
        </Link>
      </div>
    </div>
  );
} 