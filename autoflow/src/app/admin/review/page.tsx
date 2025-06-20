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
  console.log('Admin page loaded applications:', applications.map(a => ({ id: a.id, status: a.status, documentsCount: a.uploadedDocuments?.length || 0 })));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'documents-pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'documents-uploaded':
        return 'bg-indigo-100 text-indigo-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return '📝';
      case 'documents-pending':
        return '📄';
      case 'documents-uploaded':
        return '📋';
      case 'under-review':
        return '🔍';
      case 'approved':
        return '✅';
      case 'contract-sent':
        return '📤';
      case 'contract-signed':
        return '✍️';
      case 'awaiting-delivery':
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Review Dashboard</h1>
              <p className="text-gray-600">Review submitted credit applications and manage the approval process</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Go to Homepage"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Home
              </Link>
              <CleanupUploadsButton />
              <ClearAllButton applicationCount={applications.length} />
              <RefreshButton />
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-500">Applications will appear here once customers submit them.</p>
            <Link 
              href="/" 
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {app.firstName} {app.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">Application #{app.id}</p>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-2 capitalize">{app.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>📧 {app.email}</div>
                        <div>📱 {app.phone}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Employment Details</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><span className="font-medium">Income:</span> ${app.annualIncome}</div>
                        <div><span className="font-medium">Status:</span> {app.employmentStatus}</div>
                        <div><span className="font-medium">Employer:</span> {app.employer}</div>
                        <div><span className="font-medium">Job Title:</span> {app.jobTitle}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Vehicle Interest</h4>
                      {app.selectedVehicle ? (
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><span className="font-medium">Vehicle:</span> {app.selectedVehicle.year} {app.selectedVehicle.make} {app.selectedVehicle.model}</div>
                          <div><span className="font-medium">Price:</span> ${app.selectedVehicle.price.toLocaleString()}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No specific vehicle selected</div>
                      )}
                    </div>
                  </div>

                  {app.uploadedDocuments && app.uploadedDocuments.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Documents</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {app.uploadedDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{doc.originalName}</p>
                            </div>
                            <a 
                              href={`/api/files/${doc.filename}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-3 pb-3 border-b border-blue-200">
                          <div className="flex items-center space-x-3">
                            <Image 
                              src="/westlake-logo.png" 
                              alt="Westlake Financial Logo" 
                              width={40}
                              height={40}
                              className="w-10 h-10 object-contain"
                            />
                            <div>
                              <div className="font-bold text-blue-800 text-sm">Westlake Financial</div>
                              <div className="text-xs text-blue-600">Full Spectrum Auto Financing</div>
                            </div>
                          </div>
                          <div className="ml-auto">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              ✅ APPROVED
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-blue-800">Loan Amount:</span>
                            <div className="text-blue-700 font-semibold">${app.approvalTerms.loanAmount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="font-medium text-blue-800">Interest Rate:</span>
                            <div className="text-blue-700 font-semibold">{app.approvalTerms.interestRate}% APR</div>
                          </div>
                          <div>
                            <span className="font-medium text-blue-800">Term:</span>
                            <div className="text-blue-700 font-semibold">{app.approvalTerms.termLength} months</div>
                          </div>
                          <div>
                            <span className="font-medium text-blue-800">Monthly Payment:</span>
                            <div className="text-blue-700 font-semibold">${app.approvalTerms.monthlyPayment.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-blue-200">
                          <div className="flex justify-between items-center text-xs">
                            <div className="text-blue-600">
                              <span className="font-medium">Approval ID:</span> {app.approvalTerms.approvalId}
                            </div>
                            <div className="text-blue-600">
                              <span className="font-medium">Approved:</span> {formatDate(app.approvalTerms.approvedAt)}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-blue-600 flex items-center justify-between">
                            <span>📞 Westlake Support: (888) 893-7937</span>
                            <span className="text-blue-500">24/7/365 Instant Approvals</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* E-Contracting Details */}
                  {(app.status === 'contract-sent' || app.status === 'contract-signed' || app.status === 'awaiting-delivery') && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">E-Contracting Details</h4>
                      <div className="bg-gradient-to-r from-orange-50 to-emerald-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-bold text-sm">📄</span>
                            </div>
                            <div>
                              <div className="font-medium text-orange-800">Contract Status</div>
                              <div className="text-xs text-orange-600">Electronic Signature Process</div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            app.status === 'contract-sent' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {app.status === 'contract-sent' ? '📤 Sent for Signature' : '✍️ Signed'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-orange-800">Contract Type:</span>
                            <div className="text-orange-700">Auto Loan Agreement</div>
                          </div>
                          <div>
                            <span className="font-medium text-orange-800">E-Sign Platform:</span>
                            <div className="text-orange-700">DocuSign Integration</div>
                          </div>
                          {app.status !== 'contract-sent' && (
                            <>
                              <div>
                                <span className="font-medium text-orange-800">Signed Date:</span>
                                <div className="text-orange-700">
                                  {formatDate(new Date())} {/* This would be actual signing date in real app */}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-orange-800">IP Address:</span>
                                <div className="text-orange-700">192.168.1.100</div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-orange-200">
                          <div className="flex items-center justify-between text-xs">
                            <div className="text-orange-600">
                              <span className="font-medium">Contract ID:</span> CTR-{app.id}-{new Date().getFullYear()}
                            </div>
                            <Link
                              href={`/e-contracting/${app.id}`}
                              className="text-orange-600 hover:text-orange-800 font-medium"
                            >
                              View Contract →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Details */}
                  {app.status === 'awaiting-delivery' && app.deliveryChoice && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Details</h4>
                      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-teal-600 font-bold text-sm">🚚</span>
                            </div>
                            <div>
                              <div className="font-medium text-teal-800">
                                {app.deliveryChoice === 'pickup' ? 'Vehicle Pickup' : 'Home Delivery'}
                              </div>
                              <div className="text-xs text-teal-600">Customer Selected Option</div>
                            </div>
                          </div>
                          <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium">
                            🚚 Delivery Scheduled
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          {app.deliveryDetails?.scheduledDate && (
                            <div>
                              <span className="font-medium text-teal-800">Scheduled Date:</span>
                              <div className="text-teal-700">
                                {new Date(app.deliveryDetails.scheduledDate).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </div>
                          )}
                          {app.deliveryDetails?.scheduledTime && (
                            <div>
                              <span className="font-medium text-teal-800">Scheduled Time:</span>
                              <div className="text-teal-700">{app.deliveryDetails.scheduledTime}</div>
                            </div>
                          )}
                        </div>

                        {app.deliveryChoice === 'pickup' && (
                          <div className="bg-teal-100 rounded-lg p-3 mb-3">
                            <div className="font-medium text-teal-800 mb-2">Pickup Location</div>
                            <div className="text-sm text-teal-700 space-y-1">
                              <div><strong>AutoFlow Dealership</strong></div>
                              <div>456 Auto Drive, Los Angeles, CA 90028</div>
                              <div>📞 (555) 123-4567</div>
                              <div>🕒 Mon-Sat: 9AM-8PM, Sun: 10AM-6PM</div>
                            </div>
                          </div>
                        )}

                        {app.deliveryChoice === 'home-delivery' && app.deliveryDetails?.deliveryAddress && (
                          <div className="bg-teal-100 rounded-lg p-3 mb-3">
                            <div className="font-medium text-teal-800 mb-2">Delivery Address</div>
                            <div className="text-sm text-teal-700 whitespace-pre-line">
                              {app.deliveryDetails.deliveryAddress}
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-teal-200">
                          <div className="flex items-center justify-between text-xs">
                            <div className="text-teal-600">
                              <span className="font-medium">Delivery ID:</span> DEL-{app.id}-{new Date().getFullYear()}
                            </div>
                            <div className="text-teal-600">
                              <span className="font-medium">Status:</span> Preparation in Progress
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Submitted: {formatDate(app.submittedAt)}
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        href={`/portal/${app.id}?token=${app.token}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Portal
                      </Link>
                      {app.status === 'approved' && app.approvalTerms ? (
                        <SendContractButton applicationId={app.id} />
                      ) : app.status === 'contract-sent' ? (
                        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-md text-sm font-medium">
                          📤 E-Contract Sent - Awaiting Customer Signature
                        </div>
                      ) : app.status === 'contract-signed' ? (
                        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-md text-sm font-medium">
                          ✍️ Contract Signed - Ready for Delivery
                        </div>
                      ) : app.status === 'awaiting-delivery' ? (
                        <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-md text-sm font-medium">
                          🚚 Delivery Scheduled - Vehicle Preparation
                        </div>
                      ) : (
                        <ApprovalButton applicationId={app.id} status={app.status} />
                      )}
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