import { NextRequest, NextResponse } from 'next/server';
import { updateDeliveryChoice, getApplication } from '@/lib/applicationStore';

export async function POST(request: NextRequest) {
  try {
    const { applicationId, deliveryChoice, deliveryDetails } = await request.json();

    if (!applicationId || !deliveryChoice) {
      return NextResponse.json(
        { error: 'Application ID and delivery choice are required' },
        { status: 400 }
      );
    }

    // Validate delivery choice
    if (!['pickup', 'home-delivery'].includes(deliveryChoice)) {
      return NextResponse.json(
        { error: 'Invalid delivery choice. Must be "pickup" or "home-delivery"' },
        { status: 400 }
      );
    }

    // Verify application exists
    const application = getApplication(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Verify application is in the right status (contract should be signed)
    if (application.status !== 'contract-signed') {
      return NextResponse.json(
        { error: 'Contract must be signed before selecting delivery options' },
        { status: 400 }
      );
    }

    // Update delivery choice
    const success = updateDeliveryChoice(applicationId, deliveryChoice, deliveryDetails);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update delivery choice' },
        { status: 500 }
      );
    }

    // Update status to awaiting-delivery
    const { updateApplicationStatus } = await import('@/lib/applicationStore');
    const statusUpdated = updateApplicationStatus(applicationId, 'awaiting-delivery');

    if (!statusUpdated) {
      console.warn(`Failed to update status for application ${applicationId}`);
    }

    return NextResponse.json({
      success: true,
      message: `Delivery choice updated to ${deliveryChoice}`,
      deliveryChoice,
      status: 'awaiting-delivery'
    });

  } catch (error) {
    console.error('Delivery choice update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 