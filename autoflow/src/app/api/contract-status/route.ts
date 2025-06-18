import { NextRequest, NextResponse } from 'next/server';
import { markContractSent, markContractSigned } from '@/lib/applicationStore';

export async function POST(request: NextRequest) {
  try {
    const { applicationId, action } = await request.json();

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: 'Application ID and action are required' },
        { status: 400 }
      );
    }

    let success = false;
    let message = '';

    switch (action) {
      case 'send-for-esign':
        success = markContractSent(applicationId);
        message = success ? 'Contract sent for e-signature' : 'Failed to update contract status';
        break;
      
      case 'sign-now':
        success = markContractSigned(applicationId);
        message = success ? 'Contract signed successfully' : 'Failed to update contract status';
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "send-for-esign" or "sign-now"' },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message,
        applicationId,
        action
      });
    } else {
      return NextResponse.json(
        { error: message },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error updating contract status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 