import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { updateApplicationDocuments, type UploadedDocument } from '@/lib/applicationStore';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Ensure uploads directory exists in public folder for accessibility
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const uploadedFiles: UploadedDocument[] = [];
    let appId: number | null = null;

    // Process each file in the form data
    for (const [fieldName, value] of formData.entries()) {
      if (fieldName === 'appId' && typeof value === 'string') {
        appId = parseInt(value);
        continue;
      }
      
      // More compatible way to check if value is a file
      // Check if it has file-like properties instead of using instanceof File
      if (value && typeof value === 'object' && 'name' in value && 'size' in value && 'arrayBuffer' in value) {
        const file = value as File;
        
        if (file.size > 0) {
          // Generate unique filename to avoid collisions
          const fileExtension = file.name.split('.').pop() || '';
          const uniqueFilename = `${Date.now()}-${uuidv4()}.${fileExtension}`;
          
          // Convert file to buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Save file to uploads directory
          const filePath = join(uploadsDir, uniqueFilename);
          await writeFile(filePath, buffer);
          
          uploadedFiles.push({
            originalName: file.name,
            filename: uniqueFilename,
            path: `/uploads/${uniqueFilename}`,
            fieldName,
            uploadedAt: new Date()
          });
        }
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid files were uploaded' },
        { status: 400 }
      );
    }

    // Update application with uploaded documents if appId is provided
    if (appId) {
      console.log(`🔄 Attempting to update application ${appId} with ${uploadedFiles.length} documents at ${new Date().toISOString()}`);
      const updated = updateApplicationDocuments(appId, uploadedFiles);
      if (!updated) {
        console.error(`❌ Failed to update application ${appId} with uploaded documents`);
        return NextResponse.json(
          { success: false, error: 'Failed to update application status' },
          { status: 500 }
        );
      } else {
        console.log(`✅ Successfully updated application ${appId} with uploaded documents at ${new Date().toISOString()}`);
      }
    } else {
      console.warn('⚠️ No appId provided in upload request');
      return NextResponse.json(
        { success: false, error: 'No application ID provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
      appId: appId
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests to check if the endpoint is working
export async function GET() {
  return NextResponse.json({
    message: 'File upload endpoint is active',
    supportedMethods: ['POST'],
    maxFileSize: '10MB (configurable)',
    supportedFormats: 'PDF, JPEG, PNG, etc.'
  });
} 