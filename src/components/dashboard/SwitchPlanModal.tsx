import React, { useState } from 'react';
import { usePetPlatter } from '../../context/PetPlatterContext';
import type { PlanTier, BillingCycle } from '../../types';
import { X, Sparkles, RotateCcw } from 'lucide-react';

interface SwitchPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: PlanTier;
  currentCycle: BillingCycle;
}

export const SwitchPlanModal: React.FC<SwitchPlanModalProps> = ({
  isOpen,
  onClose,
  currentPlanId,
  currentCycle
}) => {
  const { plans, switchPlan, actionLoading } = usePetPlatter();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanTier>(currentPlanId);
  const [cycle, setCycle] = useState<BillingCycle>(currentCycle);

  if (!isOpen) return null;

  const handleSwitch = async () => {
    if (selectedPlanId === currentPlanId && cycle === currentCycle) {
      onClose();
      return;
    }
    const ok = await switchPlan(selectedPlanId, cycle);
    if (ok) onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="switch-plan-title">
      <div className="modal-dialog" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--color-primary)" />
            <h2 id="switch-plan-title" className="modal-title">Switch Subscription Plan</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Upgrade or switch your recipes anytime. Changes take effect on your next scheduled fresh delivery.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="billing-switch-box">
              <button
                type="button"
                className={`billing-switch-btn ${cycle === 'weekly' ? 'active' : ''}`}
                onClick={() => setCycle('weekly')}
              >
                Weekly Delivery
              </button>
              <button
                type="button"
                className={`billing-switch-btn ${cycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setCycle('monthly')}
              >
                Monthly Delivery (15% off)
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {plans.map(p => {
              const isSelected = selectedPlanId === p.id;
              const isCurrent = currentPlanId === p.id && currentCycle === cycle;
              const price = cycle === 'monthly' ? p.monthlyPrice : p.weeklyPrice;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`plan-card ${isSelected ? 'highlighted' : ''}`}
                  style={{ padding: '1.25rem', cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{p.name}</h3>
                    {isCurrent && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Current</span>}
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0.5rem 0' }}>
                    ${price}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/{cycle === 'monthly' ? 'mo' : 'wk'}</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    {p.proteinSource}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button type="button" onClick={handleSwitch} disabled={actionLoading} className="btn btn-primary">
            {actionLoading ? (
              <>
                <RotateCcw className="spinning-icon" size={16} /> Updating...
              </>
            ) : (
              'Confirm Plan Switch'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
