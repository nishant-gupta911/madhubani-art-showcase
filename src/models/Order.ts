import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  ref: string;
  name: string;
  slug: string;
  image: string;
  pricePaise: number;
  qty: number;
  framing?: string;
  isOriginal?: boolean;
}

export interface IOrderStatusHistory {
  status: string;
  at: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderId: string; // VE-YYMMDD-####
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotalPaise: number;
  shippingPaise: number;
  codFeePaise: number;
  giftWrapPaise: number;
  giftNote?: string;
  discountPaise: number;
  totalPaise: number;
  payment: {
    method: 'razorpay' | 'cod';
    status: 'pending' | 'paid' | 'cod_pending' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    paidAt?: Date;
  };
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  tracking?: {
    courier?: string;
    number?: string;
    url?: string;
  };
  statusHistory: IOrderStatusHistory[];
  stockReleased?: boolean;
  expiresAt?: Date | null; // Expiration timestamp for unpaid pending orders
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    ref: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    pricePaise: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    framing: { type: String },
    isOriginal: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true, index: true },
      email: { type: String, required: true, index: true },
    },
    shippingAddress: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    items: [OrderItemSchema],
    subtotalPaise: { type: Number, required: true },
    shippingPaise: { type: Number, default: 0 },
    codFeePaise: { type: Number, default: 0 },
    giftWrapPaise: { type: Number, default: 0 },
    giftNote: { type: String },
    discountPaise: { type: Number, default: 0 },
    totalPaise: { type: Number, required: true },
    payment: {
      method: { type: String, enum: ['razorpay', 'cod'], required: true },
      status: {
        type: String,
        enum: ['pending', 'paid', 'cod_pending', 'failed', 'refunded'],
        default: 'pending',
      },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    tracking: {
      courier: { type: String },
      number: { type: String },
      url: { type: String },
    },
    statusHistory: [OrderStatusHistorySchema],
    stockReleased: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, default: null, index: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ 'customer.phone': 1, orderId: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ status: 1, expiresAt: 1, stockReleased: 1 });

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
