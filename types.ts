export enum ServiceCategory {
  HEALTH = 'Santé',
  BEAUTY = 'Beauté',
  AUTO = 'Automobile',
  HOME = 'Maison',
  SPORT = 'Sport'
}

export enum PricingType {
  FIXED = 'Forfait',
  HOURLY = 'Taux Horaire',
  QUOTE = 'Sur Devis'
}

export interface Service {
  id: string;
  name: string;
  durationMin: number; // 0 if variable
  price: number;
  currency: string;
  pricingType: PricingType;
  description?: string;
}

export interface Provider {
  id: string;
  name: string;
  category: ServiceCategory;
  rating: number;
  reviewCount: number;
  image: string;
  isVerified: boolean;
  isFavorite: boolean; // New field for optimistic UI
  address: string;
  lat: number; // Normalized 0-100 for demo map
  lng: number; // Normalized 0-100 for demo map
  availabilityStatus: 'AVAILABLE' | 'FULL' | 'CLOSING_SOON';
  nextSlot?: string;
  services: Service[];
  loyaltyProgram?: {
    currentPoints: number;
    targetPoints: number;
    reward: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface CartItem {
  serviceId: string;
  providerId: string;
  serviceName: string;
  price: number;
  quantity: number;
}
