import { Schema, model, Document } from 'mongoose';

export interface IJourney extends Document {
  title: string;
  description: string;
  year: string;
  milestoneType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const journeySchema = new Schema<IJourney>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a journey title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a journey description'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Please provide a journey year'],
      trim: true,
    },
    milestoneType: {
      type: String,
      trim: true,
      default: 'milestone',
    },
  },
  {
    timestamps: true,
  }
);

export const Journey = model<IJourney>('Journey', journeySchema);
