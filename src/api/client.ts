import type {
  SubscriptionPlan,
  PartnerClinic,
  PetProfile,
  Subscription,
  ClinicConsultation,
  ApiResponse,
  PlanTier,
  BillingCycle,
  CustomerInfo,
  SubscriptionStatus
} from '../types';
import {
  INITIAL_PLANS,
  PARTNER_CLINICS,
  DEMO_PET,
  DEMO_CUSTOMER,
  calculatePortion
} from './mockData';

const STORAGE_KEYS = {
  SUBSCRIPTION: 'petplatter_subscription',
  PETS: 'petplatter_pets',
  CONSULTATIONS: 'petplatter_consultations',
  ERROR_SIMULATION: 'petplatter_simulate_error'
};

class SimulatedApiClient {
  private latencyMs: number = 550;
  private simulateError: boolean = false;

  constructor() {
    // Check if error simulation was stored
    const storedError = localStorage.getItem(STORAGE_KEYS.ERROR_SIMULATION);
    if (storedError) {
      this.simulateError = storedError === 'true';
    }
  }

  public setLatency(ms: number) {
    this.latencyMs = ms;
  }

  public setSimulateError(enable: boolean) {
    this.simulateError = enable;
    localStorage.setItem(STORAGE_KEYS.ERROR_SIMULATION, String(enable));
  }

  public isSimulatingError(): boolean {
    return this.simulateError;
  }

