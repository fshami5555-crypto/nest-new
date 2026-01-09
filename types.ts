
export type UserStatus = 'عزباء' | 'متزوجة' | 'حامل' | 'أم';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  password?: string; // Added password field
  birthDate: string;
  height: number;
  weight: number;
  status: UserStatus;
  // Cycle Tracking
  hasPeriod: boolean;
  isPeriodRegular: boolean;
  cycleLength: number; // usually 28
  lastPeriodDate?: string;
  pregnancyDueDate?: string;
  isAdmin?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: number;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: 'قيد الانتظار' | 'تم الشحن' | 'تم التوصيل';
  governorate: string;
  address: string;
  timestamp: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: 'بشرة' | 'أسرة' | 'رشاقة';
  timestamp: number;
}
