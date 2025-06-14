import { applications } from '@/lib/applicationStore';
import Link from 'next/link';

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
      <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Required Documents</h1>
        <p className="text-lg text-gray-700 mb-4">Hi {app.firstName}, please upload the required documents to complete your application.</p>
        <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Upload (Coming Next)</h2>
          <ul className="list-disc pl-5 text-gray-800 text-sm">
            <li>Driver's License</li>
            <li>Proof of Income</li>
            <li>Proof of Residence</li>
            <li>Insurance Info</li>
            <li>Trade-in Info (optional)</li>
          </ul>
        </div>
        <Link href={`/portal/${app.id}?token=${app.token}`} className="mt-2 text-blue-600 hover:underline">Back to Portal</Link>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">Return to Home</Link>
      </div>
    </div>
  );
} 