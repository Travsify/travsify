export enum TravelVertical {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  INSURANCE = 'insurance',
  VISA = 'visa',
  TRANSFER = 'transfer',
  EXPERIENCE = 'experience',
}

export interface UnifiedPrice {
  baseAmount: number;      // Net rate from provider
  travsifyFee: number;    // Your platform fee
  tenantMarkup: number;   // The developer's markup
  totalAmount: number;    // Final price shown to user
  currency: string;
}

export interface UnifiedFlight {
  id: string;
  vertical: TravelVertical.FLIGHT;
  provider: string;
  segments: any[];
  price: UnifiedPrice;
  source: string;
}

export interface UnifiedHotel {
  id: string;
  vertical: TravelVertical.HOTEL;
  provider: string;
  name: string;
  location: string;
  stars: number;
  amenities: string[];
  price: UnifiedPrice;
  image: string;
}

export interface UnifiedInsurance {
  id: string;
  vertical: TravelVertical.INSURANCE;
  provider: string;
  planName: string;
  coverageDetails: any;
  price: UnifiedPrice;
}

export interface UnifiedVisa {
  id: string;
  vertical: TravelVertical.VISA;
  destination: string;
  nationality: string;
  requirements: string[];
  processingTime: string;
  price: UnifiedPrice;
}
