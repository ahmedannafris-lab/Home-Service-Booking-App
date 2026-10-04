export type ScreenId =
  | 'splash'
  | 'payment-success'
  | 'payment'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'role-selection'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'home'
  | 'categories'
  | 'category-detail'
  | 'service-detail'
  | 'bookings'
  | 'messages'
  | 'history'
  | 'profile';

export type UserRole = 'customer' | 'provider' | 'admin';

export interface ServiceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'warning' | 'tertiary';
  rating: number;
  reviewCount: number;
  duration: string;
  features: string[];
  image: string;
  includesList?: string[];
  specialistId?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  specCount: number;
  bgClass: string;
  iconBgClass: string;
  heroImage: string;
  heroTagline: string;
  heroSubtag: string;
  heroHeadline: string;
  heroBadges: string[];
  availableToday: number;
  filterPills: string[];
  specialistId: string;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  jobsCompleted: number;
  distance: string;
  eta: string;
  avatar: string;
  verified: boolean;
  status: 'Live Now' | 'Available Today' | 'On Job';
  bio: string;
  skills: string[];
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  location: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  categoryName: string;
  date: string;
  timeSlot: string;
  address: string;
  price: number;
  status: 'transit' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  specialist: Specialist;
  etaMinutes?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'specialist' | 'system';
  text: string;
  timestamp: string;
}
