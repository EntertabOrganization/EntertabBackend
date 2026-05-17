import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  email: string;
  name: string;
  phoneNumber: string;
  message: string;
  serviceType: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Please select a service type'],
      enum: [
        'AI Edge – AI-Powered Automation & Intelligence',
        'Digital Transformation Hub',
        'Mobile App Development',
        'Website Development',
        'Brand Building',
        'UI/UX Design',
        'Digital Marketing',
        'Marketing Content Writing',
        'Social Media Management',
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Service = model<IService>('Service', serviceSchema);
