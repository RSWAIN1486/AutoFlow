'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, ArrowUpTrayIcon, EyeIcon } from '@heroicons/react/24/outline';

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'documents-pending':
        return 'Please upload your required documents to continue.';
      case 'documents-uploaded':
        return 'Your documents have been received and are being reviewed.';
      case 'under-review':
        return 'Your application is currently under review.';
      case 'approved':
        return 'Congratulations! Your application has been approved.';
      case 'contract-sent':
        return 'Your contract has been sent for e-signing.';
      case 'contract-signed':
        return 'Your contract has been signed successfully.';
      default:
        return 'Please check your application status.';
    }
  };

  const getNextAction = (status: string, searchResult: ApplicationData) => {
    switch (status) {
      case 'submitted':
      case 'documents-pending':
        return (
          <Link
            href={`/upload-documents/${searchResult.id}?token=${searchResult.token}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            Upload Documents
          </Link>
        );
      case 'documents-uploaded':
      case 'under-review':
        return (
          <Link
            href={`/portal/${searchResult.id}?token=${searchResult.token}`}
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
          >
            <EyeIcon className="h-5 w-5" />
            View Application Status
          </Link>
        );
      case 'approved':
        return (
          <Link
            href={`/e-contracting/${searchResult.id}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Continue to E-Contracting
          </Link>
        );
      case 'contract-sent':
        return (
          <Link
            href={`/e-contracting/${searchResult.id}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Sign Your Contract
          </Link>
        );
      case 'contract-signed':
        return (
          <Link
            href={`/delivery-options/${searchResult.id}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Choose Delivery Options
          </Link>
        );
      default:
        return (
          <Link
            href={`/portal/${searchResult.id}?token=${searchResult.token}`}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View Application Portal
          </Link>
        );
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
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-400 mr-2" />
                  <h4 className="text-xl font-semibold text-white">
                    Application Found!
                  </h4>
                </div>
                
                <div className="text-gray-300 mb-4">
                  <p><strong>Name:</strong> {searchResult.firstName} {searchResult.lastName}</p>
                  <p><strong>Status:</strong> <span className="capitalize">{searchResult.status.replace('-', ' ')}</span></p>
                  {searchResult.selectedVehicle && (
                    <p><strong>Vehicle:</strong> {searchResult.selectedVehicle.year} {searchResult.selectedVehicle.make} {searchResult.selectedVehicle.model}</p>
                  )}
                </div>

                {searchResult.status === 'approved' && searchResult.approvalTerms ? (
                  <div className="space-y-3">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                      <h5 className="text-green-400 font-semibold mb-2">🎉 Congratulations! Your loan is approved!</h5>
                      <div className="text-sm text-gray-300 grid grid-cols-2 gap-2">
                        <div>Loan Amount: <strong>${searchResult.approvalTerms.loanAmount.toLocaleString()}</strong></div>
                        <div>Monthly Payment: <strong>${searchResult.approvalTerms.monthlyPayment.toLocaleString()}</strong></div>
                        <div>Interest Rate: <strong>{searchResult.approvalTerms.interestRate}% APR</strong></div>
                        <div>Term: <strong>{searchResult.approvalTerms.termLength} months</strong></div>
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getNextAction(searchResult.status, searchResult)}
                    </motion.div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-300 mb-4">
                      {getStatusMessage(searchResult.status)}
                    </p>
                    <div className="mt-3">
                      {getNextAction(searchResult.status, searchResult)}
                    </div>
                  </div>
                )}
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
          Don't have an application yet?
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