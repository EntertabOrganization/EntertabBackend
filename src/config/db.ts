import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    // Override Node DNS servers to Google & Cloudflare to prevent local ISP DNS timeouts on SRV lookups
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      // Gracefully continue if overriding DNS fails in the host environment
    }

    const conn = await mongoose.connect(config.mongoUri, {
      family: 4, // Force IPv4 resolution to bypass inactive IPv6 route hanging
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
