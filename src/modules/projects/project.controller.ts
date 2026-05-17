import { Request, Response, NextFunction } from 'express';
import { Project } from './project.model';
import { AppError } from '../../middleware/error.middleware';

/**
 * @desc    Create a new project submission
 * @route   POST /api/projects
 * @access  Public
 */
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, name, requiredService, message } = req.body;

    if (!email || !name || !requiredService || !message) {
      return next(new AppError('Please provide email, name, requiredService, and message', 400));
    }

    const project = await Project.create({
      email,
      name,
      requiredService,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Project inquiry submitted successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Private/Admin
 */
export const getProjects = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Private/Admin
 */
export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, name, requiredService, message } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (email) project.email = email;
    if (name) project.name = name;
    if (requiredService) project.requiredService = requiredService;
    if (message) project.message = message;

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
