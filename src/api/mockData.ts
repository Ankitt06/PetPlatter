import type { SubscriptionPlan, PartnerClinic } from '../types';

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Essential Fresh',
    tagline: 'Wholesome, single-protein fresh food for everyday vitality',
    description: 'Perfect for dogs with standard dietary needs seeking a fresh, human-grade upgrade from dry kibble.',
    weeklyPrice: 39,
    monthlyPrice: 139,
    accentColor: '#4A7C59',
    proteinSource: 'Single Protein: Cage-Free Gently Steamed Chicken',
    portionCustomization: 'Standard weight-bracket portioning',
    deliverySchedule: 'Weekly standard temperature-chilled box',
    vetConsultationTier: '1 Free Partner-Clinic General Wellness Consultation ($110 value)',
    packaging: 'BPA-free vacuum sealed pouches (refrigerate or freeze)',
    recommendedFor: 'Healthy dogs looking for clean, whole-food nutrition without artificial fillers.',
    recipes: [
      'Farmhouse Chicken & Sweet Potato Mash',
      'Harvest Garden Vegetables & Brown Rice',
      'Organic Kelp & Calcium Booster'
    ],
    features: [
      { title: '100% Human-Grade USDA inspected ingredients', included: true },
      { title: 'Gently steam-cooked under 165°F to preserve vitamins', included: true },
      { title: '1 Free Partner Clinic Vet Consultation ($110 value)', included: true, highlight: true },
      { title: 'Standard weekly delivery schedule', included: true },
      { title: 'Daily portion feeding guide included', included: true },
      { title: 'Dual-protein rotational recipes', included: false },
      { title: 'Custom joint & coat active boosters', included: false },
      { title: 'Direct nutritionist access & priority vet slots', included: false }
    ]
  },
  {
    id: 'mid',
    name: 'Vitality Active',
    tagline: 'Dual-protein tailored fuel with coat & joint boosters',
    description: 'Our most popular plan: custom-portioned according to your dog’s exact age, weight, and energy level.',
    weeklyPrice: 59,
    monthlyPrice: 209,
    badge: 'Most Popular',
    accentColor: '#2D5A43',
    proteinSource: 'Dual Protein: Grass-Fed Beef & Wild Pacific Salmon',
    portionCustomization: 'Gram-precise customized daily pouches by weight & activity',
    deliverySchedule: 'Weekly or bi-weekly flexible delivery options',
    vetConsultationTier: '1 Free Partner-Clinic Nutrition & Mobility Consultation ($135 value) + Priority Slots',
    packaging: 'Pre-portioned tear-and-serve daily pouches in insulated eco-liner',
    recommendedFor: 'Active dogs, growing pups, or pets needing enhanced joint and digestive care.',
    recipes: [
      'Ranch-Raised Beef & Wild Alaskan Salmon',
      'Butternut Squash, Spinach & Chia Seed Medley',
      'Cold-Pressed EPA/DHA Omega-3 & Prebiotic Chicory Root'
    ],
    features: [
      { title: '100% Human-Grade USDA inspected ingredients', included: true },
      { title: 'Gently steam-cooked under 165°F to preserve vitamins', included: true },
      { title: '1 Free Partner Clinic Vet Consultation ($135 value)', included: true, highlight: true },
      { title: 'Priority clinic booking & evening slots', included: true, highlight: true },
      { title: 'Dual-protein rotational recipes (Beef & Salmon)', included: true },
      { title: 'Custom weight-calculated daily pre-portioned pouches', included: true },
      { title: 'Cold-pressed Omega-3 & digestive probiotic boost', included: true },
      { title: 'Quarterly direct clinical check-in', included: false }
    ]
  },
  {
    id: 'premium',
    name: 'Optimal Longevity',
    tagline: 'Gourmet wild proteins with clinical micronutrient personalization',
    description: 'The pinnacle of canine culinary medicine. Personalized to health notes, allergies, and breed longevity markers.',
    weeklyPrice: 79,
    monthlyPrice: 279,
    badge: 'Best Value & Care',
    accentColor: '#935824',
    proteinSource: 'Triple Protein: Pasture-Raised Turkey, Venison & Wild Salmon',
    portionCustomization: 'Clinical-grade personalized pouches tailored to health notes',
    deliverySchedule: 'Flexible weekly delivery with priority morning delivery window',
    vetConsultationTier: '1 Free Comprehensive Partner-Clinic Exam ($160 value) + Direct Vet Nutritionist Chat',
    packaging: 'Zero-waste compostable thermal liners with insulated cooler bag',
    recommendedFor: 'Dogs with allergies, sensitive stomachs, senior wellness needs, or discerning palates.',
    recipes: [
      'Heritage Turkey & Roasted Kabocha Squash',
      'Free-Range Venison & Wild Blueberries',
      'Targeted Joint (Glucosamine/MSM) & Gut Microbiome Micronutrient Blend'
    ],
    features: [
      { title: '100% Human-Grade USDA inspected ingredients', included: true },
      { title: 'Gently steam-cooked under 165°F to preserve vitamins', included: true },
      { title: '1 Free Comprehensive Partner Clinic Exam ($160 value)', included: true, highlight: true },
      { title: 'Guaranteed VIP priority appointment slots', included: true, highlight: true },
      { title: 'Triple protein rotational menu (Turkey, Venison & Salmon)', included: true },
      { title: 'Custom formulation adapted to your pet’s health notes', included: true, highlight: true },
      { title: 'Prescription-grade organic superfoods & antioxidants', included: true },
      { title: 'Unlimited direct messaging with a veterinary nutritionist', included: true, highlight: true }
    ]
  }
];

