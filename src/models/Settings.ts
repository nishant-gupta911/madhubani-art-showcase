import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  shipping: {
    standardFeePaise: number;
    freeShippingThresholdPaise: number;
    paintingsFreeShipping: boolean;
    codAvailable: boolean;
    codConvenienceFeePaise: number;
    codMaxThresholdPaise: number;
    giftWrappingFeePaise: number;
    defaultLeadTimeDays: number;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    sellerCity: string;
    state: string;
    pincode: string;
    grievanceOfficerName: string;
    grievanceOfficerEmail: string;
    gstin?: string;
  };
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: 'Free shipping across India on orders above ₹1,499 · All framed paintings ship free' },
      link: { type: String },
    },
    shipping: {
      standardFeePaise: { type: Number, default: 7900 },
      freeShippingThresholdPaise: { type: Number, default: 149900 },
      paintingsFreeShipping: { type: Boolean, default: true },
      codAvailable: { type: Boolean, default: true },
      codConvenienceFeePaise: { type: Number, default: 4900 },
      codMaxThresholdPaise: { type: Number, default: 300000 },
      giftWrappingFeePaise: { type: Number, default: 9900 },
      defaultLeadTimeDays: { type: Number, default: 7 },
    },
    contact: {
      phone: { type: String, default: '7870909889' },
      whatsapp: { type: String, default: '917870909889' },
      email: { type: String, default: 'vernikaenterprises14@gmail.com' },
      sellerCity: { type: String, default: 'Patna' },
      state: { type: String, default: 'Bihar' },
      pincode: { type: String, default: '800001' },
      grievanceOfficerName: { type: String, default: 'Natasha Gupta' },
      grievanceOfficerEmail: { type: String, default: 'vernikaenterprises14@gmail.com' },
      gstin: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
