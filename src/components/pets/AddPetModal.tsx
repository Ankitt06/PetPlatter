import React, { useState } from 'react';
import { usePetPlatter } from '../../context/PetPlatterContext';
import { COMMON_DOG_BREEDS, DIETARY_NEEDS_OPTIONS, calculatePortion } from '../../api/mockData';
import { X, AlertCircle, Utensils, RotateCcw } from 'lucide-react';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose }) => {
  const { addPet, actionLoading } = usePetPlatter();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState(2);
  const [ageMonths, setAgeMonths] = useState(0);
  const [weightLbs, setWeightLbs] = useState(35);
  const [activityLevel, setActivityLevel] = useState<'low' | 'moderate' | 'high' | 'working'>('moderate');
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>([]);
  const [healthNotes, setHealthNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const toggleDietary = (id: string) => {
    setDietaryNeeds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const portion = calculatePortion(weightLbs, ageYears, activityLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Please enter dog's name";
    if (!breed.trim()) newErrors.breed = 'Please enter or select a breed';
    if (!weightLbs || weightLbs <= 0) newErrors.weightLbs = 'Please enter weight in lbs';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await addPet({
      name: name.trim(),
      breed: breed.trim(),
      ageYears,
      ageMonths,
      weightLbs,
      weightKg: Number((weightLbs * 0.453592).toFixed(1)),
      activityLevel,
      dietaryNeeds,
      healthNotes: healthNotes.trim()
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-pet-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 id="add-pet-title" className="modal-title">🐕 Add Another Pet Profile</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="modal-pet-name">Dog's Name *</label>
                <input
                  id="modal-pet-name"
                  type="text"
                  placeholder="e.g. Copper"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                />
                {errors.name && (
                  <div className="form-error-msg"><AlertCircle size={13} /> {errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-pet-breed">Breed *</label>
                <input
                  id="modal-pet-breed"
                  type="text"
                  list="modal-breeds-list"
                  placeholder="e.g. Labrador Retriever"
                  value={breed}
                  onChange={e => {
                    setBreed(e.target.value);
                    if (errors.breed) setErrors(prev => ({ ...prev, breed: '' }));
                  }}
                  className={`form-input ${errors.breed ? 'has-error' : ''}`}
                />
                <datalist id="modal-breeds-list">
                  {COMMON_DOG_BREEDS.map((b, i) => (
                    <option key={i} value={b} />
                  ))}
                </datalist>
                {errors.breed && (
                  <div className="form-error-msg"><AlertCircle size={13} /> {errors.breed}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <select
                    value={ageYears}
                    onChange={e => setAgeYears(parseInt(e.target.value, 10))}
                    className="form-select"
                  >
                    {Array.from({ length: 21 }).map((_, y) => (
                      <option key={y} value={y}>{y === 0 ? 'Under 1 yr' : `${y} yrs`}</option>
                    ))}
                  </select>
                  <select
                    value={ageMonths}
                    onChange={e => setAgeMonths(parseInt(e.target.value, 10))}
                    className="form-select"
                  >
                    {Array.from({ length: 12 }).map((_, m) => (
                      <option key={m} value={m}>{m} mos</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-pet-weight">Weight (lbs) *</label>
                <input
                  id="modal-pet-weight"
                  type="number"
                  min="1"
                  max="200"
                  value={weightLbs || ''}
                  onChange={e => {
                    setWeightLbs(parseFloat(e.target.value) || 0);
                    if (errors.weightLbs) setErrors(prev => ({ ...prev, weightLbs: '' }));
                  }}
                  className={`form-input ${errors.weightLbs ? 'has-error' : ''}`}
                />
                {errors.weightLbs && (
                  <div className="form-error-msg"><AlertCircle size={13} /> {errors.weightLbs}</div>
                )}
              </div>

              <div className="form-group span-full">
                <label className="form-label">Activity Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {(['low', 'moderate', 'high', 'working'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActivityLevel(lvl)}
                      className={`chip-btn ${activityLevel === lvl ? 'selected' : ''}`}
                      style={{ textTransform: 'capitalize', textAlign: 'center', padding: '0.45rem' }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group span-full">
                <label className="form-label">Dietary Needs</label>
                <div className="chip-group">
                  {DIETARY_NEEDS_OPTIONS.map(opt => {
                    const sel = dietaryNeeds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleDietary(opt.id)}
                        className={`chip-btn ${sel ? 'selected' : ''}`}
                      >
                        {sel ? '✓ ' : '+ '} {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group span-full">
                <label className="form-label" htmlFor="modal-pet-notes">Health & Medical Notes</label>
                <textarea
                  id="modal-pet-notes"
                  rows={2}
                  placeholder="Any allergies, joint stiffness, or dietary quirks..."
                  value={healthNotes}
                  onChange={e => setHealthNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="portion-preview-box" style={{ marginTop: '1rem' }}>
              <div className="portion-preview-left">
                <div className="portion-badge-icon">
                  <Utensils size={16} />
                </div>
                <div className="portion-preview-text">
                  <strong>Calculated Daily Portion:</strong>
                  <span>{weightLbs} lbs • {activityLevel} activity</span>
                </div>
              </div>
              <div className="portion-preview-val">
                ~{portion.dailyGrams}g ({portion.pouchesPerDay} {portion.pouchesPerDay === 1 ? 'pouch' : 'pouches'})
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="btn btn-primary">
              {actionLoading ? (
                <>
                  <RotateCcw className="spinning-icon" size={16} /> Saving...
                </>
              ) : (
                'Add Pet Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
