import { Request, Response, NextFunction } from 'express';
import { Service } from './service.model';
import { AppError } from '../../middleware/error.middleware';

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Public
 */
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, icon, price } = req.body;

    if (!title || !description) {
      return next(new AppError('Please provide both service title and description', 400));
    }

    const serviceExists = await Service.findOne({ title });

    if (serviceExists) {
      return next(new AppError('Service with this title already exists', 400));
    }

    const service = await Service.create({
      title,
      description,
      icon,
      price,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
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
      return next(new AppError('Service not found', 404));
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
    const { title, description, icon, price } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    if (title) {
      const serviceExists = await Service.findOne({ title, _id: { $ne: req.params.id } });
      if (serviceExists) {
        return next(new AppError('Service with this title already exists', 400));
      }
      service.title = title;
    }
    if (description) service.description = description;
    if (icon !== undefined) service.icon = icon;
    if (price !== undefined) service.price = price;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
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
      return next(new AppError('Service not found', 404));
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
