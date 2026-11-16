export type PlanTier = 'basic' | 'mid' | 'premium';
export type BillingCycle = 'weekly' | 'monthly';
export type SubscriptionStatus = 'active' | 'paused' | 'canceled';
export type ConsultationMode = 'in-clinic' | 'telehealth';
export type ConsultationStatus = 'confirmed' | 'completed' | 'rescheduled' | 'canceled';

export interface PlanFeature {
  title: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  description: string;
  weeklyPrice: number;
  monthlyPrice: number; // Includes 15% discount
  recipes: string[];
  proteinSource: string;
  portionCustomization: string;
  deliverySchedule: string;
  vetConsultationTier: string;
  packaging: string;
  features: PlanFeature[];
  badge?: string;
  recommendedFor: string;
  accentColor: string;
}

export interface PetProfile {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightLbs: number;
  weightKg: number;
  dietaryNeeds: string[];
  healthNotes: string;
  activityLevel: 'low' | 'moderate' | 'high' | 'working';
  calculatedDailyPortionGrams?: number;
  calculatedPouchesPerDay?: number;
  createdAt: string;
}

export interface PartnerClinic {
  id: string;
  name: string;
  doctorName: string;
  doctorCredentials: string;
  address: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  modesOffered: ConsultationMode[];
  image: string;
  phone: string;
  availableSlots: {
    date: string;
    slots: string[];
  }[];
}

export interface ClinicConsultation {
  id: string;
  clinicId: string;
  clinicName: string;
  doctorName: string;
  petId: string;
  petName: string;
  date: string;
  timeSlot: string;
  mode: ConsultationMode;
  notes?: string;
  status: ConsultationStatus;
  voucherApplied: boolean;
  valueDollars: number; // e.g. $120 covered 100% free with subscription
  bookingReference: string;
  createdAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryNotes?: string;
}

export interface Subscription {
  id: string;
  planId: PlanTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  customer: CustomerInfo;
  petIds: string[];
  consultationId?: string;
  currentPeriodStart: string;
  nextDeliveryDate: string;
  pricePerCycle: number;
  createdAt: string;
}

// Simulated API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  status: number;
}
