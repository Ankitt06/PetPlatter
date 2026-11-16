import { usePetPlatter } from '../../context/PetPlatterContext';
import { Check, X, Sparkles } from 'lucide-react';
import type { PlanTier } from '../../types';

export const PlanComparison: React.FC = () => {
  const { plans, startOnboarding, subscription } = usePetPlatter();

  const handleSelect = (planId: PlanTier) => {
    startOnboarding(planId);
  };

  return (
    <section className="comparison-section">
      <div className="section-heading-box">
        <span className="section-eyebrow">Direct Comparison</span>
        <h2 className="section-title">Compare All Three Fresh Platter Plans</h2>
        <p className="section-subtitle">
          Every tier is crafted with USDA human-grade ingredients and includes a free partner veterinary clinic consultation.
        </p>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature / Specification</th>
              {plans.map(p => (
                <th key={p.id}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{p.name}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    ${p.weeklyPrice}/wk (${p.monthlyPrice}/mo)
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Category: Fresh Ingredients & Nutrition */}
            <tr className="feature-category-row">
              <td colSpan={4}>Fresh Food Quality & Sourcing</td>
            </tr>
            <tr>
              <td><strong>100% USDA Human-Grade Meat</strong></td>
              <td><Check size={20} className="table-check" /></td>
              <td><Check size={20} className="table-check" /></td>
              <td><Check size={20} className="table-check" /></td>
            </tr>
            <tr>
              <td><strong>Protein Sources</strong></td>
              <td>Single (Cage-Free Chicken)</td>
              <td>Dual (Angus Beef & Salmon)</td>
              <td>Triple (Turkey, Venison & Salmon)</td>
            </tr>
            <tr>
              <td><strong>Gently Cooked (&lt;165°F)</strong></td>
              <td><Check size={20} className="table-check" /></td>
              <td><Check size={20} className="table-check" /></td>
              <td><Check size={20} className="table-check" /></td>
            </tr>
            <tr>
              <td><strong>Micronutrient Personalization</strong></td>
              <td>Standard AAFCO Balance</td>
              <td>Enhanced Joint & Omega-3s</td>
              <td>Tailored to Pet Health Notes & Allergies</td>
            </tr>

            {/* Category: Veterinary Partnership */}
            <tr className="feature-category-row">
              <td colSpan={4}>Partner Veterinary Clinic Consultation</td>
            </tr>
            <tr>
              <td><strong>Free Partner Vet Consultation</strong></td>
              <td>
                <span className="badge badge-success">Free ($110 Value)</span>
              </td>
              <td>
                <span className="badge badge-success">Free ($135 Value)</span>
              </td>
              <td>
                <span className="badge badge-success">Free ($160 Value)</span>
              </td>
            </tr>
            <tr>
              <td><strong>Consultation Modes</strong></td>
              <td>In-Clinic or Telehealth</td>
              <td>In-Clinic or Telehealth</td>
              <td>In-Clinic or Telehealth</td>
            </tr>
            <tr>
              <td><strong>Priority Booking Slots</strong></td>
              <td><X size={20} className="table-cross" /></td>
              <td><Check size={20} className="table-check" /></td>
              <td><Check size={20} className="table-check" /></td>
            </tr>
            <tr>
              <td><strong>Direct Nutritionist Chat</strong></td>
              <td><X size={20} className="table-cross" /></td>
              <td><X size={20} className="table-cross" /></td>
              <td><Check size={20} className="table-check" /></td>
            </tr>

            {/* Category: Packaging & Portions */}
            <tr className="feature-category-row">
              <td colSpan={4}>Portioning & Logistics</td>
            </tr>
            <tr>
              <td><strong>Portion Precision</strong></td>
              <td>Weight Bracket Portioning</td>
              <td>Gram-Customized Daily Pouches</td>
              <td>Precision Multi-pouch Clinical Ration</td>
            </tr>
            <tr>
              <td><strong>Packaging</strong></td>
              <td>BPA-free vacuum sealed pouches</td>
              <td>Pre-portioned tear-and-serve</td>
              <td>Zero-waste compostable insulated tote</td>
            </tr>
            <tr>
              <td><strong>Delivery Cadence</strong></td>
              <td>Standard Weekly</td>
              <td>Weekly or Bi-Weekly</td>
              <td>Weekly with VIP Morning Window</td>
            </tr>

            {/* Action Row */}
            <tr>
              <td><strong>Get Started</strong></td>
              {plans.map(p => (
                <td key={p.id}>
                  <button
                    onClick={() => handleSelect(p.id)}
                    className={`btn ${p.id === 'mid' ? 'btn-accent' : p.id === 'premium' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    style={{ width: '100%' }}
                  >
                    {subscription?.planId === p.id ? 'Active Plan' : (
                      <>
                        <Sparkles size={14} />
                        Select {p.name}
                      </>
                    )}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
