import { Suspense } from 'react';
import Link from 'next/link';
import { getApplication } from '@/lib/applicationStore';
import UploadDocumentsClient from './UploadDocumentsClient';

interface PageProps {
  searchParams: Promise<{ appId?: string }>;
}

function UploadDocumentsContent({ appId }: { appId: string }) {
  const application = getApplication(parseInt(appId));

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-red-600 mb-4">Application not found.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const appData = {
    id: application.id,
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,
    token: 'upload-token'
  };

  return <UploadDocumentsClient app={appData} />;
}

export default async function UploadDocumentsPage({ searchParams }: PageProps) {
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
            <UploadDocumentsContent appId={appId} />
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