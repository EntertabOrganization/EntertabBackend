import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User } from '../modules/users/user.model';
import { AppError } from './error.middleware';
import { AuthenticatedRequest } from './auth.interface';

interface JwtPayload {
  id: string;
}

export const protectAdmin = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route, token is missing', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    if (user.role !== 'admin') {
      return next(new AppError('Access denied. Admin role required.', 403));
    }

    // Grant access and assign to request
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route, token is invalid or expired', 401));
  }
};
