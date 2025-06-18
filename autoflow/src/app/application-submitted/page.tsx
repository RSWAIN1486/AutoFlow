import { Suspense } from 'react';
import Link from 'next/link';
import { getApplication } from '@/lib/applicationStore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface PageProps {
  searchParams: Promise<{ appId?: string; token?: string }>;
}

function ApplicationDetails({ appId, token }: { appId: string; token?: string }) {
  const application = getApplication(parseInt(appId));

  if (!application) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Application not found.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Application Submitted Successfully!
        </h1>
        <p className="text-lg text-gray-600">
          Thank you, {application.firstName}! Your credit application has been received.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-800"><span className="font-medium text-gray-900">Name:</span> {application.firstName} {application.lastName}</p>
              <p className="text-gray-800"><span className="font-medium text-gray-900">Email:</span> {application.email}</p>
              <p className="text-gray-800"><span className="font-medium text-gray-900">Phone:</span> {application.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Employment Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-800"><span className="font-medium text-gray-900">Annual Income:</span> ${parseInt(application.annualIncome).toLocaleString()}</p>
              <p className="text-gray-800"><span className="font-medium text-gray-900">Employment Status:</span> {application.employmentStatus}</p>
              <p className="text-gray-800"><span className="font-medium text-gray-900">Employer:</span> {application.employer}</p>
              <p className="text-gray-800"><span className="font-medium text-gray-900">Job Title:</span> {application.jobTitle}</p>
            </div>
          </div>
        </div>

        {application.selectedVehicle && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-3">Selected Vehicle</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">
                {application.selectedVehicle.year} {application.selectedVehicle.make} {application.selectedVehicle.model}
              </p>
              <p className="text-green-600 font-semibold">
                ${application.selectedVehicle.price.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Application ID:</span> {application.id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Submitted:</span> {application.submittedAt.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Our finance team will review your application within 24 hours</li>
                <li>• You'll receive an email notification with the decision</li>
                <li>• If approved, we'll contact you to schedule a vehicle inspection</li>
                <li>• Keep an eye on your email for updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <Link 
          href={`/upload-documents/${application.id}?token=${application.token}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all mr-4"
        >
          Upload Documents Now
        </Link>
        <Link 
          href="/inventory" 
          className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all mr-4"
        >
          Browse More Vehicles
        </Link>
        <Link 
          href="/" 
          className="inline-block text-blue-600 hover:underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default async function ApplicationSubmittedPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const appId = resolvedSearchParams.appId;
  const token = resolvedSearchParams.token;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <Suspense fallback={
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      }>
        {appId ? (
          <ApplicationDetails appId={appId} token={token} />
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-red-600 mb-4">No application ID provided.</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  );
} 