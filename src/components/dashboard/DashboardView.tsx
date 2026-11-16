import React, { useState } from 'react';
import { usePetPlatter } from '../../context/PetPlatterContext';
import { AddPetModal } from '../pets/AddPetModal';
import { BookConsultationModal } from '../consultation/BookConsultationModal';
import { SwitchPlanModal } from './SwitchPlanModal';
import type { ClinicConsultation, SubscriptionStatus } from '../../types';
import { 
  Dog, 
  Stethoscope, 
  Calendar,
  MapPin, 
  Plus, 
  PauseCircle, 
  PlayCircle, 
  Sparkles, 
  Building2, 
  Video, 
  Trash2, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    subscription, 
    pets, 
    consultations, 
    plans, 
    updateSubscriptionStatus, 
    removePet, 
    cancelConsultation, 
    startOnboarding, 
    loadDemoData, 
    actionLoading 
  } = usePetPlatter();

  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isBookConsultOpen, setIsBookConsultOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<ClinicConsultation | null>(null);
  const [isSwitchPlanOpen, setIsSwitchPlanOpen] = useState(false);

  // If no subscription exists
  if (!subscription) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-icon-circle">
            <Dog size={36} />
          </div>
          <h2 className="empty-title">No Active Subscription Found</h2>
          <p className="empty-desc">
            You don't have an active freshly prepared dog food subscription yet. 
            Choose one of our three plans to get started and receive a free veterinary clinic consultation!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => startOnboarding('mid')} className="btn btn-primary">
              <Sparkles size={18} />
              Browse Plans & Subscribe
            </button>
            <button onClick={loadDemoData} disabled={actionLoading} className="btn btn-outline">
              <RotateCcw size={16} />
              Load Sample Demo Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = plans.find(p => p.id === subscription.planId) || plans[0];
  const activeConsultation = consultations.find(c => c.status === 'confirmed' || c.status === 'rescheduled');

  const handleToggleStatus = async () => {
    const nextStatus: SubscriptionStatus = subscription.status === 'active' ? 'paused' : 'active';
    await updateSubscriptionStatus(nextStatus);
  };

  const handleOpenReschedule = (consult: ClinicConsultation) => {
    setRescheduleTarget(consult);
    setIsBookConsultOpen(true);
  };

  const handleCancelAppt = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this veterinary consultation? You can rebook anytime.')) {
      await cancelConsultation(id);
    }
  };

  const handleDeletePet = async (petId: string, petName: string) => {
    if (window.confirm(`Are you sure you want to remove ${petName}'s profile?`)) {
      await removePet(petId);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-box">
          <h1>Member Dashboard</h1>
          <p>Manage your fresh dog food deliveries, canine profiles, and partner clinic appointments.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => setIsAddPetOpen(true)} className="btn btn-outline btn-sm">
            <Plus size={16} /> Add Dog
          </button>
          <button onClick={() => setIsSwitchPlanOpen(true)} className="btn btn-primary btn-sm">
            <Sparkles size={16} /> Switch Plan
          </button>
        </div>
      </div>

      {/* Subscription Hero Card */}
      <div className="sub-status-banner">
        <div className="sub-banner-left">
          <span className="sub-plan-badge">{currentPlan?.name} Plan</span>
          <h2 className="sub-banner-title">
            {subscription.status === 'active' ? 'Subscription is Active' : 'Subscription is Paused'}
          </h2>
          <p className="sub-banner-desc">
            {currentPlan?.proteinSource}. {currentPlan?.deliverySchedule}.
          </p>

          <div className="sub-banner-meta">
            <div className="sub-meta-item">
              <strong>${subscription.pricePerCycle} / {subscription.billingCycle}</strong>
              <span>Billing Cadence</span>
            </div>
            <div className="sub-meta-item">
              <strong>{subscription.nextDeliveryDate}</strong>
              <span>Next Fresh Delivery</span>
            </div>
            <div className="sub-meta-item">
              <strong>{pets.length} {pets.length === 1 ? 'Dog' : 'Dogs'}</strong>
              <span>Covered</span>
            </div>
          </div>
        </div>

        <div className="sub-banner-actions">
          <button
            onClick={handleToggleStatus}
            disabled={actionLoading}
            className="btn btn-outline"
            style={{ background: '#ffffff', color: 'var(--color-text-main)' }}
          >
            {subscription.status === 'active' ? (
              <>
                <PauseCircle size={16} /> Pause Subscription
              </>
            ) : (
              <>
                <PlayCircle size={16} /> Resume Deliveries
              </>
            )}
          </button>
          <button
            onClick={() => setIsSwitchPlanOpen(true)}
            className="btn btn-accent"
          >
            Change Recipes / Tier
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Pets & Delivery, Right = Vet Consultations */}
      <div className="dashboard-grid">
        <div className="dashboard-left-column">
          {/* Pet Profiles Section */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div className="card-title-with-icon">
                <Dog size={22} color="var(--color-primary)" />
                <span>Pet Profiles ({pets.length})</span>
              </div>
              <button 
                onClick={() => setIsAddPetOpen(true)} 
                className="btn btn-outline btn-sm"
              >
                <Plus size={15} /> Add Another Pet
              </button>
            </div>

            {pets.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p>No pets added yet. Add a pet to calculate their daily fresh food portion.</p>
                <button onClick={() => setIsAddPetOpen(true)} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                  <Plus size={14} /> Add Pet Profile
                </button>
              </div>
            ) : (
              <div className="pets-dashboard-grid">
                {pets.map(pet => (
                  <div key={pet.id} className="pet-profile-card">
                    <div className="pet-profile-top">
                      <div className="pet-avatar">🐕</div>
                      <div className="pet-name-block">
                        <h3>{pet.name}</h3>
                        <span className="pet-breed-text">{pet.breed}</span>
                      </div>
                      {pets.length > 1 && (
                        <button
                          onClick={() => handleDeletePet(pet.id, pet.name)}
                          className="modal-close-btn"
                          style={{ marginLeft: 'auto', color: 'var(--color-error)' }}
                          title="Remove profile"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="pet-stats-pills">
                      <span className="pet-stat-chip">
                        {pet.ageYears} {pet.ageYears === 1 ? 'yr' : 'yrs'} {pet.ageMonths ? `${pet.ageMonths}m` : ''}
                      </span>
                      <span className="pet-stat-chip">{pet.weightLbs} lbs (~{pet.weightKg} kg)</span>
                      <span className="pet-stat-chip" style={{ textTransform: 'capitalize' }}>{pet.activityLevel} energy</span>
                    </div>

                    {pet.dietaryNeeds.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Dietary Needs:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {pet.dietaryNeeds.map((need, i) => (
                            <span key={i} className="specialty-tag" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                              ✓ {need}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {pet.healthNotes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <strong>Notes:</strong> {pet.healthNotes}
                      </div>
                    )}

                    <div className="pet-portion-info">
                      <div className="pet-portion-title">Daily Fresh Portion:</div>
                      <div className="pet-portion-val">
                        ~{pet.calculatedDailyPortionGrams || 500}g / day
                        <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>
                          ({pet.calculatedPouchesPerDay || 2} {(pet.calculatedPouchesPerDay || 2) === 1 ? 'pouch' : 'pouches'})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Address Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div className="card-title-with-icon">
                <MapPin size={22} color="var(--color-primary)" />
                <span>Delivery Address</span>
              </div>
              <span className="badge badge-primary">Standard Chilled Box</span>
            </div>

            <div style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--color-text-main)' }}>
              <strong>{subscription.customer.firstName} {subscription.customer.lastName}</strong><br />
              {subscription.customer.address} {subscription.customer.apartment ? `, ${subscription.customer.apartment}` : ''}<br />
              {subscription.customer.city}, {subscription.customer.state} {subscription.customer.zipCode}<br />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Contact: {subscription.customer.email} • {subscription.customer.phone}
              </span>
              {subscription.customer.deliveryNotes && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <strong>Courier drop-off note:</strong> {subscription.customer.deliveryNotes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Free Partner Vet Clinic Consultation */}
        <div className="dashboard-right-column">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div className="card-title-with-icon">
                <Stethoscope size={22} color="var(--color-primary)" />
                <span>Partner Vet Consult</span>
              </div>
              <span className="badge badge-success">Free with Plan</span>
            </div>

            {activeConsultation ? (
              <div className="consultation-card">
                <div className="consultation-badge-free">
                  <CheckCircle2 size={13} />
                  <span>100% Free Voucher Applied (${activeConsultation.valueDollars} Value)</span>
                </div>

                <h3 className="consultation-title">{activeConsultation.clinicName}</h3>
                <div className="consultation-doctor">{activeConsultation.doctorName}</div>

                <div className="consultation-details-grid">
                  <div>
                    <span className="consult-detail-label">Date & Time</span>
                    <div className="consult-detail-val">{activeConsultation.date}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {activeConsultation.timeSlot}
                    </div>
                  </div>

                  <div>
                    <span className="consult-detail-label">Format</span>
                    <div className="consult-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {activeConsultation.mode === 'in-clinic' ? (
                        <>
                          <Building2 size={13} /> In-Clinic
                        </>
                      ) : (
                        <>
                          <Video size={13} /> Telehealth
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="consult-detail-label">Patient</span>
                    <div className="consult-detail-val">🐕 {activeConsultation.petName}</div>
                  </div>

                  <div>
                    <span className="consult-detail-label">Booking Ref</span>
                    <div className="consult-detail-val" style={{ fontFamily: 'monospace' }}>
                      {activeConsultation.bookingReference}
                    </div>
                  </div>
                </div>

                {activeConsultation.notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', background: 'var(--color-bg-warm)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Topics for Vet:</strong> {activeConsultation.notes}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    onClick={() => handleOpenReschedule(activeConsultation)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancelAppt(activeConsultation.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-error)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid rgba(35, 83, 60, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Stethoscope size={20} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                  Claim Your Free Consultation
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  Your subscription includes a free wellness consultation voucher with any accredited partner clinic ($110–$160 value).
                </p>
                <button
                  onClick={() => {
                    setRescheduleTarget(null);
                    setIsBookConsultOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Calendar size={15} /> Book Free Vet Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPetModal isOpen={isAddPetOpen} onClose={() => setIsAddPetOpen(false)} />

      <BookConsultationModal
        isOpen={isBookConsultOpen}
        onClose={() => {
          setIsBookConsultOpen(false);
          setRescheduleTarget(null);
        }}
        rescheduleTarget={rescheduleTarget}
      />

      <SwitchPlanModal
        isOpen={isSwitchPlanOpen}
        onClose={() => setIsSwitchPlanOpen(false)}
        currentPlanId={subscription.planId}
        currentCycle={subscription.billingCycle}
      />
    </div>
  );
};
