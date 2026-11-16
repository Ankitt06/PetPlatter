import React from 'react';
import type { PartnerClinic, ConsultationMode } from '../../types';
import type { PetFormData } from './PetFormStep';
import { 
  Stethoscope, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Check, 
  Video, 
  Building2, 
  AlertCircle
} from 'lucide-react';

export interface ClinicBookingData {
  skipBookingNow: boolean;
  clinicId: string;
  date: string;
  timeSlot: string;
  mode: ConsultationMode;
  petName: string;
  notes: string;
}

interface ClinicBookingStepProps {
  clinics: PartnerClinic[];
  bookingData: ClinicBookingData;
  onChange: (data: ClinicBookingData) => void;
  pets: PetFormData[];
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  planName: string;
}

export const ClinicBookingStep: React.FC<ClinicBookingStepProps> = ({
  clinics,
  bookingData,
  onChange,
  pets,
  errors,
  setErrors,
  planName
}) => {
  const selectedClinic = clinics.find(c => c.id === bookingData.clinicId) || clinics[0];

  const update = (field: keyof ClinicBookingData, value: any) => {
    onChange({ ...bookingData, [field]: value });
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSelectClinic = (clinic: PartnerClinic) => {
    const firstDateObj = clinic.availableSlots[0];
    const defaultMode: ConsultationMode = clinic.modesOffered.includes('in-clinic') ? 'in-clinic' : 'telehealth';

    onChange({
      ...bookingData,
      clinicId: clinic.id,
      date: firstDateObj ? firstDateObj.date : '',
      timeSlot: firstDateObj?.slots[0] || '',
      mode: defaultMode
    });
  };

  // Find available slots for currently selected date
  const selectedDateSlots = selectedClinic?.availableSlots.find(s => s.date === bookingData.date)?.slots || [];

  return (
    <div>
      <div className="step-intro">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-success">Included Free With Your Plan</span>
        </div>
        <h2 className="step-heading">Book Your Free Partner Vet Consultation</h2>
        <p className="step-desc">
          Your <strong>{planName}</strong> subscription includes a complimentary wellness and nutrition consultation 
          with a board-certified veterinary doctor ($110–$160 value).
        </p>
      </div>

      {/* Toggle to book now or later */}
      <div style={{
        background: 'var(--color-bg-warm)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Stethoscope size={20} color="var(--color-primary)" />
          <div>
            <strong style={{ fontSize: '0.925rem', color: 'var(--color-text-main)', display: 'block' }}>
              Complimentary Consultation Voucher
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              100% covered • No co-pay or clinic fee required
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => update('skipBookingNow', !bookingData.skipBookingNow)}
          className="btn btn-outline btn-sm"
        >
          {bookingData.skipBookingNow ? '✓ I will book now instead' : 'Book later from dashboard'}
        </button>
      </div>

      {bookingData.skipBookingNow ? (
        <div className="empty-state" style={{ padding: '2.5rem 1.5rem' }}>
          <div className="empty-icon-circle">
            <Calendar size={28} />
          </div>
          <h3 className="empty-title">Booking Saved For Later</h3>
          <p className="empty-desc">
            No problem! Your free veterinary consultation voucher will be waiting in your customer dashboard 
            whenever you’re ready to pick a time.
          </p>
        </div>
      ) : (
        <>
          {/* Clinic Selection List */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              1. Choose Partner Veterinary Clinic *
              <span className="form-label-hint">Accredited clinics in our network</span>
            </label>

            <div className="clinics-grid">
              {clinics.map(clinic => {
                const isSelected = clinic.id === bookingData.clinicId;
                return (
                  <div
                    key={clinic.id}
                    className={`clinic-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectClinic(clinic)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${clinic.name}`}
                  >
                    <img 
                      src={clinic.image} 
                      alt={clinic.name} 
                      className="clinic-img-thumb" 
                    />
                    <div>
                      <div className="clinic-info-name">{clinic.name}</div>
                      <div className="clinic-doctor-sub">{clinic.doctorName}</div>
                      <div className="clinic-address-sub">
                        <MapPin size={13} />
                        <span>{clinic.address}</span>
                      </div>
                      <div className="clinic-specialties-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.5rem' }}>
                          <Star size={13} fill="#eab308" color="#eab308" />
                          <strong style={{ fontSize: '0.785rem' }}>{clinic.rating}</strong>
                        </div>
                        {clinic.specialties.map((s, i) => (
                          <span key={i} className="specialty-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="clinic-select-indicator">
                      {isSelected && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.clinicId && (
              <div className="form-error-msg">
                <AlertCircle size={13} /> {errors.clinicId}
              </div>
            )}
          </div>

          {/* Consultation Mode & Pet Assignment */}
          <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
            {/* Mode selection */}
            <div className="form-group">
              <label className="form-label">2. Consultation Format</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {selectedClinic?.modesOffered.includes('in-clinic') && (
                  <button
                    type="button"
                    onClick={() => update('mode', 'in-clinic')}
                    className={`chip-btn ${bookingData.mode === 'in-clinic' ? 'selected' : ''}`}
                    style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Building2 size={16} />
                    <span>In-Clinic Visit</span>
                  </button>
                )}
                {selectedClinic?.modesOffered.includes('telehealth') && (
                  <button
                    type="button"
                    onClick={() => update('mode', 'telehealth')}
                    className={`chip-btn ${bookingData.mode === 'telehealth' ? 'selected' : ''}`}
                    style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Video size={16} />
                    <span>Video Telehealth</span>
                  </button>
                )}
              </div>
            </div>

            {/* Target Pet selection */}
            <div className="form-group">
              <label className="form-label">Which Pet is this for?</label>
              <select
                value={bookingData.petName}
                onChange={e => update('petName', e.target.value)}
                className="form-select"
              >
                {pets.map((p, idx) => (
                  <option key={idx} value={p.name || `Dog #${idx + 1}`}>
                    🐕 {p.name || `Dog #${idx + 1}`} ({p.breed || 'Dog'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Slot Selection */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              3. Select Appointment Date & Time *
            </label>

            {/* Date Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {selectedClinic?.availableSlots.map(slotObj => {
                const isSelectedDate = bookingData.date === slotObj.date;
                const dateObj = new Date(slotObj.date + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <button
                    key={slotObj.date}
                    type="button"
                    onClick={() => {
                      update('date', slotObj.date);
                      if (!slotObj.slots.includes(bookingData.timeSlot)) {
                        update('timeSlot', slotObj.slots[0]);
                      }
                    }}
                    className={`chip-btn ${isSelectedDate ? 'selected' : ''}`}
                    style={{
                      padding: '0.65rem 1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '95px'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>{dayName}</span>
                    <strong style={{ fontSize: '0.95rem' }}>{monthDay}</strong>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Buttons */}
            <div style={{ marginTop: '0.85rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                Available Times on {bookingData.date}:
              </div>
              <div className="time-slots-grid">
                {selectedDateSlots.map((time, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => update('timeSlot', time)}
                    className={`time-slot-btn ${bookingData.timeSlot === time ? 'selected' : ''}`}
                  >
                    <Clock size={13} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                    {time}
                  </button>
                ))}
              </div>
              {errors.timeSlot && (
                <div className="form-error-msg" style={{ marginTop: '0.5rem' }}>
                  <AlertCircle size={13} /> {errors.timeSlot}
                </div>
              )}
            </div>
          </div>

          {/* Primary Consultation Concern */}
          <div className="form-group">
            <label className="form-label" htmlFor="consult-concern">
              Topic or Questions for the Vet <span className="form-label-hint">Optional</span>
            </label>
            <textarea
              id="consult-concern"
              rows={2}
              placeholder="e.g. Discuss transitioning from dry kibble to fresh food, Buster's sensitive stomach, or recommended joint supplements..."
              value={bookingData.notes}
              onChange={e => update('notes', e.target.value)}
              className="form-textarea"
            />
          </div>
        </>
      )}
    </div>
  );
};