  private async delay(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.simulateError) {
          reject(new Error('Simulated network connectivity error (500 Internal Server Error). Please try again.'));
        } else {
          resolve();
        }
      }, this.latencyMs);
    });
  }

  // --- PLANS ---
  public async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    await this.delay();
    return {
      success: true,
      data: INITIAL_PLANS,
      timestamp: new Date().toISOString()
    };
  }

  public async getPlanById(id: PlanTier): Promise<ApiResponse<SubscriptionPlan | null>> {
    await this.delay();
    const plan = INITIAL_PLANS.find(p => p.id === id) || null;
    return {
      success: true,
      data: plan,
      timestamp: new Date().toISOString()
    };
  }

  // --- CLINICS ---
  public async getPartnerClinics(): Promise<ApiResponse<PartnerClinic[]>> {
    await this.delay();
    return {
      success: true,
      data: PARTNER_CLINICS,
      timestamp: new Date().toISOString()
    };
  }

  // --- SUBSCRIPTIONS ---
  public async getSubscription(): Promise<ApiResponse<Subscription | null>> {
    await this.delay();
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!raw) {
      return {
        success: true,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
    try {
      const subscription: Subscription = JSON.parse(raw);
      return {
        success: true,
        data: subscription,
        timestamp: new Date().toISOString()
      };
    } catch {
      return {
        success: true,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }

  public async createSubscription(payload: {
    planId: PlanTier;
    billingCycle: BillingCycle;
    customer: CustomerInfo;
    pets: Omit<PetProfile, 'id' | 'createdAt'>[];
    consultation?: {
      clinicId: string;
      date: string;
      timeSlot: string;
      mode: 'in-clinic' | 'telehealth';
      petName: string;
      notes?: string;
    };
  }): Promise<ApiResponse<{ subscription: Subscription; pets: PetProfile[]; consultation?: ClinicConsultation }>> {
    await this.delay();

    const plan = INITIAL_PLANS.find(p => p.id === payload.planId);
    if (!plan) {
      throw new Error(`Plan ${payload.planId} not found.`);
    }

    // Create pet records
    const createdPets: PetProfile[] = payload.pets.map((p, idx) => {
      const { dailyGrams, pouchesPerDay } = calculatePortion(p.weightLbs, p.ageYears, p.activityLevel);
      return {
        ...p,
        id: `pet-${Date.now()}-${idx + 1}`,
        calculatedDailyPortionGrams: dailyGrams,
        calculatedPouchesPerDay: pouchesPerDay,
        createdAt: new Date().toISOString()
      };
    });

    // Save pets to local storage
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(createdPets));

    let createdConsultation: ClinicConsultation | undefined = undefined;
    if (payload.consultation) {
      const clinic = PARTNER_CLINICS.find(c => c.id === payload.consultation?.clinicId);
      const consultationPet = createdPets.find(p => p.name === payload.consultation?.petName) || createdPets[0];

      createdConsultation = {
        id: `consult-${Date.now()}`,
        clinicId: payload.consultation.clinicId,
        clinicName: clinic ? clinic.name : 'Partner Veterinary Clinic',
        doctorName: clinic ? clinic.doctorName : 'Partner Veterinary Doctor',
        petId: consultationPet ? consultationPet.id : createdPets[0]?.id || 'unknown',
        petName: payload.consultation.petName || createdPets[0]?.name || 'Dog',
        date: payload.consultation.date,
        timeSlot: payload.consultation.timeSlot,
        mode: payload.consultation.mode,
        notes: payload.consultation.notes || '',
        status: 'confirmed',
        voucherApplied: true,
        valueDollars: payload.planId === 'premium' ? 160 : payload.planId === 'mid' ? 135 : 110,
        bookingReference: `PP-VET-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString()
      };

      const existingConsultationsRaw = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      const consultations: ClinicConsultation[] = existingConsultationsRaw ? JSON.parse(existingConsultationsRaw) : [];
      consultations.unshift(createdConsultation);
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
    }

    // Determine delivery & pricing
    const nextDelivery = new Date();
    nextDelivery.setDate(nextDelivery.getDate() + 3);

    const pricePerCycle = payload.billingCycle === 'monthly' ? plan.monthlyPrice : plan.weeklyPrice;

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      planId: payload.planId,
      billingCycle: payload.billingCycle,
      status: 'active',
      customer: payload.customer,
      petIds: createdPets.map(p => p.id),
      consultationId: createdConsultation?.id,
      currentPeriodStart: new Date().toISOString(),
      nextDeliveryDate: nextDelivery.toISOString().split('T')[0],
      pricePerCycle,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(newSubscription));

    return {
      success: true,
      data: {
        subscription: newSubscription,
        pets: createdPets,
        consultation: createdConsultation
      },
      message: 'Subscription created successfully with free veterinary consultation!',
      timestamp: new Date().toISOString()
    };
  }

  public async updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<ApiResponse<Subscription>> {
    await this.delay();
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!raw) throw new Error('No active subscription found');
    const sub: Subscription = JSON.parse(raw);
    if (sub.id !== id) throw new Error('Subscription ID mismatch');

    sub.status = status;
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));

    return {
      success: true,
      data: sub,
      message: `Subscription status updated to ${status}`,
      timestamp: new Date().toISOString()
    };
  }

  public async switchPlan(newPlanId: PlanTier, billingCycle?: BillingCycle): Promise<ApiResponse<Subscription>> {
    await this.delay();
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!raw) throw new Error('No active subscription found');
    const sub: Subscription = JSON.parse(raw);
    const plan = INITIAL_PLANS.find(p => p.id === newPlanId);
    if (!plan) throw new Error('Plan not found');

    sub.planId = newPlanId;
    if (billingCycle) sub.billingCycle = billingCycle;
    sub.pricePerCycle = sub.billingCycle === 'monthly' ? plan.monthlyPrice : plan.weeklyPrice;

    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));

    return {
      success: true,
      data: sub,
      message: `Switched plan to ${plan.name}`,
      timestamp: new Date().toISOString()
    };
  }

  // --- PETS ---
  public async getPets(): Promise<ApiResponse<PetProfile[]>> {
    await this.delay();
    const raw = localStorage.getItem(STORAGE_KEYS.PETS);
    if (!raw) {
      return {
        success: true,
        data: [],
        timestamp: new Date().toISOString()
      };
    }
    try {
      const pets: PetProfile[] = JSON.parse(raw);
      return {
        success: true,
        data: pets,
        timestamp: new Date().toISOString()
      };
    } catch {
      return {
        success: true,
        data: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  public async addPet(petData: Omit<PetProfile, 'id' | 'createdAt'>): Promise<ApiResponse<PetProfile>> {
    await this.delay();
    const { dailyGrams, pouchesPerDay } = calculatePortion(petData.weightLbs, petData.ageYears, petData.activityLevel);

    const newPet: PetProfile = {
      ...petData,
      id: `pet-${Date.now()}`,
      calculatedDailyPortionGrams: dailyGrams,
      calculatedPouchesPerDay: pouchesPerDay,
      createdAt: new Date().toISOString()
    };

    const currentPetsRes = await this.getPets();
    const currentPets = currentPetsRes.data;
    currentPets.push(newPet);
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(currentPets));

    // Also update subscription petIds if subscription exists
    const subRaw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (subRaw) {
      const sub: Subscription = JSON.parse(subRaw);
      if (!sub.petIds.includes(newPet.id)) {
        sub.petIds.push(newPet.id);
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
      }
    }

    return {
      success: true,
      data: newPet,
      message: `${newPet.name}'s profile has been created!`,
      timestamp: new Date().toISOString()
    };
  }

  public async updatePet(id: string, updates: Partial<PetProfile>): Promise<ApiResponse<PetProfile>> {
    await this.delay();
    const currentPetsRes = await this.getPets();
    const currentPets = currentPetsRes.data;
    const petIndex = currentPets.findIndex(p => p.id === id);
    if (petIndex === -1) throw new Error('Pet profile not found');

    const updated = { ...currentPets[petIndex], ...updates };
    if (updates.weightLbs !== undefined || updates.ageYears !== undefined || updates.activityLevel !== undefined) {
      const { dailyGrams, pouchesPerDay } = calculatePortion(
        updated.weightLbs,
        updated.ageYears,
        updated.activityLevel
      );
      updated.calculatedDailyPortionGrams = dailyGrams;
      updated.calculatedPouchesPerDay = pouchesPerDay;
    }

    currentPets[petIndex] = updated;
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(currentPets));

    return {
      success: true,
      data: updated,
      message: `${updated.name}'s profile was updated`,
      timestamp: new Date().toISOString()
    };
  }

  public async deletePet(id: string): Promise<ApiResponse<boolean>> {
    await this.delay();
    const currentPetsRes = await this.getPets();
    const updatedPets = currentPetsRes.data.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(updatedPets));

    const subRaw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (subRaw) {
      const sub: Subscription = JSON.parse(subRaw);
      sub.petIds = sub.petIds.filter(petId => petId !== id);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    }

    return {
      success: true,
      data: true,
      message: 'Pet profile removed',
      timestamp: new Date().toISOString()
    };
  }

  // --- CONSULTATIONS ---
  public async getConsultations(): Promise<ApiResponse<ClinicConsultation[]>> {
    await this.delay();
    const raw = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    if (!raw) {
      return { success: true, data: [], timestamp: new Date().toISOString() };
    }
    try {
      const list: ClinicConsultation[] = JSON.parse(raw);
      return { success: true, data: list, timestamp: new Date().toISOString() };
    } catch {
      return { success: true, data: [], timestamp: new Date().toISOString() };
    }
  }

  public async bookConsultation(payload: {
    clinicId: string;
    petId: string;
    petName: string;
    date: string;
    timeSlot: string;
    mode: 'in-clinic' | 'telehealth';
    notes?: string;
  }): Promise<ApiResponse<ClinicConsultation>> {
    await this.delay();
    const clinic = PARTNER_CLINICS.find(c => c.id === payload.clinicId);
    if (!clinic) throw new Error('Clinic not found');

    const subRaw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    const subPlan = subRaw ? JSON.parse(subRaw).planId : 'basic';
    const valueDollars = subPlan === 'premium' ? 160 : subPlan === 'mid' ? 135 : 110;

    const consultation: ClinicConsultation = {
      id: `consult-${Date.now()}`,
      clinicId: payload.clinicId,
      clinicName: clinic.name,
      doctorName: clinic.doctorName,
      petId: payload.petId,
      petName: payload.petName,
      date: payload.date,
      timeSlot: payload.timeSlot,
      mode: payload.mode,
      notes: payload.notes || '',
      status: 'confirmed',
      voucherApplied: true,
      valueDollars,
      bookingReference: `PP-VET-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };

    const currentListRes = await this.getConsultations();
    const updated = [consultation, ...currentListRes.data];
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updated));

    // Update subscription consultation reference
    if (subRaw) {
      const sub: Subscription = JSON.parse(subRaw);
      sub.consultationId = consultation.id;
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    }

    return {
      success: true,
      data: consultation,
      message: 'Partner clinic consultation booked successfully!',
      timestamp: new Date().toISOString()
    };
  }

  public async rescheduleConsultation(
    id: string,
    newDate: string,
    newTimeSlot: string
  ): Promise<ApiResponse<ClinicConsultation>> {
    await this.delay();
    const currentListRes = await this.getConsultations();
    const list = currentListRes.data;
    const item = list.find(c => c.id === id);
    if (!item) throw new Error('Consultation appointment not found');

    item.date = newDate;
    item.timeSlot = newTimeSlot;
    item.status = 'rescheduled';

    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(list));

    return {
      success: true,
      data: item,
      message: 'Consultation rescheduled successfully',
      timestamp: new Date().toISOString()
    };
  }

  public async cancelConsultation(id: string): Promise<ApiResponse<ClinicConsultation>> {
    await this.delay();
    const currentListRes = await this.getConsultations();
    const list = currentListRes.data;
    const item = list.find(c => c.id === id);
    if (!item) throw new Error('Consultation appointment not found');

    item.status = 'canceled';
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(list));

    return {
      success: true,
      data: item,
      message: 'Consultation canceled',
      timestamp: new Date().toISOString()
    };
  }

  // --- SEED / RESET DEMO DATA ---
  public async seedDemoData(): Promise<ApiResponse<{ subscription: Subscription; pets: PetProfile[]; consultation: ClinicConsultation }>> {
    await this.delay();
    const pets: PetProfile[] = [DEMO_PET];
    const consultation: ClinicConsultation = {
      id: 'consult-demo-1',
      clinicId: 'clinic-evergreen',
      clinicName: 'Evergreen Veterinary Medical Center',
      doctorName: 'Dr. Sarah Henderson, DVM, CVA',
      petId: DEMO_PET.id,
      petName: DEMO_PET.name,
      date: '2026-11-23',
      timeSlot: '11:00 AM',
      mode: 'in-clinic',
      notes: 'Initial nutrition transition checkup & discussion of sensitive digestion.',
      status: 'confirmed',
      voucherApplied: true,
      valueDollars: 135,
      bookingReference: 'PP-VET-883921',
      createdAt: new Date().toISOString()
    };

    const nextDelivery = new Date();
    nextDelivery.setDate(nextDelivery.getDate() + 4);

    const subscription: Subscription = {
      id: 'sub-demo-1',
      planId: 'mid',
      billingCycle: 'weekly',
      status: 'active',
      customer: DEMO_CUSTOMER,
      petIds: [DEMO_PET.id],
      consultationId: consultation.id,
      currentPeriodStart: new Date().toISOString(),
      nextDeliveryDate: nextDelivery.toISOString().split('T')[0],
      pricePerCycle: 59,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify([consultation]));

    return {
      success: true,
      data: { subscription, pets, consultation },
      message: 'Demo subscription & pet profile loaded!',
      timestamp: new Date().toISOString()
    };
  }

  public async clearAllData(): Promise<ApiResponse<boolean>> {
    await this.delay();
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
    localStorage.removeItem(STORAGE_KEYS.PETS);
    localStorage.removeItem(STORAGE_KEYS.CONSULTATIONS);
    return {
      success: true,
      data: true,
      message: 'All local data cleared. You can start fresh onboarding.',
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance. Notice: Any component or hook imports `apiClient`.
// When transitioning to real backend endpoints, this file or an adapter can simply point to `fetch('/api/...')`
// without altering any UI components!
export const apiClient = new SimulatedApiClient();
