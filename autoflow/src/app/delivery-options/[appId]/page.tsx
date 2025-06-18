import { Suspense } from 'react';
import Link from 'next/link';
import { getApplication } from '@/lib/applicationStore';

interface PageProps {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ token?: string }>;
}

function DeliveryOptionsContent({ appId, token }: { appId: string; token?: string }) {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Delivery Option</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Congratulations! Your contract has been signed. Now choose how you'd like to receive your vehicle.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Contract Signed Successfully!
                </p>
                <p className="text-sm text-green-700">
                  Application ID: {application.id} | {application.firstName} {application.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pick up option */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pick Up Vehicle</h3>
              <p className="text-sm text-gray-600 mb-4">
                Visit our dealership to pick up your vehicle at your convenience.
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Schedule Pickup
              </button>
            </div>
          </div>

          {/* Home delivery option */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Delivery</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have your vehicle delivered directly to your home address.
              </p>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Schedule Delivery
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            <strong>Note:</strong> This is a placeholder page for Task 11. Full delivery options functionality will be implemented later.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href={`/e-contracting/${application.id}?token=${application.token}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to E-Contracting
            </Link>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DeliveryOptionsPage({ params, searchParams }: PageProps) {
  const { appId } = await params;
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading delivery options...</p>
          </div>
        }>
          <DeliveryOptionsContent appId={appId} token={token} />
        </Suspense>
      </div>
    </div>
  );
} 