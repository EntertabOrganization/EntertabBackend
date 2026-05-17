import { Request, Response, NextFunction } from 'express';
import { Project } from './project.model';
import { AppError } from '../../middleware/error.middleware';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Public
 */
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, client, completionDate, technologies, imageUrl } = req.body;

    if (!title || !description) {
      return next(new AppError('Please provide both project title and description', 400));
    }

    const projectExists = await Project.findOne({ title });

    if (projectExists) {
      return next(new AppError('Project with this title already exists', 400));
    }

    const project = await Project.create({
      title,
      description,
      client,
      completionDate,
      technologies: technologies || [],
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
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
    const { title, description, client, completionDate, technologies, imageUrl } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (title) {
      const projectExists = await Project.findOne({ title, _id: { $ne: req.params.id } });
      if (projectExists) {
        return next(new AppError('Project with this title already exists', 400));
      }
      project.title = title;
    }
    if (description) project.description = description;
    if (client !== undefined) project.client = client;
    if (completionDate !== undefined) project.completionDate = completionDate;
    if (technologies !== undefined) project.technologies = technologies;
    if (imageUrl !== undefined) project.imageUrl = imageUrl;

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
