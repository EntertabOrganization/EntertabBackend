import { Router } from 'express';
import {
  createContactUs,
  getContactUs,
  getContactUsById,
  updateContactUs,
  deleteContactUs,
} from './contactUs.controller';
import { protectAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Anonymous/Public create route
router.post('/', createContactUs);

// Admin-only protection for all other CRUD methods
router.use(protectAdmin);

router.get('/', getContactUs);

router.route('/:id')
  .get(getContactUsById)
  .put(updateContactUs)
  .delete(deleteContactUs);

export default router;
