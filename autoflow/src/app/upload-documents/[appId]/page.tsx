import { applications } from '@/lib/applicationStore';
import Link from 'next/link';
import UploadDocumentsClient from '../UploadDocumentsClient';

export default async function UploadDocumentsPage({ params, searchParams }: { params: Promise<{ appId: string }>, searchParams: Promise<{ token?: string }> }) {
  const { appId } = await params;
  const { token } = await searchParams;
  const app = applications.find(a => String(a.id) === appId && a.token === token);

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-700 mb-4">The upload link is invalid or has expired. Please check your link or contact support.</p>
          <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <UploadDocumentsClient app={app} />
    </div>
  );
} 