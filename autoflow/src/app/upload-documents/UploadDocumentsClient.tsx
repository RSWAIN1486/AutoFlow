'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function UploadDocumentsClient({ app }: { app: any }) {
  const [files, setFiles] = useState({
    driversLicense: null as File | null,
    proofOfIncome: null as File | null,
    proofOfResidence: null as File | null,
    insuranceInfo: null as File | null,
    tradeInInfo: null as File | null,
  });

  const handleFileChange = (field: keyof typeof files, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center w-full max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Required Documents</h1>
      <p className="text-lg text-gray-700 mb-4">Hi {app.firstName}, please upload the required documents to complete your application.</p>
      <form className="w-full space-y-6">
        <div>
          <label className="block font-medium text-gray-800 mb-1">Driver's License</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('driversLicense', e.target.files?.[0] || null)} />
          {files.driversLicense && <div className="text-xs text-gray-600 mt-1">Selected: {files.driversLicense.name}</div>}
        </div>
        <div>
          <label className="block font-medium text-gray-800 mb-1">Proof of Income</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('proofOfIncome', e.target.files?.[0] || null)} />
          {files.proofOfIncome && <div className="text-xs text-gray-600 mt-1">Selected: {files.proofOfIncome.name}</div>}
        </div>
        <div>
          <label className="block font-medium text-gray-800 mb-1">Proof of Residence</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('proofOfResidence', e.target.files?.[0] || null)} />
          {files.proofOfResidence && <div className="text-xs text-gray-600 mt-1">Selected: {files.proofOfResidence.name}</div>}
        </div>
        <div>
          <label className="block font-medium text-gray-800 mb-1">Insurance Info</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('insuranceInfo', e.target.files?.[0] || null)} />
          {files.insuranceInfo && <div className="text-xs text-gray-600 mt-1">Selected: {files.insuranceInfo.name}</div>}
        </div>
        <div>
          <label className="block font-medium text-gray-800 mb-1">Trade-in Info (optional)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileChange('tradeInInfo', e.target.files?.[0] || null)} />
          {files.tradeInInfo && <div className="text-xs text-gray-600 mt-1">Selected: {files.tradeInInfo.name}</div>}
        </div>
        <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">Submit Documents</button>
      </form>
      <Link href={`/portal/${app.id}?token=${app.token}`} className="mt-6 text-blue-600 hover:underline">Back to Portal</Link>
      <Link href="/" className="mt-2 text-blue-600 hover:underline">Return to Home</Link>
    </div>
  );
} 