import { Provider, ServiceCategory, PricingType } from './types';

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: "L'Atelier Barbier",
    category: ServiceCategory.BEAUTY,
    rating: 4.9,
    reviewCount: 128,
    image: "https://picsum.photos/400/300?random=1",
    isVerified: true,
    isFavorite: false,
    address: "12 Rue de la République",
    lat: 30,
    lng: 40,
    availabilityStatus: 'AVAILABLE',
    nextSlot: "14:30",
    services: [
      { id: 's1', name: 'Coupe Homme', durationMin: 30, price: 25, currency: '€', pricingType: PricingType.FIXED },
      { id: 's2', name: 'Taille Barbe', durationMin: 15, price: 15, currency: '€', pricingType: PricingType.FIXED },
      { id: 's2b', name: 'Soin Visage', durationMin: 20, price: 35, currency: '€', pricingType: PricingType.FIXED }
    ],
    loyaltyProgram: { currentPoints: 8, targetPoints: 10, reward: "-50% sur la prochaine coupe" }
  },
  {
    id: '2',
    name: "Garage Auto-Tech",
    category: ServiceCategory.AUTO,
    rating: 4.7,
    reviewCount: 84,
    image: "https://picsum.photos/400/300?random=2",
    isVerified: true,
    isFavorite: true,
    address: "Zone Industrielle Nord",
    lat: 65,
    lng: 70,
    availabilityStatus: 'FULL',
    nextSlot: "Demain 09:00",
    services: [
      { id: 's3', name: 'Vidange Complète', durationMin: 60, price: 89, currency: '€', pricingType: PricingType.FIXED },
      { id: 's4', name: 'Diagnostic Panne', durationMin: 0, price: 60, currency: '€', pricingType: PricingType.HOURLY }
    ],
    loyaltyProgram: { currentPoints: 2, targetPoints: 5, reward: "Lavage offert" }
  },
  {
    id: '3',
    name: "Dr. Sophie Martin",
    category: ServiceCategory.HEALTH,
    rating: 5.0,
    reviewCount: 210,
    image: "https://picsum.photos/400/300?random=3",
    isVerified: true,
    isFavorite: false,
    address: "Centre Médical Pasteur",
    lat: 45,
    lng: 25,
    availabilityStatus: 'AVAILABLE',
    nextSlot: "16:15",
    services: [
      { id: 's5', name: 'Consultation Générale', durationMin: 15, price: 26.50, currency: '€', pricingType: PricingType.FIXED }
    ]
  },
  {
    id: '4',
    name: "Yoga Flow Studio",
    category: ServiceCategory.SPORT,
    rating: 4.8,
    reviewCount: 56,
    image: "https://picsum.photos/400/300?random=4",
    isVerified: false,
    isFavorite: false,
    address: "45 Boulevard des Capucines",
    lat: 20,
    lng: 60,
    availabilityStatus: 'AVAILABLE',
    nextSlot: "18:00",
    services: [
      { id: 's6', name: 'Séance Collective', durationMin: 60, price: 15, currency: '€', pricingType: PricingType.FIXED },
      { id: 's7', name: 'Coaching Privé', durationMin: 60, price: 70, currency: '€', pricingType: PricingType.FIXED }
    ],
    loyaltyProgram: { currentPoints: 4, targetPoints: 10, reward: "1 cours offert" }
  },
  {
    id: '5',
    name: "Plomberie Express 24/7",
    category: ServiceCategory.HOME,
    rating: 4.5,
    reviewCount: 32,
    image: "https://picsum.photos/400/300?random=5",
    isVerified: true,
    isFavorite: false,
    address: "Service à domicile",
    lat: 55,
    lng: 50,
    availabilityStatus: 'AVAILABLE',
    nextSlot: "Immédiat",
    services: [
      { id: 's8', name: 'Recherche de fuite', durationMin: 0, price: 0, currency: '€', pricingType: PricingType.QUOTE }
    ]
  }
];

export const APP_COLOR = '#1E90FF'; // Royal Blue
