import React, { useState } from 'react';
import { usePetPlatter } from '../../context/PetPlatterContext';
import { PlanCard } from './PlanCard';
import { PlanComparison } from './PlanComparison';
import { LoadingSkeleton } from '../common/Toast';
import type { BillingCycle, PlanTier } from '../../types';
import { ShieldCheck, Sparkles, Stethoscope, Heart, RefreshCw, AlertCircle } from 'lucide-react';

export const PlansView: React.FC = () => {
  const { plans, isLoading, error, refreshData, startOnboarding, subscription } = usePetPlatter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('weekly');

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <LoadingSkeleton rows={2} height="2.5rem" />
        </div>
        <div className="plans-grid">
          <LoadingSkeleton rows={6} height="3.5rem" />
          <LoadingSkeleton rows={6} height="3.5rem" />
          <LoadingSkeleton rows={6} height="3.5rem" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-icon-circle" style={{ color: 'var(--color-error)' }}>
            <AlertCircle size={32} />
          </div>
          <h2 className="empty-title">Unable to Load Plans</h2>
          <p className="empty-desc">{error}</p>
          <button onClick={refreshData} className="btn btn-primary">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Veterinarian Formulated • Farm-to-Bowl Subscription</span>
        </div>
        <h1 className="hero-title">
          Freshly cooked meals your dog will <em>truly crave</em>, delivered weekly.
        </h1>
        <p className="hero-subtitle">
          Human-grade recipes gently steamed to preserve vital nutrients. 
          Every subscription includes a free wellness consultation with an accredited partner vet clinic.
        </p>

        {/* Guarantees row */}
        <div className="hero-guarantees">
          <div className="hero-guarantee-item">
            <ShieldCheck size={18} />
            <span>100% USDA Human-Grade</span>
          </div>
          <div className="hero-guarantee-item">
            <Stethoscope size={18} />
            <span>Free $110-$160 Vet Consultation</span>
          </div>
          <div className="hero-guarantee-item">
            <Heart size={18} />
            <span>Personalized to Dog’s Weight & Needs</span>
          </div>
        </div>

        {/* Billing Switch (Weekly vs Monthly) */}
        <div className="billing-switch-wrapper">
          <div className="billing-switch-box" role="radiogroup" aria-label="Billing frequency">
            <button
              type="button"
              role="radio"
              aria-checked={billingCycle === 'weekly'}
              className={`billing-switch-btn ${billingCycle === 'weekly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('weekly')}
            >
              Weekly Delivery
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={billingCycle === 'monthly'}
              className={`billing-switch-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Delivery
              <span className="savings-tag">Save 15%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plan Cards Grid */}
      <div className="plans-grid">
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            onSelect={(planId: PlanTier) => startOnboarding(planId)}
            isCurrentPlan={subscription?.planId === plan.id}
          />
        ))}
      </div>

      {/* Comparison Matrix Table */}
      <PlanComparison />
    </div>
  );
};
