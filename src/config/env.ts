import dotenv from 'dotenv';
import path from 'path';

// Enable access to System Environment Variables if this are the env in production
if (process.env.NODE_ENV !== 'production') {
  // Load environment variables from .env file
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/entertab',
  jwtSecret: process.env.JWT_SECRET || 'entertab_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  defaultAdmin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@entertab.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
  },
};
