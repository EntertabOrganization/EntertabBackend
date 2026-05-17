import { Router } from 'express';
import {
  createJourney,
  getJourneys,
  getJourneyById,
  updateJourney,
  deleteJourney,
} from './journey.controller';
import { protectAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Anonymous/Public create route
router.post('/', createJourney);

// Admin-only protection for all other CRUD methods
router.use(protectAdmin);

router.get('/', getJourneys);

router.route('/:id')
  .get(getJourneyById)
  .put(updateJourney)
  .delete(deleteJourney);

export default router;
