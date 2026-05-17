import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';
import { User } from './modules/users/user.model';

// Seed default administrator if none exists
const seedDefaultAdmin = async (): Promise<void> => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('No administrator found in database. Seeding default admin...');
      await User.create({
        name: 'System Admin',
        email: config.defaultAdmin.email,
        password: config.defaultAdmin.password,
        role: 'admin',
      });
      console.log('--------------------------------------------------');
      console.log('DEFAULT ADMINISTRATOR SEEDED SUCCESSFULLY!');
      console.log(`Email: ${config.defaultAdmin.email}`);
      console.log(`Password: ${config.defaultAdmin.password}`);
      console.log('--------------------------------------------------');
    } else {
      console.log('Administrator accounts exist. Skipping bootstrap seeder.');
    }
  } catch (error) {
    console.error(`Error bootstrapping default administrator: ${(error as Error).message}`);
  }
};

const startServer = async (): Promise<void> => {
  // Connect to Database
  await connectDB();

  // Run initial seeder/bootstrap
  await seedDefaultAdmin();

  // Start Express HTTP Server
  const PORT = config.port;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`Swagger API Documentation is available at: http://localhost:${PORT}/api-docs`);
  });

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err: Error) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
