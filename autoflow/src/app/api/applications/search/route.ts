import { NextRequest, NextResponse } from 'next/server';
import { getApplication } from '@/lib/applicationStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('id');

    if (!appId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const application = getApplication(parseInt(appId));
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Return the application data (without sensitive info if needed)
    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        firstName: application.firstName,
        lastName: application.lastName,
        status: application.status,
        selectedVehicle: application.selectedVehicle,
        token: application.token,
        approvalTerms: application.approvalTerms,
        uploadedDocuments: application.uploadedDocuments?.length || 0
      }
    });
  } catch (error) {
    console.error('Error searching for application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 