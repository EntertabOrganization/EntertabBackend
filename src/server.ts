import app from './app';
import { config } from './config/env';
import { ensureAppInitialized } from './bootstrap';

const startServer = async (): Promise<void> => {
  await ensureAppInitialized();

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
