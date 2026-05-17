import { Request, Response, NextFunction } from 'express';
import { ContactUs } from './contactUs.model';
import { AppError } from '../../middleware/error.middleware';

/**
 * @desc    Submit a new contact us request
 * @route   POST /api/contact-us
 * @access  Public
 */
export const createContactUs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phoneNumber, message } = req.body;

    if (!name || !email || !phoneNumber || !message) {
      return next(new AppError('Please provide name, email, phoneNumber and message', 400));
    }

    const contact = await ContactUs.create({
      name,
      email,
      phoneNumber,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Contact request submitted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact us submissions
 * @route   GET /api/contact-us
 * @access  Private/Admin
 */
export const getContactUs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const submissions = await ContactUs.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single contact submission by ID
 * @route   GET /api/contact-us/:id
 * @access  Private/Admin
 */
export const getContactUsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contact = await ContactUs.findById(req.params.id);

    if (!contact) {
      return next(new AppError('Contact submission not found', 404));
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a contact submission (e.g. status)
 * @route   PUT /api/contact-us/:id
 * @access  Private/Admin
 */
export const updateContactUs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phoneNumber, message, status } = req.body;

    const contact = await ContactUs.findById(req.params.id);

    if (!contact) {
      return next(new AppError('Contact submission not found', 404));
    }

    if (name) contact.name = name;
    if (email) contact.email = email;
    if (phoneNumber) contact.phoneNumber = phoneNumber;
    if (message) contact.message = message;
    if (status) contact.status = status;

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Contact submission updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a contact submission
 * @route   DELETE /api/contact-us/:id
 * @access  Private/Admin
 */
export const deleteContactUs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contact = await ContactUs.findById(req.params.id);

    if (!contact) {
      return next(new AppError('Contact submission not found', 404));
    }

    await ContactUs.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Contact submission removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
