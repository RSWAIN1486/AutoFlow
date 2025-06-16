'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Define the App type for the application object
interface App {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  token: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

export default function UploadDocumentsClient({ app }: UploadDocumentsClientProps) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<{
    driversLicense: UploadedFile | null;
    proofOfIncome: UploadedFile | null;
    proofOfResidence: UploadedFile | null;
  }>({
    driversLicense: null,
    proofOfIncome: null,
    proofOfResidence: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (documentType: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }
    }));
  };

  const handleSubmitDocuments = async () => {
    setIsSubmitting(true);
    
    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to success page
    router.push('/documents-submitted');
    setIsSubmitting(false);
  };

  const allDocumentsUploaded = uploadedFiles.driversLicense && 
                               uploadedFiles.proofOfIncome && 
                               uploadedFiles.proofOfResidence;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const FileUploadArea = ({ 
    documentType, 
    title, 
    description 
  }: { 
    documentType: keyof typeof uploadedFiles;
    title: string;
    description: string;
  }) => {
    const uploadedFile = uploadedFiles[documentType];

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
        <div className="text-center">
          {uploadedFile ? (
            <div className="space-y-3">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
              </div>
              <button
                onClick={() => document.getElementById(`${documentType}-input`)?.click()}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Replace file
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              </div>
              <button
                onClick={() => document.getElementById(`${documentType}-input`)?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
          
          <input
            id={`${documentType}-input`}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(documentType, file);
              }
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">
          Hi {app.firstName}! Please upload the required documents to complete your application.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <FileUploadArea
          documentType="driversLicense"
          title="Driver's License"
          description="Upload a clear photo of your driver's license (front and back)"
        />

        <FileUploadArea
          documentType="proofOfIncome"
          title="Proof of Income"
          description="Recent pay stubs, tax returns, or employment letter"
        />

        <FileUploadArea
          documentType="proofOfResidence"
          title="Proof of Residence"
          description="Utility bill, lease agreement, or bank statement with your address"
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleSubmitDocuments}
            disabled={!allDocumentsUploaded || isSubmitting}
            className={`px-8 py-2 rounded-md font-medium transition-colors ${
              allDocumentsUploaded && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Documents'}
          </button>
        </div>
        
        {!allDocumentsUploaded && (
          <p className="text-sm text-gray-500 mt-2 text-right">
            Please upload all required documents to continue
          </p>
        )}
      </div>
    </div>
  );
} 