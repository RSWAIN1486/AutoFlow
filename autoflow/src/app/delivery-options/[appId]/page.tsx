import { Suspense } from 'react';
import Link from 'next/link';
import { getApplication } from '@/lib/applicationStore';
import DeliveryOptionsClient from './DeliveryOptionsClient';

interface PageProps {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ token?: string }>;
}

function DeliveryOptionsContent({ appId }: { appId: string; token?: string }) {
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

  // Check if contract is signed
  if (application.status !== 'contract-signed') {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-yellow-600 mb-4">Contract must be signed before selecting delivery options.</p>
          <p className="text-gray-600 mb-4">Current status: {application.status}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return <DeliveryOptionsClient application={application} />;
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