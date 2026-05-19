import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Determine upload directory
const uploadDir = process.env.VERCEL 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../../uploads');

// Initialize storage - try disk first, fall back to memory on Vercel
let storage: multer.StorageEngine;

if (process.env.VERCEL) {
  // Use memory storage on Vercel (serverless has no persistent file system)
  storage = multer.memoryStorage();
  console.warn('[Upload] Running on Vercel - using memory storage. Files are temporary.');
} else {
  // Try to use disk storage locally
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    });
  } catch (err) {
    // Fallback to memory storage if disk fails
    console.error('[Upload] Failed to initialize disk storage, using memory storage:', err);
    storage = multer.memoryStorage();
  }
}

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
