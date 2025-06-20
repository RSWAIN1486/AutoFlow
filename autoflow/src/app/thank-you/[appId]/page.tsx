import { Suspense } from 'react';
import Link from 'next/link';
import { getApplication } from '@/lib/applicationStore';

interface PageProps {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ token?: string }>;
}

function ThankYouContent({ appId, token }: { appId: string; token?: string }) {
  const application = getApplication(parseInt(appId));

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-red-600 mb-4">Application not found.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const deliveryOptionText = application.deliveryChoice === 'pickup' 
    ? 'Vehicle Pickup' 
    : application.deliveryChoice === 'home-delivery' 
    ? 'Home Delivery' 
    : 'your selected delivery method';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Generate PDF download URL
  const pdfDownloadUrl = `/api/generate-pdf?appId=${appId}${token ? `&token=${token}` : ''}`;

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Your vehicle financing application has been completed successfully.
        </p>

        {/* Application Summary */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8 text-left">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Application Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Application ID</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base">{application.id}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Applicant</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{application.firstName} {application.lastName}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{application.email}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Delivery Method</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base">{deliveryOptionText}</p>
            </div>
            {application.approvalTerms && (
              <>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Loan Amount</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">${application.approvalTerms.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Monthly Payment</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">${application.approvalTerms.monthlyPayment.toFixed(2)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delivery Details */}
        {application.deliveryDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-8 text-left">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">
              {application.deliveryChoice === 'pickup' ? 'Pickup' : 'Delivery'} Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {application.deliveryDetails.scheduledDate && (
                <div>
                  <p className="text-xs sm:text-sm text-blue-600">Scheduled Date</p>
                  <p className="font-medium text-blue-900 text-sm sm:text-base">
                    {formatDate(application.deliveryDetails.scheduledDate)}
                  </p>
                </div>
              )}
              {application.deliveryDetails.scheduledTime && (
                <div>
                  <p className="text-xs sm:text-sm text-blue-600">Scheduled Time</p>
                  <p className="font-medium text-blue-900 text-sm sm:text-base">{application.deliveryDetails.scheduledTime}</p>
                </div>
              )}
              {application.deliveryChoice === 'pickup' && (
                <div className="sm:col-span-2">
                  <p className="text-xs sm:text-sm text-blue-600">Pickup Location</p>
                  <p className="font-medium text-blue-900 text-sm sm:text-base">AutoFlow Dealership</p>
                  <p className="text-xs sm:text-sm text-blue-700">456 Auto Drive, Los Angeles, CA 90028</p>
                  <p className="text-xs sm:text-sm text-blue-700">Phone: (555) 123-4567</p>
                </div>
              )}
              {application.deliveryChoice === 'home-delivery' && application.deliveryDetails.deliveryAddress && (
                <div className="sm:col-span-2">
                  <p className="text-xs sm:text-sm text-blue-600">Delivery Address</p>
                  <p className="font-medium text-blue-900 whitespace-pre-line text-sm sm:text-base">
                    {application.deliveryDetails.deliveryAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-8 text-left">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3">What&apos;s Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-3 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900 text-sm sm:text-base">Vehicle Preparation</p>
                <p className="text-xs sm:text-sm text-blue-700">Your vehicle is being prepared and will be ready soon.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-3 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-blue-900 text-sm sm:text-base">Contact from Our Team</p>
                <p className="text-xs sm:text-sm text-blue-700">
                  We will contact you within 1-2 business days to coordinate your {deliveryOptionText.toLowerCase()}.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-3 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-blue-900 text-sm sm:text-base">Final Documentation</p>
                <p className="text-xs sm:text-sm text-blue-700">
                  Complete any remaining paperwork and receive your vehicle keys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Documents */}
        <div className="mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Your Documents</h3>
          <a 
            href={pdfDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Complete Loan Documentation
          </a>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            This PDF contains all your application details, loan terms, and contract information.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            If you have any questions about your application or the delivery process, please contact us:
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm sm:text-base text-gray-700">(555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm sm:text-base text-gray-700">support@autoflow.com</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
          >
            ← Return to Home
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link 
            href={`/portal/${application.id}?token=${application.token}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
          >
            Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ThankYouPage({ params, searchParams }: PageProps) {
  const { appId } = await params;
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        }>
          <ThankYouContent appId={appId} token={token} />
        </Suspense>
      </div>
    </div>
  );
} 