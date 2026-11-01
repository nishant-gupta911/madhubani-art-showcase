export type MithilaStyle = 'Bharni' | 'Kachni' | 'Tantrik' | 'Godna' | 'Kohbar';

export type FramingOption = 'unframed' | 'black-frame' | 'teak-frame' | 'museum-acrylic';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface FramingDetail {
  id: FramingOption;
  name: string;
  price: number;
  description: string;
}

export interface MadhubaniProduct {
  id: string;
  ref?: string;
  name?: string;
  slug?: string;
  filename: string;
  image: string;
  cardImage?: string;
  galleryImages?: string[];
  title: string;
  category: string;
  subCategory?: string;
  categoryName: string;
  categoryShort: string;
  style?: MithilaStyle;
  price: number;
  pricePaise?: number;
  originalPrice?: number;
  compareAtPrice?: number | null;
  shortDescription: string;
  longDescription: string;
  story?: string;
  dimensions: string;
  medium: string;
  material?: string;
  technique?: string;
  type?: string;
  stock: number;
  leadTimeDays?: number;
  rating?: number;
  reviewsCount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isFramed?: boolean;
  tags: string[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  short: string;
  icon: string;
  count?: number;
  description?: string;
}

export interface CartItem {
  product: MadhubaniProduct;
  quantity: number;
  framing?: FramingOption;
  framingPrice?: number;
  isGiftWrapped?: boolean;
  giftNote?: string;
}

export interface Order {
  id: string;
  orderId?: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Confirmed' | 'Pending' | 'Packed';
  total: number;
  items: CartItem[];
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod?: 'razorpay' | 'cod';
  paymentStatus?: 'paid' | 'cod_pending' | 'failed' | 'refunded';
}

export type ScreenType =
  | 'home'
  | 'shop'
  | 'product'
  | 'detail'
  | 'about'
  | 'cart'
  | 'contact'
  | 'profile'
  | 'portfolio'
  | 'track'
  | 'all-screens';
