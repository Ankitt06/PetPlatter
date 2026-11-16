import React, { useState } from 'react';
import { usePetPlatter } from '../../context/PetPlatterContext';
import type { ClinicConsultation, ConsultationMode } from '../../types';
import { X, Clock, Stethoscope, Video, Building2, AlertCircle, RotateCcw } from 'lucide-react';

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rescheduleTarget?: ClinicConsultation | null;
}

export const BookConsultationModal: React.FC<BookConsultationModalProps> = ({
  isOpen,
  onClose,
  rescheduleTarget
}) => {
  const { clinics, pets, bookConsultation, rescheduleConsultation, actionLoading } = usePetPlatter();

  const isRescheduling = !!rescheduleTarget;
  const initialClinicId = rescheduleTarget ? rescheduleTarget.clinicId : clinics[0]?.id || '';
  const [clinicId, setClinicId] = useState(initialClinicId);

  const selectedClinic = clinics.find(c => c.id === clinicId) || clinics[0];
  const [date, setDate] = useState(rescheduleTarget ? rescheduleTarget.date : selectedClinic?.availableSlots[0]?.date || '2026-11-20');
  const [timeSlot, setTimeSlot] = useState(rescheduleTarget ? rescheduleTarget.timeSlot : selectedClinic?.availableSlots[0]?.slots[0] || '10:00 AM');
  const [mode, setMode] = useState<ConsultationMode>(rescheduleTarget ? rescheduleTarget.mode : 'in-clinic');
  const [petId, setPetId] = useState(rescheduleTarget ? rescheduleTarget.petId : pets[0]?.id || '');
  const [notes, setNotes] = useState(rescheduleTarget?.notes || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedDateSlots = selectedClinic?.availableSlots.find(s => s.date === date)?.slots || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!timeSlot) {
      setError('Please select an appointment time slot.');
      return;
    }

    if (isRescheduling && rescheduleTarget) {
      const ok = await rescheduleConsultation(rescheduleTarget.id, date, timeSlot);
      if (ok) onClose();
    } else {
      const targetPet = pets.find(p => p.id === petId) || pets[0];
      const ok = await bookConsultation({
        clinicId,
        petId: targetPet ? targetPet.id : 'unknown',
        petName: targetPet ? targetPet.name : 'Dog',
        date,
        timeSlot,
        mode,
        notes
      });
      if (ok) onClose();
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="consult-modal-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={20} color="var(--color-primary)" />
            <h2 id="consult-modal-title" className="modal-title">
              {isRescheduling ? 'Reschedule Vet Consultation' : 'Book Free Vet Consultation'}
            </h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {!isRescheduling && (
              <div style={{
                background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.825rem',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600
              }}>
                <span className="badge badge-success">Voucher 100% Covered</span>
                <span>$0 Charged • Included free with your subscription</span>
              </div>
            )}

            <div className="form-grid single-col">
              {/* Clinic Selection (disabled if rescheduling) */}
              <div className="form-group">
                <label className="form-label">Partner Veterinary Clinic</label>
                <select
                  value={clinicId}
                  disabled={isRescheduling}
                  onChange={e => {
                    const newId = e.target.value;
                    setClinicId(newId);
                    const c = clinics.find(item => item.id === newId);
                    if (c && c.availableSlots[0]) {
                      setDate(c.availableSlots[0].date);
                      setTimeSlot(c.availableSlots[0].slots[0]);
                    }
                  }}
                  className="form-select"
                >
                  {clinics.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.doctorName} ({c.neighborhood})
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Format */}
              <div className="form-group">
                <label className="form-label">Consultation Format</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {selectedClinic?.modesOffered.includes('in-clinic') && (
                    <button
                      type="button"
                      onClick={() => setMode('in-clinic')}
                      className={`chip-btn ${mode === 'in-clinic' ? 'selected' : ''}`}
                      style={{ padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <Building2 size={15} /> In-Clinic Visit
                    </button>
                  )}
                  {selectedClinic?.modesOffered.includes('telehealth') && (
                    <button
                      type="button"
                      onClick={() => setMode('telehealth')}
                      className={`chip-btn ${mode === 'telehealth' ? 'selected' : ''}`}
                      style={{ padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <Video size={15} /> Video Telehealth
                    </button>
                  )}
                </div>
              </div>

              {/* Pet Selection */}
              {pets.length > 1 && !isRescheduling && (
                <div className="form-group">
                  <label className="form-label">Which Pet is this consultation for?</label>
                  <select
                    value={petId}
                    onChange={e => setPetId(e.target.value)}
                    className="form-select"
                  >
                    {pets.map(p => (
                      <option key={p.id} value={p.id}>
                        🐕 {p.name} ({p.breed})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Selection */}
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                  {selectedClinic?.availableSlots.map(slotObj => {
                    const isSelected = date === slotObj.date;
                    const d = new Date(slotObj.date + 'T00:00:00');
                    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const mDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                      <button
                        key={slotObj.date}
                        type="button"
                        onClick={() => {
                          setDate(slotObj.date);
                          if (!slotObj.slots.includes(timeSlot)) {
                            setTimeSlot(slotObj.slots[0]);
                          }
                        }}
                        className={`chip-btn ${isSelected ? 'selected' : ''}`}
                        style={{ padding: '0.55rem 0.85rem', textAlign: 'center', minWidth: '85px' }}
                      >
                        <span style={{ fontSize: '0.7rem', display: 'block' }}>{day}</span>
                        <strong>{mDay}</strong>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="form-group">
                <label className="form-label">Available Time Slots</label>
                <div className="time-slots-grid">
                  {selectedDateSlots.map((time, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTimeSlot(time)}
                      className={`time-slot-btn ${timeSlot === time ? 'selected' : ''}`}
                    >
                      <Clock size={12} style={{ marginRight: '0.3rem' }} />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="modal-consult-notes">Questions / Topics for Doctor</label>
                <textarea
                  id="modal-consult-notes"
                  rows={2}
                  placeholder="Notes about food transition, digestion, or allergies..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>

              {error && (
                <div className="form-error-msg"><AlertCircle size={14} /> {error}</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="btn btn-primary">
              {actionLoading ? (
                <>
                  <RotateCcw className="spinning-icon" size={16} /> Confirming...
                </>
              ) : isRescheduling ? (
                'Save New Appointment Time'
              ) : (
                'Confirm Free Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
