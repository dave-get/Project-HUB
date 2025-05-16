import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Validate required environment variables
const requiredEnvVars = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: requiredEnvVars.CLOUDINARY_CLOUD_NAME,
  api_key: requiredEnvVars.CLOUDINARY_API_KEY,
  api_secret: requiredEnvVars.CLOUDINARY_API_SECRET
});

export default cloudinary; 