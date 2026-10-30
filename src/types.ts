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
  filename: string;
  image: string;
  title: string;
  category: string;
  categoryName: string;
  categoryShort: string;
  style: MithilaStyle;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  longDescription: string;
  dimensions: string;
  medium: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
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
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  items: CartItem[];
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress?: string;
  carrier?: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  artworkTitle?: string;
}

export type ScreenType = 
  | 'home'
  | 'shop'
  | 'detail'
  | 'about'
  | 'cart'
  | 'contact'
  | 'profile'
  | 'all-screens';

export type DeviceFrameType = 'responsive' | 'mobile' | 'tablet' | 'all-grid';

export interface CurrencyRate {
  symbol: string;
  rate: number; // multiplier from INR
  prefix: string;
}
