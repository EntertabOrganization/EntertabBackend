import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// Store GridFS bucket instance
let gridFSBucket: GridFSBucket | null = null;

// Initialize GridFS bucket when MongoDB is connected
export const initializeGridFS = () => {
  if (mongoose.connection.db) {
    gridFSBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    console.log('[Upload] GridFS initialized for MongoDB storage');
  }
};

// Use memory storage for multer (we'll save to MongoDB manually)
const storage = multer.memoryStorage();

// File Type Filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, and .docx files are allowed!'));
  }
};

// Export Multer Middleware Instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB Limit
  },
});

// Utility function to save file to MongoDB GridFS
export const saveFileToMongoDB = async (file: Express.Multer.File): Promise<string> => {
  if (!gridFSBucket) {
    throw new Error('GridFS not initialized. MongoDB connection required.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = gridFSBucket!.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: {
        fieldname: file.fieldname,
        originalname: file.originalname,
        size: file.size,
        uploadedAt: new Date(),
      },
    });

    uploadStream.on('error', (err) => {
      reject(new Error(`Failed to save file to MongoDB: ${err.message}`));
    });

    uploadStream.on('finish', (doc: any) => {
      console.log(`[Upload] File saved to MongoDB: ${doc._id}`);
      resolve(doc._id.toString());
    });

    uploadStream.write(file.buffer);
    uploadStream.end();
  });
};

// Utility function to retrieve file from MongoDB GridFS
export const getFileFromMongoDB = async (fileId: string): Promise<Buffer> => {
  if (!gridFSBucket) {
    throw new Error('GridFS not initialized. MongoDB connection required.');
  }

  return new Promise((resolve, reject) => {
    const downloadStream = gridFSBucket!.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );

    const chunks: Buffer[] = [];

    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    downloadStream.on('error', (err) => {
      reject(new Error(`Failed to retrieve file from MongoDB: ${err.message}`));
    });
  });
};

// Utility function to delete file from MongoDB GridFS
export const deleteFileFromMongoDB = async (fileId: string): Promise<void> => {
  if (!gridFSBucket) {
    throw new Error('GridFS not initialized. MongoDB connection required.');
  }

  try {
    await gridFSBucket!.delete(new mongoose.Types.ObjectId(fileId));
    console.log(`[Upload] File deleted from MongoDB: ${fileId}`);
  } catch (err: any) {
    throw new Error(`Failed to delete file from MongoDB: ${err.message}`);
  }
};
