import React, { useState } from 'react';
import { usePetPlatter } from '../../context/PetPlatterContext';
import type { BillingCycle, CustomerInfo } from '../../types';
import { PetFormStep } from './PetFormStep';
import type { PetFormData } from './PetFormStep';
import { DeliveryFormStep } from './DeliveryFormStep';
import { ClinicBookingStep } from './ClinicBookingStep';
import type { ClinicBookingData } from './ClinicBookingStep';
import { ReviewStep } from './ReviewStep';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { 
    plans, 
    clinics, 
    selectedPlanForOnboarding, 
    setSelectedPlanForOnboarding, 
    createSubscription, 
    actionLoading,
    setActiveTab
  } = usePetPlatter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('weekly');

  // Form State: Pets
  const [pets, setPets] = useState<PetFormData[]>([
    {
      name: '',
      breed: '',
      ageYears: 3,
      ageMonths: 0,
      weightLbs: 45,
      weightKg: 20.4,
      dietaryNeeds: ['sensitive-stomach'],
      healthNotes: '',
      activityLevel: 'moderate'
    }
  ]);

  // Form State: Customer & Delivery
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryNotes: ''
  });

  // Form State: Free Partner Clinic Consultation
  const defaultClinic = clinics[0];
  const [booking, setBooking] = useState<ClinicBookingData>({
    skipBookingNow: false,
    clinicId: defaultClinic ? defaultClinic.id : '',
    date: defaultClinic?.availableSlots[0]?.date || '2026-11-20',
    timeSlot: defaultClinic?.availableSlots[0]?.slots[0] || '10:00 AM',
    mode: 'in-clinic',
    petName: '',
    notes: ''
  });

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlan = plans.find(p => p.id === selectedPlanForOnboarding) || plans[1] || plans[0];
  const selectedClinic = clinics.find(c => c.id === booking.clinicId);

  // Validation function per step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!selectedPlanForOnboarding) {
        newErrors.plan = 'Please select a subscription plan.';
      }
    } else if (step === 2) {
      pets.forEach((pet, idx) => {
        if (!pet.name.trim()) {
          newErrors[`pet_${idx}_name`] = "Please enter your dog's name.";
        }
        if (!pet.breed.trim()) {
          newErrors[`pet_${idx}_breed`] = 'Please enter or select a breed.';
        }
        if (!pet.weightLbs || pet.weightLbs <= 0) {
          newErrors[`pet_${idx}_weightLbs`] = 'Please enter a valid weight in lbs.';
        }
      });
    } else if (step === 3) {
      if (!customer.firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!customer.lastName.trim()) newErrors.lastName = 'Last name is required.';
      if (!customer.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!customer.phone.trim()) newErrors.phone = 'Phone number is required.';
      if (!customer.address.trim()) newErrors.address = 'Street address is required.';
      if (!customer.city.trim()) newErrors.city = 'City is required.';
      if (!customer.state.trim()) newErrors.state = 'State is required.';
      if (!customer.zipCode.trim()) newErrors.zipCode = 'Postal / Zip code is required.';
    } else if (step === 4) {
      if (!booking.skipBookingNow) {
        if (!booking.clinicId) newErrors.clinicId = 'Please select a partner clinic.';
        if (!booking.date) newErrors.date = 'Please pick an appointment date.';
        if (!booking.timeSlot) newErrors.timeSlot = 'Please pick a time slot.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Sync petName for consultation if single pet
      if (currentStep === 2 && pets.length > 0 && !booking.petName) {
        setBooking(prev => ({ ...prev, petName: pets[0].name || 'Dog' }));
      }
      setCurrentStep(prev => Math.min(5, prev + 1));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setActiveTab('plans');
    } else {
      setCurrentStep(prev => Math.max(1, prev - 1));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSubmitSubscription = async () => {
    const payload = {
      planId: selectedPlanForOnboarding,
      billingCycle,
      customer,
      pets: pets.map(p => ({
        name: p.name.trim(),
        breed: p.breed.trim(),
        ageYears: p.ageYears,
        ageMonths: p.ageMonths,
        weightLbs: p.weightLbs,
        weightKg: p.weightKg,
        dietaryNeeds: p.dietaryNeeds,
        healthNotes: p.healthNotes.trim(),
        activityLevel: p.activityLevel
      })),
      consultation: booking.skipBookingNow
        ? undefined
        : {
            clinicId: booking.clinicId,
            date: booking.date,
            timeSlot: booking.timeSlot,
            mode: booking.mode,
            petName: booking.petName || pets[0]?.name || 'Dog',
            notes: booking.notes
          }
    };

    await createSubscription(payload);
  };

  const stepLabels = ['Plan', 'Pets', 'Delivery', 'Free Vet Consult', 'Review'];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div className="onboarding-wizard">
        {/* Stepper Header */}
        <div className="stepper-header">
          <ol className="stepper-list" aria-label="Subscription progress">
            {stepLabels.map((label, idx) => {
              const stepNumber = idx + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;

              return (
                <li 
                  key={stepNumber}
                  className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="stepper-bubble">
                    {isCompleted ? <Check size={16} /> : stepNumber}
                  </div>
                  <span className="stepper-label">{label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Step Content */}
        <div className="step-content-body">
          {/* STEP 1: Select Plan */}
          {currentStep === 1 && (
            <div>
              <div className="step-intro">
                <h2 className="step-heading">Select Your Subscription Plan</h2>
                <p className="step-desc">
                  Choose the plan tier that best suits your dog's lifestyle. Every plan includes freshly made 
                  human-grade meals and a free partner veterinary clinic consultation.
                </p>
              </div>

              {/* Billing Cycle Switch */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div className="billing-switch-box">
                  <button
                    type="button"
                    className={`billing-switch-btn ${billingCycle === 'weekly' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('weekly')}
                  >
                    Weekly Delivery
                  </button>
                  <button
                    type="button"
                    className={`billing-switch-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('monthly')}
                  >
                    Monthly Delivery
                    <span className="savings-tag">Save 15%</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {plans.map(p => {
                  const isSelected = selectedPlanForOnboarding === p.id;
                  const price = billingCycle === 'monthly' ? p.monthlyPrice : p.weeklyPrice;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanForOnboarding(p.id)}
                      className={`plan-card ${isSelected ? 'highlighted' : ''}`}
                      style={{ cursor: 'pointer', padding: '1.75rem 1.5rem' }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${p.name}`}
                    >
                      {p.badge && (
                        <span className="badge badge-accent" style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>
                          {p.badge}
                        </span>
                      )}
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{p.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', minHeight: '2.5rem' }}>
                        {p.tagline}
                      </p>

                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                        ${price} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/{billingCycle === 'monthly' ? 'mo' : 'wk'}</span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-primary-light)', padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                        ✓ Free Partner Vet Consult included
                      </div>

                      <div style={{ marginTop: 'auto' }}>
                        <button
                          type="button"
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm`}
                          style={{ width: '100%' }}
                        >
                          {isSelected ? '✓ Selected Plan' : 'Select Plan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Pet Profiles */}
          {currentStep === 2 && (
            <PetFormStep
              pets={pets}
              onChange={setPets}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {/* STEP 3: Delivery Details */}
          {currentStep === 3 && (
            <DeliveryFormStep
              data={customer}
              onChange={setCustomer}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {/* STEP 4: Partner Clinic Booking */}
          {currentStep === 4 && (
            <ClinicBookingStep
              clinics={clinics}
              bookingData={booking}
              onChange={setBooking}
              pets={pets}
              errors={errors}
              setErrors={setErrors}
              planName={selectedPlan.name}
            />
          )}

          {/* STEP 5: Final Review */}
          {currentStep === 5 && (
            <ReviewStep
              plan={selectedPlan}
              billingCycle={billingCycle}
              pets={pets}
              customer={customer}
              booking={booking}
              clinicName={selectedClinic?.name}
              doctorName={selectedClinic?.doctorName}
              onEditStep={(step) => setCurrentStep(step)}
              onSubmit={handleSubmitSubscription}
              isSubmitting={actionLoading}
            />
          )}

          {/* Footer Navigation Buttons */}
          {currentStep < 5 && (
            <div className="step-actions">
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-outline"
              >
                <ArrowLeft size={16} />
                {currentStep === 1 ? 'Cancel & Return to Plans' : 'Back'}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                <span>Continue to {stepLabels[currentStep]}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
