import { Request } from 'express';
import { IUser } from '../modules/users/user.interface';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
