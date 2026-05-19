import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';

// Import routers
import userRouter from './modules/users/user.routes';
import contactUsRouter from './modules/contactUs/contactUs.routes';
import serviceRouter from './modules/services/service.routes';
import projectRouter from './modules/projects/project.routes';
import journeyRouter from './modules/journey/journey.routes';

const app: Application = express();

// Security Middlewares
// Swagger UI needs inline scripts/styles to render correctly in browser.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());

// Logging Middleware
app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger API Documentation
setupSwagger(app);

// Welcome / Health Route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Entertab Backend API is running smoothly',
    timestamp: new Date(),
  });
});

// Mount Module Routes
app.use('/api/users', userRouter);
app.use('/api/contact-us', contactUsRouter);
app.use('/api/services', serviceRouter);
app.use('/api/projects', projectRouter);
app.use('/api/journeys', journeyRouter);

// Catch 404 (Not Found) routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on this server.`,
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
