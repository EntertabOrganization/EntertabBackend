import { Request, Response, NextFunction } from 'express';
import { Service } from './service.model';
import { AppError } from '../../middleware/error.middleware';

/**
 * @desc    Create a new service submission
 * @route   POST /api/services
 * @access  Public
 */
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, name, phoneNumber, message, serviceType } = req.body;

    if (!email || !name || !phoneNumber || !message || !serviceType) {
      return next(new AppError('Please provide email, name, phoneNumber, message, and serviceType', 400));
    }

    const service = await Service.create({
      email,
      name,
      phoneNumber,
      message,
      serviceType,
    });

    res.status(201).json({
      success: true,
      message: 'Service request submitted successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Private/Admin
 */
export const getServices = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single service by ID
 * @route   GET /api/services/:id
 * @access  Private/Admin
 */
export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError('Service request not found', 404));
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a service
 * @route   PUT /api/services/:id
 * @access  Private/Admin
 */
export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, name, phoneNumber, message, serviceType } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError('Service request not found', 404));
    }

    if (email) service.email = email;
    if (name) service.name = name;
    if (phoneNumber) service.phoneNumber = phoneNumber;
    if (message) service.message = message;
    if (serviceType) service.serviceType = serviceType;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service request updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a service
 * @route   DELETE /api/services/:id
 * @access  Private/Admin
 */
export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError('Service request not found', 404));
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service request removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
