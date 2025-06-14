'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ApplicationSubmittedPage() {
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId');
  const token = searchParams.get('token');

  const portalLink = appId && token ? `/portal/${appId}?token=${token}` : '';
  const uploadLink = appId && token ? `/upload-documents/${appId}?token=${token}` : '';

  const [copied, setCopied] = useState<string | null>(null);
  const handleCopy = (link: string, label: string) => {
    navigator.clipboard.writeText(window.location.origin + link);
    setCopied(label);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
        <p className="text-lg text-gray-700 mb-4">Thank you for applying. Our team will review your application and contact you soon.</p>
        {appId && (
          <p className="text-sm text-gray-500 mb-4">Your Application ID: <span className="font-mono text-blue-700">{appId}</span></p>
        )}
        {portalLink && (
          <div className="mb-2 w-full flex items-center gap-2">
            <Link href={portalLink} className="text-blue-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
              Customer Portal
            </Link>
            <button
              onClick={() => handleCopy(portalLink, 'portal')}
              className="p-1 rounded hover:bg-blue-100"
              title="Copy Customer Portal Link"
            >
              <Copy className="h-4 w-4 text-blue-600" />
            </button>
            {copied === 'portal' && <span className="text-xs text-green-600 ml-1">Copied!</span>}
          </div>
        )}
        {uploadLink && (
          <div className="mb-2 w-full flex items-center gap-2">
            <Link href={uploadLink} className="text-blue-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
              Upload Documents
            </Link>
            <button
              onClick={() => handleCopy(uploadLink, 'upload')}
              className="p-1 rounded hover:bg-blue-100"
              title="Copy Upload Documents Link"
            >
              <Copy className="h-4 w-4 text-blue-600" />
            </button>
            {copied === 'upload' && <span className="text-xs text-green-600 ml-1">Copied!</span>}
          </div>
        )}
        <Link href="/" className="mt-4 text-blue-600 hover:underline">Return to Home</Link>
      </div>
    </div>
  );
} 