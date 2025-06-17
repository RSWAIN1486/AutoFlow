import { getAllApplications } from '@/lib/applicationStore';
import Link from 'next/link';

export default async function PortalPage({ params, searchParams }: { params: Promise<{ appId: string }>, searchParams: Promise<{ token?: string }> }) {
  const { appId } = await params;
  const { token } = await searchParams;
  const applications = getAllApplications();
  const app = applications.find(a => String(a.id) === appId && a.token === token);

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-700 mb-4">The portal link is invalid or has expired. Please check your link or contact support.</p>
          <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {app.firstName}!</h1>
        <p className="text-lg text-gray-700 mb-4">This is your customer portal. Here you can view your application status and next steps.</p>
        <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Summary</h2>
          <div className="text-sm text-gray-800 space-y-1">
            <div><span className="font-medium">Application ID:</span> <span className="font-mono">{app.id}</span></div>
            <div><span className="font-medium">Name:</span> {app.firstName} {app.lastName}</div>
            <div><span className="font-medium">Email:</span> {app.email}</div>
            <div><span className="font-medium">Phone:</span> {app.phone}</div>
            <div><span className="font-medium">Status:</span> {app.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
          </div>
        </div>
        {(app.status === 'documents-pending' || app.status === 'submitted') && (
          <Link href={`/upload-documents/${app.id}?token=${app.token}`} className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Upload Required Documents
          </Link>
        )}
        {app.status === 'documents-uploaded' && (
          <div className="mt-2 text-green-600 font-medium">✅ Documents uploaded successfully</div>
        )}
        {app.uploadedDocuments && app.uploadedDocuments.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">Uploaded Documents:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {app.uploadedDocuments.map((doc, index) => (
                <li key={index}>• {doc.fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {doc.originalName}</li>
              ))}
            </ul>
          </div>
        )}
        <Link href="/" className="mt-4 text-blue-600 hover:underline">Return to Home</Link>
      </div>
    </div>
  );
} 