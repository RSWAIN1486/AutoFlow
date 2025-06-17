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
      
      if (value instanceof File && value.size > 0) {
        // Generate unique filename to avoid collisions
        const fileExtension = value.name.split('.').pop() || '';
        const uniqueFilename = `${Date.now()}-${uuidv4()}.${fileExtension}`;
        
        // Convert file to buffer
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Save file to uploads directory
        const filePath = join(uploadsDir, uniqueFilename);
        await writeFile(filePath, buffer);
        
        uploadedFiles.push({
          originalName: value.name,
          filename: uniqueFilename,
          path: `/uploads/${uniqueFilename}`,
          fieldName,
          uploadedAt: new Date()
        });
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
      const updated = updateApplicationDocuments(appId, uploadedFiles);
      if (!updated) {
        console.warn(`Failed to update application ${appId} with uploaded documents`);
      }
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