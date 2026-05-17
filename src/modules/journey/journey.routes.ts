import { Router } from 'express';
import {
  createJourney,
  getJourneys,
  getJourneyById,
  updateJourney,
  deleteJourney,
} from './journey.controller';
import { protectAdmin } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

// Anonymous/Public create route (with CV upload support)
router.post('/', upload.single('cvUpload'), createJourney);

// Admin-only protection for all other CRUD methods
router.use(protectAdmin);

router.get('/', getJourneys);

router.route('/:id')
  .get(getJourneyById)
  .put(upload.single('cvUpload'), updateJourney)
  .delete(deleteJourney);

export default router;
