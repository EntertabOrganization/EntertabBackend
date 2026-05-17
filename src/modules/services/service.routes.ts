import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from './service.controller';
import { protectAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Anonymous/Public create route
router.post('/', createService);

// Admin-only protection for all other CRUD methods
router.use(protectAdmin);

router.get('/', getServices);

router.route('/:id')
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService);

export default router;
