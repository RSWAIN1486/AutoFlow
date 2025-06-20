import Link from 'next/link';
import Image from 'next/image';
import { getAllApplications } from '@/lib/applicationStore';
import { DocumentTextIcon, HomeIcon } from '@heroicons/react/24/outline';
import ApprovalButton from './ApprovalButton';
import RefreshButton from './RefreshButton';
import SendContractButton from './SendContractButton';
import ClearAllButton from './ClearAllButton';
import CleanupUploadsButton from './CleanupUploadsButton';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default function AdminReviewPage() {
  const applications = getAllApplications();
  console.log('Admin page loaded applications:', applications.map(a => ({ id: a.id, status: a.status })));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'documents-uploaded':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'contract-sent':
        return 'bg-purple-100 text-purple-800';
      case 'signed':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return '📝';
      case 'documents-uploaded':
        return '📄';
      case 'approved':
        return '✅';
      case 'contract-sent':
        return '📧';
      case 'signed':
        return '✍️';
      case 'delivered':
        return '🚚';
      case 'rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Review Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Review submitted credit applications and manage the approval process</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Go to Homepage"
              >
                <HomeIcon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
                <span className="sm:hidden">🏠</span>
              </Link>
              <CleanupUploadsButton />
              <ClearAllButton applicationCount={applications.length} />
              <RefreshButton />
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <DocumentTextIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">Applications will appear here once customers submit them.</p>
            <Link 
              href="/" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Go to Homepage
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                        {app.firstName} {app.lastName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">Application #{app.id}</p>
                    </div>
                    <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(app.status)} self-start`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1 sm:ml-2 capitalize">{app.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <div className="break-all">📧 {app.email}</div>
                        <div>📱 {app.phone}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Employment Details</h4>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <div><span className="font-medium">Income:</span> ${app.annualIncome}</div>
                        <div><span className="font-medium">Status:</span> {app.employmentStatus}</div>
                        <div><span className="font-medium">Employer:</span> <span className="break-words">{app.employer}</span></div>
                        <div><span className="font-medium">Job Title:</span> <span className="break-words">{app.jobTitle}</span></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Vehicle Interest</h4>
                      {app.selectedVehicle ? (
                        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                          <div><span className="font-medium">Vehicle:</span> {app.selectedVehicle.year} {app.selectedVehicle.make} {app.selectedVehicle.model}</div>
                          <div><span className="font-medium">Price:</span> ${app.selectedVehicle.price.toLocaleString()}</div>
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm text-gray-500">No specific vehicle selected</div>
                      )}
                    </div>
                  </div>

                  {app.uploadedDocuments && app.uploadedDocuments.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Documents</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {app.uploadedDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <DocumentTextIcon className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {doc.fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{doc.originalName}</p>
                            </div>
                            <a 
                              href={`/api/files/${doc.filename}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex-shrink-0"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.approvalTerms && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Lender Approval Terms</h4>
                      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-3 pb-3 border-b border-blue-200 space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Image 
                              src="/westlake-logo.png" 
                              alt="Westlake Financial Logo" 
                              width={32} 
                              height={32} 
                              className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                            <div>
                              <h5 className="font-semibold text-emerald-800 text-sm sm:text-base">Approved by Westlake Financial</h5>
                              <p className="text-xs sm:text-sm text-emerald-600">Approval ID: {app.approvalTerms.approvalId}</p>
                            </div>
                          </div>
                          <div className="sm:ml-auto text-xs sm:text-sm text-emerald-600">
                            {formatDate(new Date(app.approvalTerms.approvedAt))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-emerald-800">Loan Amount</span>
                            <div className="text-sm sm:text-lg font-bold text-emerald-700">${app.approvalTerms.loanAmount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-emerald-800">Monthly Payment</span>
                            <div className="text-sm sm:text-lg font-bold text-emerald-700">${app.approvalTerms.monthlyPayment.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-emerald-800">Interest Rate</span>
                            <div className="text-sm sm:text-lg font-bold text-emerald-700">{app.approvalTerms.interestRate}% APR</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-emerald-800">Term</span>
                            <div className="text-sm sm:text-lg font-bold text-emerald-700">{app.approvalTerms.termLength} months</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                    {app.status === 'documents-uploaded' && (
                      <ApprovalButton applicationId={app.id} status={app.status} />
                    )}
                    
                    {app.status === 'approved' && (
                      <SendContractButton applicationId={app.id} />
                    )}
                    
                    <div className="text-xs sm:text-sm text-gray-500 sm:ml-auto self-center">
                      Submitted: {formatDate(new Date(app.submittedAt))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}