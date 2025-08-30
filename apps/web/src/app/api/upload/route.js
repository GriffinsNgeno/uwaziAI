import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * API route to handle file uploads
 * Saves uploaded files to the localdb folder in the project root
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['text/csv', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only CSV and PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename with timestamp to avoid conflicts
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Path to localdb folder (two levels up from apps/web)
    const localdbPath = join(process.cwd(), '..', '..', 'localdb');
    
    // Ensure localdb directory exists
    await mkdir(localdbPath, { recursive: true });
    
    // Full file path
    const filePath = join(localdbPath, filename);
    
    // Write file to localdb folder
    await writeFile(filePath, buffer);
    
    // Return success response with file info
    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: filename,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      savedPath: filePath,
      uploadTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET method to list uploaded files
 */
export async function GET() {
  try {
    const { readdir, stat } = await import('fs/promises');
    const localdbPath = join(process.cwd(), '..', '..', 'localdb');
    
    try {
      const files = await readdir(localdbPath);
      const fileStats = await Promise.all(
        files.map(async (filename) => {
          const filePath = join(localdbPath, filename);
          const stats = await stat(filePath);
          return {
            filename,
            size: stats.size,
            uploadTime: stats.mtime.toISOString(),
            path: filePath
          };
        })
      );
      
      return NextResponse.json({
        files: fileStats,
        totalFiles: fileStats.length,
        localdbPath: localdbPath
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Directory doesn't exist yet
        return NextResponse.json({
          files: [],
          totalFiles: 0,
          localdbPath: localdbPath,
          message: 'localdb directory not found'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files', details: error.message },
      { status: 500 }
    );
  }
}
