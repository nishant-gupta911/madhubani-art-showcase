import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  artworkRef?: string;
  dimensions?: string;
  budget?: string;
  imageUrl?: string;
  status: 'new' | 'in_review' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, default: 'commission' },
    message: { type: String, required: true },
    artworkRef: { type: String },
    dimensions: { type: String },
    budget: { type: String },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ['new', 'in_review', 'contacted', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
