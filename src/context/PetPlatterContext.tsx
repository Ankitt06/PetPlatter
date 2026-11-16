import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  SubscriptionPlan,
  PartnerClinic,
  PetProfile,
  Subscription,
  ClinicConsultation,
  PlanTier,
  BillingCycle,
  CustomerInfo,
  SubscriptionStatus
} from '../types';
import { apiClient } from '../api/client';

export type NavigationTab = 'plans' | 'compare' | 'onboard' | 'dashboard' | 'clinics';

interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface PetPlatterContextType {
  // Navigation & View
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedPlanForOnboarding: PlanTier;
  setSelectedPlanForOnboarding: (planId: PlanTier) => void;
  startOnboarding: (planId?: PlanTier) => void;

  // Data
  plans: SubscriptionPlan[];
  clinics: PartnerClinic[];
  subscription: Subscription | null;
  pets: PetProfile[];
  consultations: ClinicConsultation[];

  // States
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  toast: ToastState | null;
  isSimulatingError: boolean;

  // Actions
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: () => void;
  toggleSimulateError: (enable: boolean) => void;
  refreshData: () => Promise<void>;
  createSubscription: (payload: {
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
  }) => Promise<boolean>;
  updateSubscriptionStatus: (status: SubscriptionStatus) => Promise<boolean>;
  switchPlan: (newPlanId: PlanTier, billingCycle?: BillingCycle) => Promise<boolean>;
  addPet: (pet: Omit<PetProfile, 'id' | 'createdAt'>) => Promise<boolean>;
  updatePet: (id: string, updates: Partial<PetProfile>) => Promise<boolean>;
  removePet: (id: string) => Promise<boolean>;
  bookConsultation: (payload: {
    clinicId: string;
    petId: string;
    petName: string;
    date: string;
    timeSlot: string;
    mode: 'in-clinic' | 'telehealth';
    notes?: string;
  }) => Promise<boolean>;
  rescheduleConsultation: (id: string, newDate: string, newTimeSlot: string) => Promise<boolean>;
  cancelConsultation: (id: string) => Promise<boolean>;
  loadDemoData: () => Promise<void>;
  clearData: () => Promise<void>;
}

const PetPlatterContext = createContext<PetPlatterContextType | undefined>(undefined);

