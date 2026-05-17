import { Request, Response, NextFunction } from 'express';
import { Journey } from './journey.model';
import { AppError } from '../../middleware/error.middleware';

/**
 * @desc    Create a new journey milestone
 * @route   POST /api/journeys
 * @access  Public
 */
export const createJourney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, year, milestoneType } = req.body;

    if (!title || !description || !year) {
      return next(new AppError('Please provide title, description and year', 400));
    }

    const journey = await Journey.create({
      title,
      description,
      year,
      milestoneType,
    });

    res.status(201).json({
      success: true,
      message: 'Journey milestone created successfully',
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all journey milestones
 * @route   GET /api/journeys
 * @access  Private/Admin
 */
export const getJourneys = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const journeys = await Journey.find().sort({ year: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: journeys.length,
      data: journeys,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single journey milestone by ID
 * @route   GET /api/journeys/:id
 * @access  Private/Admin
 */
export const getJourneyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return next(new AppError('Journey milestone not found', 404));
    }

    res.status(200).json({
      success: true,
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a journey milestone
 * @route   PUT /api/journeys/:id
 * @access  Private/Admin
 */
export const updateJourney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, year, milestoneType } = req.body;

    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return next(new AppError('Journey milestone not found', 404));
    }

    if (title) journey.title = title;
    if (description) journey.description = description;
    if (year) journey.year = year;
    if (milestoneType !== undefined) journey.milestoneType = milestoneType;

    await journey.save();

    res.status(200).json({
      success: true,
      message: 'Journey milestone updated successfully',
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a journey milestone
 * @route   DELETE /api/journeys/:id
 * @access  Private/Admin
 */
export const deleteJourney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return next(new AppError('Journey milestone not found', 404));
    }

    await Journey.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Journey milestone removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
