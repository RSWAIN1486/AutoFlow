import UploadDocumentsClient from './UploadDocumentsClient';

// Mock app data for general upload page
const mockApp = {
  id: 1,
  firstName: 'Valued',
  lastName: 'Customer',
  email: 'customer@example.com',
  phone: '555-0123',
  token: 'mock-token'
};

export default function UploadDocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <UploadDocumentsClient app={mockApp} />
      </div>
    </div>
  );
} 