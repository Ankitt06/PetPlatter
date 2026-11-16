import React from 'react';
import type { SubscriptionPlan, BillingCycle, CustomerInfo } from '../../types';
import type { PetFormData } from './PetFormStep';
import type { ClinicBookingData } from './ClinicBookingStep';
import { calculatePortion } from '../../api/mockData';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface ReviewStepProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  pets: PetFormData[];
  customer: CustomerInfo;
  booking: ClinicBookingData;
  clinicName?: string;
  doctorName?: string;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  plan,
  billingCycle,
  pets,
  customer,
  booking,
  clinicName,
  doctorName,
  onEditStep,
  onSubmit,
  isSubmitting
}) => {
  const basePrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.weeklyPrice;
  const cycleUnit = billingCycle === 'monthly' ? 'month' : 'week';
  const voucherValue = plan.id === 'premium' ? 160 : plan.id === 'mid' ? 135 : 110;

  return (
    <div>
      <div className="step-intro">
        <h2 className="step-heading">Review & Confirm Your Subscription</h2>
        <p className="step-desc">
          Please review your plan, pet profiles, delivery address, and partner vet consultation before starting.
        </p>
      </div>

      <div className="review-summary-card">
        {/* Plan Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-light)' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>Selected Plan</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              {plan.name} ({billingCycle === 'monthly' ? 'Monthly Delivery' : 'Weekly Delivery'})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{plan.proteinSource}</p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--color-primary)', fontWeight: 600 }}
          >
            Change Plan
          </button>
        </div>

        {/* Pets Info */}
        <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
              Pets in Subscription ({pets.length})
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-primary)', fontWeight: 600, padding: 0 }}
            >
              Edit Pets
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pets.map((pet, i) => {
              const portion = calculatePortion(pet.weightLbs, pet.ageYears, pet.activityLevel);
              return (
                <div 
                  key={i} 
                  style={{ 
                    background: '#ffffff', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '0.85rem 1rem', 
                    border: '1px solid var(--color-border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <strong>🐕 {pet.name}</strong> • {pet.breed} • {pet.weightLbs} lbs ({pet.ageYears} yrs)
                    {pet.dietaryNeeds.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        Dietary: {pet.dietaryNeeds.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    Portion: ~{portion.dailyGrams}g / day
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Details */}
        <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
              Delivery Destination
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-primary)', fontWeight: 600, padding: 0 }}
            >
              Edit Address
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
            <div>
              <strong>{customer.firstName} {customer.lastName}</strong> ({customer.email} • {customer.phone})<br />
              {customer.address} {customer.apartment ? `, ${customer.apartment}` : ''}<br />
              {customer.city}, {customer.state} {customer.zipCode}
            </div>
          </div>
        </div>

        {/* Partner Clinic Consultation Booking */}
        <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
              Partner Vet Consultation
            </span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-primary)', fontWeight: 600, padding: 0 }}
            >
              Edit Appointment
            </button>
          </div>

          {booking.skipBookingNow ? (
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <em>Unscheduled voucher saved to your dashboard ($0 fee / 100% covered).</em>
            </div>
          ) : (
            <div style={{
              background: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              border: '1px solid rgba(35, 83, 60, 0.2)',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <strong style={{ color: 'var(--color-primary)' }}>
                  🏥 {clinicName || 'Partner Veterinary Clinic'}
                </strong>
                <span className="badge badge-success">Free Voucher Applied</span>
              </div>
              <div style={{ color: 'var(--color-text-main)' }}>
                {doctorName && <span>Doctor: {doctorName} • </span>}
                Date: <strong>{booking.date} at {booking.timeSlot}</strong> ({booking.mode === 'in-clinic' ? 'In-Clinic Visit' : 'Video Telehealth'})
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Patient: 🐕 {booking.petName} • Regular fee: ${voucherValue}.00 → <strong>Covered $0.00 Free</strong>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div style={{ paddingTop: '1rem' }}>
          <div className="review-row">
            <span className="review-label">Subscription ({plan.name} - {billingCycle}):</span>
            <span className="review-value">${basePrice}.00</span>
          </div>

          <div className="review-row">
            <span className="review-label">Temperature-Monitored Chilled Shipping:</span>
            <span className="review-value" style={{ color: 'var(--color-success)' }}>FREE</span>
          </div>

          <div className="review-row">
            <span className="review-label">Partner Vet Clinic Consultation Voucher:</span>
            <span className="review-value" style={{ color: 'var(--color-success)' }}>
              FREE <span style={{ textDecoration: 'line-through', color: 'var(--color-text-light)', fontWeight: 'normal', fontSize: '0.85rem' }}>(${voucherValue})</span>
            </span>
          </div>

          <div className="review-total-row">
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)' }}>Total Due Today:</div>
              <div style={{ fontSize: '0.785rem', color: 'var(--color-text-muted)' }}>
                Recurring ${basePrice} per {cycleUnit} • Pause, skip or cancel anytime
              </div>
            </div>
            <div className="review-value">
              ${basePrice}.00
            </div>
          </div>
        </div>
      </div>

      {/* Trust reassurance */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)'
      }}>
        <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>100% Happiness & Clean Bowl Guarantee:</strong> If your dog doesn’t completely love the food, 
          we’ll adjust their recipe or refund your first box. No long-term contracts.
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="btn btn-accent btn-lg"
        style={{ width: '100%', fontSize: '1.15rem' }}
      >
        {isSubmitting ? (
          <>
            <RotateCcw className="spinning-icon" size={20} />
            Setting Up Fresh Deliveries & Booking Vet Appointment...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Confirm Subscription & Claim Free Vet Consultation (${basePrice})
          </>
        )}
      </button>
    </div>
  );
};
