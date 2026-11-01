import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductImage {
  url: string;
  cardUrl?: string;
  filename: string;
  alt: string;
  isHero: boolean;
  shotType?: string;
  blurDataUrl?: string;
}

export interface IProduct extends Document {
  ref: string;
  name: string;
  slug: string;
  category: 'paintings' | 'dupattas' | 'bags_and_files';
  subCategory: string;
  type: 'original_painting' | 'made_to_order' | 'stock_item';
  stock: number;
  leadTimeDays: number;
  price: number; // in paise
  compareAtPrice?: number | null; // in paise
  dimensions: {
    widthCm?: number;
    heightCm?: number;
    widthIn?: number;
    heightIn?: number;
    displayString: string;
  };
  technique: string;
  paintMedium?: string | null;
  material: string;
  isFramed: boolean;
  description: string;
  story: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'sold' | 'archived';
  images: IProductImage[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    cardUrl: { type: String },
    filename: { type: String, required: true },
    alt: { type: String, required: true },
    isHero: { type: Boolean, default: false },
    shotType: { type: String },
    blurDataUrl: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    ref: { type: String, required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['paintings', 'dupattas', 'bags_and_files'],
      index: true,
    },
    subCategory: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ['original_painting', 'made_to_order', 'stock_item'],
      default: 'stock_item',
    },
    stock: { type: Number, required: true, min: 0, default: 1 },
    leadTimeDays: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0 }, // in paise
    compareAtPrice: { type: Number, default: null }, // in paise
    dimensions: {
      widthCm: Number,
      heightCm: Number,
      widthIn: Number,
      heightIn: Number,
      displayString: { type: String, required: true },
    },
    technique: { type: String, default: 'handpainted' },
    paintMedium: { type: String, default: null },
    material: { type: String, required: true },
    isFramed: { type: Boolean, default: false },
    description: { type: String, required: true },
    story: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'published', 'sold', 'archived'],
      default: 'published',
      index: true,
    },
    images: [ProductImageSchema],
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high-speed catalog filtering and sorting
ProductSchema.index({ status: 1, category: 1, price: 1 });
ProductSchema.index({ status: 1, featured: 1, createdAt: -1 });
ProductSchema.index({ name: 'text', tags: 'text', description: 'text' });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
