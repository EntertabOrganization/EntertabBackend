import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  icon?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a service title'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a service description'],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

export const Service = model<IService>('Service', serviceSchema);
