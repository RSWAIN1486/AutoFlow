import { Suspense } from 'react';
import Link from 'next/link';
import { getApplication } from '@/lib/applicationStore';
import { CheckCircleIcon, DocumentCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PageProps {
  searchParams: Promise<{ appId?: string }>;
}

function DocumentsSubmittedContent({ appId }: { appId: string }) {
  const application = getApplication(parseInt(appId));

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">Application not found.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Documents Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you, {application.firstName}! Your documents have been received and are being reviewed.
          </p>

          {/* Status Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <DocumentCheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Documents Received</p>
                  <p className="text-sm text-gray-600">Your documents have been uploaded successfully</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Under Review</p>
                  <p className="text-sm text-gray-600">Our team will review your documents within 24-48 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Final Approval</p>
                  <p className="text-sm text-gray-600">You'll receive an email with the final decision</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Keep your phone available - we may call for verification</li>
              <li>• Check your email regularly for updates</li>
              <li>• If approved, we'll schedule a vehicle inspection</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              href="/inventory"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Browse More Vehicles
            </Link>
          </div>

          {/* Application Reference */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Application ID:</span> {application.id}
            </p>
            <p className="text-sm text-gray-600">
              Questions? Contact us at{' '}
              <a href="tel:555-0123" className="text-blue-600 hover:underline">
                (555) 012-3456
              </a>{' '}
              or{' '}
              <a href="mailto:support@autoflow.com" className="text-blue-600 hover:underline">
                support@autoflow.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DocumentsSubmittedPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const appId = resolvedSearchParams.appId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        }>
          {appId ? (
            <DocumentsSubmittedContent appId={appId} />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-red-600 mb-4">No application ID provided.</p>
              <Link href="/" className="text-blue-600 hover:underline">
                Return to Home
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
} 