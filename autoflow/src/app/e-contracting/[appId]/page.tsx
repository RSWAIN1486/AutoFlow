import Link from 'next/link';
import { getApplication } from '@/lib/applicationStore';
import EContractingClient from './EContractingClient';

interface PageProps {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ token?: string }>;
}

async function EContractingContent({ appId }: { appId: string; token?: string }) {
  // Force server-side rendering by getting the application on the server
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

  // Check if application is ready for e-contracting
  if (!['approved', 'contract-sent', 'contract-signed'].includes(application.status) || !application.approvalTerms) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-yellow-600 mb-4">This application must be approved before accessing e-contracting.</p>
          <p className="text-gray-600 mb-4">Current status: {application.status}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return <EContractingClient application={application} />;
}

export default async function EContractingPage({ params, searchParams }: PageProps) {
  const { appId } = await params;
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <EContractingContent appId={appId} token={token} />
      </div>
    </div>
  );
} 