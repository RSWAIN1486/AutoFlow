import { NextRequest, NextResponse } from 'next/server';
import { getAllApplications } from '@/lib/applicationStore';
import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Cleanup uploads request received');
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // Get all applications and collect referenced filenames
    const applications = getAllApplications();
    const referencedFiles = new Set<string>();
    
    for (const app of applications) {
      if (app.uploadedDocuments && app.uploadedDocuments.length > 0) {
        for (const doc of app.uploadedDocuments) {
          referencedFiles.add(doc.filename);
        }
      }
    }
    
    console.log(`Found ${referencedFiles.size} referenced files across ${applications.length} applications`);
    
    // Get all files in uploads directory
    let allFiles: string[] = [];
    try {
      allFiles = await readdir(uploadsDir);
    } catch (error) {
      console.log('Uploads directory does not exist or is empty');
      return NextResponse.json({
        success: true,
        message: 'No uploads directory found or directory is empty',
        deletedFiles: [],
        referencedFiles: Array.from(referencedFiles),
        orphanedFiles: []
      });
    }
    
    console.log(`Found ${allFiles.length} total files in uploads directory`);
    
    // Find orphaned files (files not referenced by any application)
    const orphanedFiles: string[] = [];
    for (const filename of allFiles) {
      if (!referencedFiles.has(filename)) {
        orphanedFiles.push(filename);
      }
    }
    
    console.log(`Found ${orphanedFiles.length} orphaned files to delete:`, orphanedFiles);
    
    // Delete orphaned files
    const deletedFiles: string[] = [];
    let totalSizeDeleted = 0;
    
    for (const filename of orphanedFiles) {
      try {
        const filePath = join(uploadsDir, filename);
        
        // Get file size before deletion
        const stats = await stat(filePath);
        totalSizeDeleted += stats.size;
        
        await unlink(filePath);
        deletedFiles.push(filename);
        console.log(`✅ Deleted orphaned file: ${filename} (${stats.size} bytes)`);
      } catch (error) {
        console.error(`❌ Error deleting file ${filename}:`, error);
      }
    }
    
    const totalSizeMB = (totalSizeDeleted / 1024 / 1024).toFixed(2);
    
    console.log(`Cleanup complete: deleted ${deletedFiles.length} orphaned files (${totalSizeMB} MB)`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedFiles.length} orphaned files (${totalSizeMB} MB freed)`,
      deletedFiles,
      referencedFiles: Array.from(referencedFiles),
      orphanedFiles,
      totalSizeDeleted: totalSizeDeleted
    });
    
  } catch (error) {
    console.error('Error in cleanup uploads API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup uploads directory'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // Get all applications and collect referenced filenames
    const applications = getAllApplications();
    const referencedFiles = new Set<string>();
    
    for (const app of applications) {
      if (app.uploadedDocuments && app.uploadedDocuments.length > 0) {
        for (const doc of app.uploadedDocuments) {
          referencedFiles.add(doc.filename);
        }
      }
    }
    
    // Get all files in uploads directory
    let allFiles: string[] = [];
    try {
      allFiles = await readdir(uploadsDir);
    } catch (error) {
      allFiles = [];
    }
    
    // Find orphaned files
    const orphanedFiles: string[] = [];
    for (const filename of allFiles) {
      if (!referencedFiles.has(filename)) {
        orphanedFiles.push(filename);
      }
    }
    
    return NextResponse.json({
      message: 'Uploads cleanup status',
      totalFiles: allFiles.length,
      referencedFiles: referencedFiles.size,
      orphanedFiles: orphanedFiles.length,
      orphanedFilesList: orphanedFiles,
      method: 'POST',
      description: 'Use POST to cleanup orphaned files'
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to analyze uploads directory'
    }, { status: 500 });
  }
} 