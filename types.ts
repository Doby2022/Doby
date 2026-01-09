
export interface Carpet {
  id: string;
  length: string;
  width: string;
}

export interface Totals {
  totalArea: number;
  totalPrice: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  progress: number;
}

export type AppScreen = 'calculator' | 'location' | 'scheduling' | 'observations' | 'success';

export interface SchedulingData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  observations?: string;
}
