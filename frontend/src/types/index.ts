export interface Sabji {
  name: string;
  imageUrl: string;
  isSpecial: boolean;
}

export interface Menu {
  _id: string;
  mealType: 'lunch' | 'dinner';
  listOfSabjis: Sabji[];
  baseOptions: string[];
  basePrice: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  mealType: 'lunch' | 'dinner';
  sabjisSelected: string[];
  base: 'roti' | 'roti+rice' | 'rice';
  extraRoti: number;
  isSpecial: boolean;
  quantity: number;
  basePrice: number;
  totalPrice: number;
}

export interface Address {
  label: string;
  address: string;
  lat: number;
  lng: number;
  phoneNumber?: string;
}

export interface Order {
  _id: string;
  userId: string;
  menuId: string;
  sabjisSelected: string[];
  base: 'roti' | 'roti+rice' | 'rice';
  extraRoti: number;
  isSpecial: boolean;
  quantity: number;
  totalPrice: number;
  tipMoney?: number;
  address: Address;
  otp: string;
  status: 'Confirmed' | 'on-the-way' | 'delivered';
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface MealBuilderStep {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}