import { Request, Response, NextFunction } from 'express';
import { Journey } from './journey.model';
import { AppError } from '../../middleware/error.middleware';
import { saveFileToMongoDB, deleteFileFromMongoDB, getFileFromMongoDB } from '../../middleware/upload.middleware';

/**
 * @desc    Create a new journey milestone (career application)
 * @route   POST /api/journeys
 * @access  Public
 */
export const createJourney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, name, positionOrSpecialisation, yearsOfExperience, typeOfEmployment, message } = req.body;

    if (!req.file) {
      return next(new AppError('Please upload your CV', 400));
    }

    if (!email || !name || !positionOrSpecialisation || !yearsOfExperience || !typeOfEmployment || !message) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Save file to MongoDB GridFS
    const fileId = await saveFileToMongoDB(req.file);

    const journey = await Journey.create({
      email,
      name,
      positionOrSpecialisation,
      yearsOfExperience: Number(yearsOfExperience),
      typeOfEmployment,
      cvUpload: fileId, // Store MongoDB GridFS file ID
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Journey/Career application submitted successfully',
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
    const journeys = await Journey.find().sort({ createdAt: -1 });

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
      return next(new AppError('Journey/Career application not found', 404));
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
    const { email, name, positionOrSpecialisation, yearsOfExperience, typeOfEmployment, message } = req.body;

    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return next(new AppError('Journey/Career application not found', 404));
    }

    if (email) journey.email = email;
    if (name) journey.name = name;
    if (positionOrSpecialisation) journey.positionOrSpecialisation = positionOrSpecialisation;
    if (yearsOfExperience !== undefined) journey.yearsOfExperience = Number(yearsOfExperience);
    if (typeOfEmployment) journey.typeOfEmployment = typeOfEmployment;
    if (message) journey.message = message;

    // Handle CV update if a new file is uploaded
    if (req.file) {
      // Delete old file from GridFS
      if (journey.cvUpload) {
        try {
          await deleteFileFromMongoDB(journey.cvUpload);
        } catch (err) {
          console.error('Failed to delete old CV file:', err);
        }
      }
      // Save new file to GridFS
      const newFileId = await saveFileToMongoDB(req.file);
      journey.cvUpload = newFileId;
    }

    await journey.save();

    res.status(200).json({
      success: true,
      message: 'Journey/Career application updated successfully',
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
      return next(new AppError('Journey/Career application not found', 404));
    }

    // Delete file from GridFS
    if (journey.cvUpload) {
      try {
        await deleteFileFromMongoDB(journey.cvUpload);
      } catch (err) {
        console.error('Failed to delete CV file:', err);
      }
    }

    await Journey.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Journey/Career application removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download CV file from MongoDB GridFS
 * @route   GET /api/journeys/file/:fileId
 * @access  Private/Admin
 */
export const downloadCVFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fileId } = req.params;

    const fileBuffer = await getFileFromMongoDB(fileId);

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="cv.pdf"`);
    res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
};