export const PetPlatterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('plans');
  const [selectedPlanForOnboarding, setSelectedPlanForOnboarding] = useState<PlanTier>('mid');
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [clinics, setClinics] = useState<PartnerClinic[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [consultations, setConsultations] = useState<ClinicConsultation[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSimulatingError, setIsSimulatingError] = useState<boolean>(apiClient.isSimulatingError());

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast after 5s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleSimulateError = useCallback((enable: boolean) => {
    apiClient.setSimulateError(enable);
    setIsSimulatingError(enable);
    showToast(
      enable
        ? 'Network Error Simulation ENABLED (Next API call will fail to test error UI)'
        : 'Network Error Simulation DISABLED (Normal API responses restored)',
      enable ? 'error' : 'info'
    );
  }, [showToast]);

  // Initial load
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [plansRes, clinicsRes, subRes, petsRes, consultRes] = await Promise.all([
        apiClient.getPlans(),
        apiClient.getPartnerClinics(),
        apiClient.getSubscription(),
        apiClient.getPets(),
        apiClient.getConsultations()
      ]);

      setPlans(plansRes.data);
      setClinics(clinicsRes.data);
      setSubscription(subRes.data);
      setPets(petsRes.data);
      setConsultations(consultRes.data);

      // If user has active subscription, default tab to dashboard if they didn't specify
      if (subRes.data && window.location.hash === '#dashboard') {
        setActiveTab('dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch application data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const startOnboarding = useCallback((planId?: PlanTier) => {
    if (planId) {
      setSelectedPlanForOnboarding(planId);
    }
    setActiveTab('onboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const createSubscription = useCallback(async (payload: {
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
  }): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await apiClient.createSubscription(payload);
      setSubscription(res.data.subscription);
      setPets(res.data.pets);
      if (res.data.consultation) {
        setConsultations(prev => [res.data.consultation!, ...prev]);
      }
      showToast('Welcome to PetPlatter! Your fresh food subscription & free vet consultation are active.', 'success');
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Subscription failed. Please verify details and try again.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const updateSubscriptionStatus = useCallback(async (status: SubscriptionStatus): Promise<boolean> => {
    if (!subscription) return false;
    setActionLoading(true);
    try {
      const res = await apiClient.updateSubscriptionStatus(subscription.id, status);
      setSubscription(res.data);
      showToast(`Subscription status updated to ${status}.`, 'info');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to update subscription.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [subscription, showToast]);

  const switchPlan = useCallback(async (newPlanId: PlanTier, billingCycle?: BillingCycle): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await apiClient.switchPlan(newPlanId, billingCycle);
      setSubscription(res.data);
      showToast(`Subscription successfully switched to ${newPlanId.toUpperCase()}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to switch plan.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const addPet = useCallback(async (petData: Omit<PetProfile, 'id' | 'createdAt'>): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await apiClient.addPet(petData);
      setPets(prev => [...prev, res.data]);
      showToast(`${res.data.name} was successfully added! Fresh portions calculated.`, 'success');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to add pet.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const updatePet = useCallback(async (id: string, updates: Partial<PetProfile>): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await apiClient.updatePet(id, updates);
      setPets(prev => prev.map(p => (p.id === id ? res.data : p)));
      showToast(`${res.data.name}'s profile was updated.`, 'success');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to update pet.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const removePet = useCallback(async (id: string): Promise<boolean> => {
    setActionLoading(true);
    try {
      await apiClient.deletePet(id);
      setPets(prev => prev.filter(p => p.id !== id));
      showToast('Pet profile removed.', 'info');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete pet.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const bookConsultation = useCallback(async (payload: {
    clinicId: string;
    petId: string;
    petName: string;
    date: string;
    timeSlot: string;
    mode: 'in-clinic' | 'telehealth';
    notes?: string;
  }): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await apiClient.bookConsultation(payload);
      setConsultations(prev => [res.data, ...prev]);
      showToast('Partner clinic consultation appointment confirmed! $0 charged (covered 100%).', 'success');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to book consultation.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const rescheduleConsultation = useCallback(async (id: string, newDate: string, newTimeSlot: string): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await apiClient.rescheduleConsultation(id, newDate, newTimeSlot);
      setConsultations(prev => prev.map(c => (c.id === id ? res.data : c)));
      showToast('Consultation appointment rescheduled successfully.', 'success');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to reschedule appointment.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const cancelConsultation = useCallback(async (id: string): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await apiClient.cancelConsultation(id);
      setConsultations(prev => prev.map(c => (c.id === id ? res.data : c)));
      showToast('Consultation appointment canceled.', 'info');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to cancel appointment.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const loadDemoData = useCallback(async () => {
    setActionLoading(true);
    try {
      const res = await apiClient.seedDemoData();
      setSubscription(res.data.subscription);
      setPets(res.data.pets);
      setConsultations([res.data.consultation]);
      showToast('Loaded demo customer, pet profile, and confirmed vet consultation!', 'success');
      setActiveTab('dashboard');
    } catch (err: any) {
      showToast(err?.message || 'Failed to load demo data.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const clearData = useCallback(async () => {
    setActionLoading(true);
    try {
      await apiClient.clearAllData();
      setSubscription(null);
      setPets([]);
      setConsultations([]);
      showToast('Cleared all local data. You can now test the fresh subscription journey.', 'info');
      setActiveTab('plans');
    } catch (err: any) {
      showToast(err?.message || 'Failed to clear data.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      selectedPlanForOnboarding,
      setSelectedPlanForOnboarding,
      startOnboarding,
      plans,
      clinics,
      subscription,
      pets,
      consultations,
      isLoading,
      actionLoading,
      error,
      toast,
      isSimulatingError,
      showToast,
      dismissToast,
      toggleSimulateError,
      refreshData,
      createSubscription,
      updateSubscriptionStatus,
      switchPlan,
      addPet,
      updatePet,
      removePet,
      bookConsultation,
      rescheduleConsultation,
      cancelConsultation,
      loadDemoData,
      clearData
    }),
    [
      activeTab,
      selectedPlanForOnboarding,
      startOnboarding,
      plans,
      clinics,
      subscription,
      pets,
      consultations,
      isLoading,
      actionLoading,
      error,
      toast,
      isSimulatingError,
      showToast,
      dismissToast,
      toggleSimulateError,
      refreshData,
      createSubscription,
      updateSubscriptionStatus,
      switchPlan,
      addPet,
      updatePet,
      removePet,
      bookConsultation,
      rescheduleConsultation,
      cancelConsultation,
      loadDemoData,
      clearData
    ]
  );

  return <PetPlatterContext.Provider value={value}>{children}</PetPlatterContext.Provider>;
};

export const usePetPlatter = (): PetPlatterContextType => {
  const context = useContext(PetPlatterContext);
  if (!context) {
    throw new Error('usePetPlatter must be used within a PetPlatterProvider');
  }
  return context;
};
