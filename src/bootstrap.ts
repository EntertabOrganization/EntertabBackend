import { connectDB } from './config/db';
import { config } from './config/env';
import { User } from './modules/users/user.model';
import { initializeGridFS } from './middleware/upload.middleware';

let bootstrapped = false;
let bootstrapPromise: Promise<void> | null = null;

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

export const ensureAppInitialized = async (): Promise<void> => {
  if (bootstrapped) {
    return;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      await connectDB();
      initializeGridFS();
      await seedDefaultAdmin();
      bootstrapped = true;
    })();
  }

  await bootstrapPromise;
};
