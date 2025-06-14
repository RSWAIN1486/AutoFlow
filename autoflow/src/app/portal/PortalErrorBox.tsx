'use client';
import Link from 'next/link';

export default function PortalErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid or Expired Link</h1>
      <p className="text-gray-700 mb-4">{message}</p>
      <button onClick={() => window.history.back()} className="text-blue-600 hover:underline mb-2">Back</button>
      <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
    </div>
  );
} 