import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Upload API Test Route',
    timestamp: new Date().toISOString(),
    uploadEndpoint: '/api/upload',
    instructions: 'Use POST with multipart/form-data to upload files'
  });
} 