export const PARTNER_CLINICS: PartnerClinic[] = [
  {
    id: 'clinic-evergreen',
    name: 'Evergreen Veterinary Medical Center',
    doctorName: 'Dr. Sarah Henderson, DVM, CVA',
    doctorCredentials: 'Cornell Vet 2012 • Certified Veterinary Acupuncturist & Nutritionist',
    neighborhood: 'Downtown / Central',
    address: '428 Pine Street, Suite 100, Metro City',
    phone: '(555) 234-8890',
    rating: 4.9,
    reviewCount: 312,
    specialties: ['Canine Nutrition & Weight Management', 'Digestive Health', 'Preventative Longevity'],
    modesOffered: ['in-clinic', 'telehealth'],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    availableSlots: [
      {
        date: '2026-11-20',
        slots: ['09:30 AM', '11:00 AM', '02:15 PM', '04:00 PM']
      },
      {
        date: '2026-11-21',
        slots: ['10:00 AM', '01:30 PM', '03:45 PM']
      },
      {
        date: '2026-11-23',
        slots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']
      },
      {
        date: '2026-11-24',
        slots: ['10:30 AM', '01:00 PM', '03:30 PM']
      }
    ]
  },
  {
    id: 'clinic-northwest',
    name: 'Northwest Animal Hospital & Holistic Care',
    doctorName: 'Dr. Marcus Vance, DVM, DACVIM',
    doctorCredentials: 'UC Davis Vet 2010 • Board Certified Small Animal Internal Medicine',
    neighborhood: 'North Hills',
    address: '1520 Northway Blvd, Suite 2B, Metro City',
    phone: '(555) 876-4432',
    rating: 4.9,
    reviewCount: 248,
    specialties: ['Allergies & Dermatology', 'Food Elimination Protocols', 'Immune Support'],
    modesOffered: ['in-clinic', 'telehealth'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    availableSlots: [
      {
        date: '2026-11-20',
        slots: ['10:00 AM', '01:00 PM', '03:00 PM']
      },
      {
        date: '2026-11-22',
        slots: ['09:00 AM', '11:15 AM', '02:30 PM']
      },
      {
        date: '2026-11-23',
        slots: ['10:30 AM', '01:45 PM', '04:15 PM']
      },
      {
        date: '2026-11-25',
        slots: ['09:30 AM', '12:00 PM', '02:45 PM']
      }
    ]
  },
  {
    id: 'clinic-oakwood',
    name: 'Oakwood Integrative Pet Wellness',
    doctorName: 'Dr. Elena Rostova, DVM, CVFT',
    doctorCredentials: 'Penn Vet 2015 • Certified Veterinary Food Therapist',
    neighborhood: 'Westside Park',
    address: '890 Oakwood Avenue, Metro City',
    phone: '(555) 654-1120',
    rating: 4.8,
    reviewCount: 194,
    specialties: ['Senior Dog Care & Mobility', 'Joint Therapeutics', 'Fresh Food Transitioning'],
    modesOffered: ['in-clinic', 'telehealth'],
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    availableSlots: [
      {
        date: '2026-11-21',
        slots: ['11:00 AM', '01:30 PM', '04:00 PM']
      },
      {
        date: '2026-11-22',
        slots: ['10:00 AM', '12:30 PM', '03:15 PM']
      },
      {
        date: '2026-11-24',
        slots: ['09:00 AM', '11:45 AM', '02:30 PM']
      },
      {
        date: '2026-11-26',
        slots: ['10:15 AM', '01:15 PM', '03:45 PM']
      }
    ]
  },
  {
    id: 'clinic-pacific',
    name: 'Pacific Pet Telehealth Specialists',
    doctorName: 'Dr. James Lin, DVM',
    doctorCredentials: 'Tufts Cummings Vet 2016 • Virtual Canine Nutritionist',
    neighborhood: 'Virtual / Statewide Video Consults',
    address: 'Online Video Consult Suite (Any location)',
    phone: '(555) 345-9988',
    rating: 5.0,
    reviewCount: 420,
    specialties: ['Convenient Virtual Consults', 'Behavior & Feeding Routines', 'Lab Work Dietary Review'],
    modesOffered: ['telehealth'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    availableSlots: [
      {
        date: '2026-11-19',
        slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:30 PM']
      },
      {
        date: '2026-11-20',
        slots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM', '05:45 PM']
      },
      {
        date: '2026-11-21',
        slots: ['09:15 AM', '11:45 AM', '02:15 PM', '05:00 PM']
      },
      {
        date: '2026-11-22',
        slots: ['10:00 AM', '01:00 PM', '03:00 PM', '06:00 PM']
      }
    ]
  }
];

export const COMMON_DOG_BREEDS = [
  'Golden Retriever',
  'Labrador Retriever',
  'French Bulldog',
  'German Shepherd',
  'Poodle (Standard / Mini)',
  'Cavapoo / Doodle Mix',
  'Beagle',
  'Rottweiler',
  'Dachshund',
  'Siberian Husky',
  'Boxer',
  'Yorkshire Terrier',
  'Australian Shepherd',
  'Border Collie',
  'Corgi (Pembroke Welsh)',
  'Mixed Rescue Pup'
];

export const DIETARY_NEEDS_OPTIONS = [
  { id: 'grain-free', label: 'Grain-Free (Legume & Grain Sensitive)' },
  { id: 'sensitive-stomach', label: 'Sensitive Stomach / Easy Digest' },
  { id: 'poultry-free', label: 'Poultry-Free (No Chicken or Turkey)' },
  { id: 'weight-management', label: 'Weight Management / Low-Fat' },
  { id: 'joint-support', label: 'Joint & Mobility Enrichment' },
  { id: 'skin-coat', label: 'Skin & Coat Support (High Omega-3)' },
  { id: 'hypoallergenic', label: 'Hypoallergenic Single Protein' },
  { id: 'picky-eater', label: 'Picky Eater / Palatability Enhanced' }
];

// Helper to calculate daily grams based on weight & age
export function calculatePortion(weightLbs: number, ageYears: number, activityLevel: string): { dailyGrams: number; pouchesPerDay: number } {
  const weight = Math.max(2, weightLbs || 25);
  // Base daily calorie needs ~ 70 * (weightKg)^0.75
  // Fresh dog food is ~ 1.3 - 1.5 kcal/gram
  let factor = 1.0;
  if (ageYears < 1) factor = 1.4; // Puppy needs more
  else if (ageYears >= 8) factor = 0.85; // Senior
  
  if (activityLevel === 'low') factor *= 0.9;
  if (activityLevel === 'high') factor *= 1.2;
  if (activityLevel === 'working') factor *= 1.4;

  const baseGrams = Math.round(weight * 11 * factor);
  const dailyGrams = Math.max(120, Math.min(1100, baseGrams));
  const pouchesPerDay = dailyGrams > 450 ? 2 : 1;
  return { dailyGrams, pouchesPerDay };
}

// Pre-seeded demo state (optional to load or start fresh)
export const DEMO_PET: any = {
  id: 'pet-demo-1',
  name: 'Buster',
  breed: 'Golden Retriever',
  ageYears: 3,
  ageMonths: 6,
  weightLbs: 65,
  weightKg: 29.5,
  activityLevel: 'high',
  dietaryNeeds: ['sensitive-stomach', 'joint-support'],
  healthNotes: 'Mild seasonal grass allergies and occasional loose stool with dry kibble.',
  calculatedDailyPortionGrams: 580,
  calculatedPouchesPerDay: 2,
  createdAt: new Date().toISOString()
};

export const DEMO_CUSTOMER = {
  firstName: 'Emily',
  lastName: 'Chen',
  email: 'emily.chen@example.com',
  phone: '(555) 890-1234',
  address: '742 Evergreen Terrace',
  apartment: 'Apt 4B',
  city: 'Portland',
  state: 'OR',
  zipCode: '97201',
  deliveryNotes: 'Please place insulated bag behind porch planter.'
};
