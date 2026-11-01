import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  otp: string;
  purpose: 'cod_verification' | 'login';
  verified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['cod_verification', 'login'],
      default: 'cod_verification',
    },
    verified: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: auto-deletes when expired
    },
  },
  { timestamps: true }
);

export const Otp: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);
