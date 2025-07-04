'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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

interface UploadDocumentsClientProps {
  app: App;
}

export default function UploadDocumentsClient({ app }: UploadDocumentsClientProps) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<{
    driversLicense: UploadedFile | null;
    proofOfIncome: UploadedFile | null;
    proofOfResidence: UploadedFile | null;
    insuranceInfo: UploadedFile | null;
    tradeInInfo: UploadedFile | null;
  }>({
    driversLicense: null,
    proofOfIncome: null,
    proofOfResidence: null,
    insuranceInfo: null,
    tradeInInfo: null,
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
    
    try {
      // Create FormData with all uploaded files
      const formData = new FormData();
      
      // Add each uploaded file to FormData
      if (uploadedFiles.driversLicense) {
        formData.append('driversLicense', uploadedFiles.driversLicense.file);
      }
      if (uploadedFiles.proofOfIncome) {
        formData.append('proofOfIncome', uploadedFiles.proofOfIncome.file);
      }
      if (uploadedFiles.proofOfResidence) {
        formData.append('proofOfResidence', uploadedFiles.proofOfResidence.file);
      }
      if (uploadedFiles.insuranceInfo) {
        formData.append('insuranceInfo', uploadedFiles.insuranceInfo.file);
      }
      if (uploadedFiles.tradeInInfo) {
        formData.append('tradeInInfo', uploadedFiles.tradeInInfo.file);
      }
      
      // Add application ID for reference
      formData.append('appId', app.id.toString());
      console.log('Uploading documents for application ID:', app.id);
      
      // Upload files to the API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload documents');
      }
      
      const result = await response.json();
      console.log('Upload response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      console.log('✅ Upload successful, redirecting to success page');
      // Redirect to success page with application ID
      router.push(`/documents-submitted?appId=${app.id}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allDocumentsUploaded = uploadedFiles.driversLicense && 
                               uploadedFiles.proofOfIncome && 
                               uploadedFiles.proofOfResidence &&
                               uploadedFiles.insuranceInfo;

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

        <FileUploadArea
          documentType="insuranceInfo"
          title="Insurance Information"
          description="Current auto insurance policy or proof of insurance"
        />

        <FileUploadArea
          documentType="tradeInInfo"
          title="Trade-in Information (Optional)"
          description="Vehicle title, registration, or trade-in documentation"
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
            Please upload all required documents to continue (Trade-in info is optional)
          </p>
        )}
        
        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 