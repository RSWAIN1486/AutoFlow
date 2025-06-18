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

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your vehicle financing application has been completed successfully.
        </p>

        {/* Application Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Application ID</p>
              <p className="font-medium text-gray-900">{application.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Applicant</p>
              <p className="font-medium text-gray-900">{application.firstName} {application.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{application.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivery Method</p>
              <p className="font-medium text-gray-900">{deliveryOptionText}</p>
            </div>
            {application.approvalTerms && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Loan Amount</p>
                  <p className="font-medium text-gray-900">${application.approvalTerms.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="font-medium text-gray-900">${application.approvalTerms.monthlyPayment.toFixed(2)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delivery Details */}
        {application.deliveryDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              {application.deliveryChoice === 'pickup' ? 'Pickup' : 'Delivery'} Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.deliveryDetails.scheduledDate && (
                <div>
                  <p className="text-sm text-blue-600">Scheduled Date</p>
                  <p className="font-medium text-blue-900">
                    {formatDate(application.deliveryDetails.scheduledDate)}
                  </p>
                </div>
              )}
              {application.deliveryDetails.scheduledTime && (
                <div>
                  <p className="text-sm text-blue-600">Scheduled Time</p>
                  <p className="font-medium text-blue-900">{application.deliveryDetails.scheduledTime}</p>
                </div>
              )}
              {application.deliveryChoice === 'pickup' && (
                <div className="md:col-span-2">
                  <p className="text-sm text-blue-600">Pickup Location</p>
                  <p className="font-medium text-blue-900">AutoFlow Dealership</p>
                  <p className="text-sm text-blue-700">456 Auto Drive, Los Angeles, CA 90028</p>
                  <p className="text-sm text-blue-700">Phone: (555) 123-4567</p>
                </div>
              )}
              {application.deliveryChoice === 'home-delivery' && application.deliveryDetails.deliveryAddress && (
                <div className="md:col-span-2">
                  <p className="text-sm text-blue-600">Delivery Address</p>
                  <p className="font-medium text-blue-900 whitespace-pre-line">
                    {application.deliveryDetails.deliveryAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900">Vehicle Preparation</p>
                <p className="text-sm text-blue-700">Your vehicle is being prepared and will be ready soon.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-blue-900">Contact from Our Team</p>
                <p className="text-sm text-blue-700">
                  We will contact you within 1-2 business days to coordinate your {deliveryOptionText.toLowerCase()}.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-blue-900">Final Documentation</p>
                <p className="text-sm text-blue-700">
                  Complete any remaining paperwork and receive your vehicle keys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Documents */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Documents</h3>
          <a 
            href="#" 
            download
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Signed Documents (Mock)
          </a>
          <p className="text-sm text-gray-500 mt-2">
            This is a placeholder download link for demo purposes.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-3">
            If you have any questions about your application or the delivery process, please contact us:
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-700">(555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">support@autoflow.com</span>
            </div>
          </div>
        </div>

        {/* Return to Home */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Home
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        }>
          <ThankYouContent appId={appId} token={token} />
        </Suspense>
      </div>
    </div>
  );
} 