'use server';

import { addApplication } from '@/lib/applicationStore';

export async function submitApplication(formData: any): Promise<{ id: number, token: string }> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return addApplication(formData);
} 