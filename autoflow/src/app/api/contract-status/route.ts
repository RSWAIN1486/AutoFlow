import { NextRequest, NextResponse } from 'next/server';
import { markContractSent, markContractSigned, getApplication } from '@/lib/applicationStore';

export async function POST(request: NextRequest) {
  try {
    const { applicationId, action } = await request.json();

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: 'Application ID and action are required' },
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

    let success = false;
    let message = '';

    switch (action) {
      case 'send-contract':
        // Admin action: Mark contract as sent to customer
        if (application.status !== 'approved') {
          return NextResponse.json(
            { error: 'Application must be approved before sending contract' },
            { status: 400 }
          );
        }
        success = markContractSent(applicationId);
        message = success ? 'Contract sent to customer for e-signature' : 'Failed to send contract';
        break;

      case 'sign-contract':
        // Customer action: Mark contract as signed
        if (application.status !== 'contract-sent') {
          return NextResponse.json(
            { error: 'Contract must be sent before it can be signed' },
            { status: 400 }
          );
        }
        success = markContractSigned(applicationId);
        message = success ? 'Contract signed successfully' : 'Failed to sign contract';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "send-contract" or "sign-contract"' },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message,
      status: action === 'send-contract' ? 'contract-sent' : 'contract-signed'
    });

  } catch (error) {
    console.error('Contract status update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 