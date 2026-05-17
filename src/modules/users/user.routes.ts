import { Router } from 'express';
import {
  loginUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './user.controller';
import { protectAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Public route
router.post('/login', loginUser);

// All routes below this middleware require Admin token
router.use(protectAdmin);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;
