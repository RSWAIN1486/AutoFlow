'use server';

import { redirect } from 'next/navigation';
import { addApplication } from '@/lib/applicationStore';

export async function submitCreditApplication(formData: FormData) {
  // Extract form data
  const applicationData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    annualIncome: formData.get('annualIncome') as string,
    employmentStatus: formData.get('employmentStatus') as string,
    employer: formData.get('employer') as string,
    jobTitle: formData.get('jobTitle') as string,
  };

  // Get selected vehicle data if available
  const selectedVehicleData = formData.get('selectedVehicle');
  let selectedVehicle = undefined;
  
  if (selectedVehicleData) {
    try {
      selectedVehicle = JSON.parse(selectedVehicleData as string);
    } catch (error) {
      console.error('Error parsing selected vehicle data:', error);
    }
  }

  // Validate required fields
  if (!applicationData.firstName || !applicationData.lastName || !applicationData.email || !applicationData.phone) {
    throw new Error('Missing required fields');
  }

  // Add to store
  const applicationId = addApplication({
    ...applicationData,
    selectedVehicle
  });

  console.log('Credit application submitted:', {
    id: applicationId,
    ...applicationData,
    selectedVehicle
  });

  // Redirect to confirmation page
  redirect(`/application-submitted?appId=${applicationId}`);
} 