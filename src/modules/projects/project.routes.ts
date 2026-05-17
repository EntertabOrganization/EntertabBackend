import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from './project.controller';
import { protectAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Anonymous/Public create route
router.post('/', createProject);

// Admin-only protection for all other CRUD methods
router.use(protectAdmin);

router.get('/', getProjects);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
