import { Schema, model, Document } from 'mongoose';

export interface IJourney extends Document {
  email: string;
  name: string;
  positionOrSpecialisation: string;
  yearsOfExperience: number;
  typeOfEmployment: string;
  cvUpload: string; // File URL or path
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const journeySchema = new Schema<IJourney>(
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
    positionOrSpecialisation: {
      type: String,
      required: [true, 'Please provide your position / specialisation'],
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative'],
    },
    typeOfEmployment: {
      type: String,
      required: [true, 'Please provide type of employment'],
      trim: true,
    },
    cvUpload: {
      type: String,
      required: [true, 'Please upload your CV'],
      trim: true,
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

export const Journey = model<IJourney>('Journey', journeySchema);
