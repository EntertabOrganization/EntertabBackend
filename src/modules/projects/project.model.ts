import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
  email: string;
  name: string;
  requiredService: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
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
    requiredService: {
      type: String,
      required: [true, 'Please select a required service'],
      enum: [
        'AI Edge – AI-Powered Automation & Intelligence',
        'Digital Transformation Hub',
        'Website Development',
        'Mobile App Development',
        'Brand Building',
        'Contact Center Solutions',
        'UI/UX Design',
        'Digital Marketing',
        'Marketing Content Writing',
        'Social Media Management',
      ],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = model<IProject>('Project', projectSchema);
