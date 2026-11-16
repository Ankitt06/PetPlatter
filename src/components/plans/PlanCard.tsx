import type { SubscriptionPlan, BillingCycle } from '../../types';
import { Check, X, Stethoscope, Sparkles } from 'lucide-react';

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  onSelect: (planId: SubscriptionPlan['id']) => void;
  isCurrentPlan?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  billingCycle,
  onSelect,
  isCurrentPlan = false
}) => {
  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.weeklyPrice;
  const isMid = plan.id === 'mid';
  const isPremium = plan.id === 'premium';

  return (
    <article className={`plan-card ${isMid ? 'highlighted' : ''}`}>
      {plan.badge && (
        <div className="plan-card-badge-top">
          {plan.badge}
        </div>
      )}

      <div className="plan-header">
        <h3 className="plan-tier-name">{plan.name}</h3>
        <p className="plan-tagline">{plan.tagline}</p>
      </div>

      <div className="plan-pricing-box">
        <div className="plan-price-row">
          <span className="plan-price-currency">$</span>
          <span className="plan-price-amount">{price}</span>
          <span className="plan-price-unit">/{billingCycle === 'monthly' ? 'month' : 'week'}</span>
        </div>
        <div className="plan-price-subtext">
          {billingCycle === 'monthly' 
            ? `Billed monthly (~$${Math.round(price / 4.33)}/wk) • 15% discount applied`
            : `Billed weekly • Cancel or pause anytime`}
        </div>
      </div>

      {/* Free Vet Consultation Callout */}
      <div className="vet-inclusion-banner">
        <div className="vet-icon-circle">
          <Stethoscope size={16} />
        </div>
        <div>
          <div className="vet-banner-title">
            <span>Free Partner Vet Consult</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>100% Free</span>
          </div>
          <div className="vet-banner-desc">
            {plan.vetConsultationTier}
          </div>
        </div>
      </div>

      {/* Feature checklist */}
      <ul className="plan-features-list">
        {plan.features.map((feature, idx) => (
          <li 
            key={idx} 
            className={`plan-feature-item ${feature.included ? 'included' : 'excluded'} ${feature.highlight ? 'highlighted' : ''}`}
          >
            {feature.included ? (
              <Check size={18} className="feature-check-icon" />
            ) : (
              <X size={18} className="feature-cross-icon" />
            )}
            <span>{feature.title}</span>
          </li>
        ))}
      </ul>

      <div className="plan-cta-box">
        <button
          onClick={() => onSelect(plan.id)}
          className={`btn ${isMid ? 'btn-accent' : isPremium ? 'btn-primary' : 'btn-outline'} btn-lg`}
          style={{ width: '100%' }}
        >
          {isCurrentPlan ? (
            'Current Plan'
          ) : (
            <>
              <Sparkles size={18} />
              Choose {plan.name}
            </>
          )}
        </button>
      </div>
    </article>
  );
};
