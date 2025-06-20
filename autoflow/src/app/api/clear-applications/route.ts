import { NextRequest, NextResponse } from 'next/server';
import { clearAllApplications } from '@/lib/applicationStore';

export async function POST(request: NextRequest) {
  try {
    console.log('Clearing all applications request received');
    
    const result = await clearAllApplications();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        deletedFiles: result.deletedFiles
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in clear applications API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear applications'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Clear applications endpoint',
    method: 'POST',
    description: 'Use POST to clear all applications and their uploaded documents'
  });
} 