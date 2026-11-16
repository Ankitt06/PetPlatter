import React, { useState } from 'react';
import { COMMON_DOG_BREEDS, DIETARY_NEEDS_OPTIONS, calculatePortion } from '../../api/mockData';
import { Plus, Trash2, AlertCircle, Utensils } from 'lucide-react';

export interface PetFormData {
  name: string;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightLbs: number;
  weightKg: number;
  dietaryNeeds: string[];
  healthNotes: string;
  activityLevel: 'low' | 'moderate' | 'high' | 'working';
}

interface PetFormStepProps {
  pets: PetFormData[];
  onChange: (pets: PetFormData[]) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const PetFormStep: React.FC<PetFormStepProps> = ({
  pets,
  onChange,
  errors,
  setErrors
}) => {
  const [activePetIndex, setActivePetIndex] = useState<number>(0);

  const updatePet = (index: number, field: keyof PetFormData, value: any) => {
    const updated = [...pets];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-sync weightKg if weightLbs changed
    if (field === 'weightLbs') {
      const lbs = Number(value) || 0;
      updated[index].weightKg = Number((lbs * 0.453592).toFixed(1));
    }

    // Clear error for this field if valid
    const errorKey = `pet_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }

    onChange(updated);
  };

  const toggleDietaryNeed = (petIndex: number, needId: string) => {
    const pet = pets[petIndex];
    const exists = pet.dietaryNeeds.includes(needId);
    const updatedNeeds = exists
      ? pet.dietaryNeeds.filter(id => id !== needId)
      : [...pet.dietaryNeeds, needId];

    updatePet(petIndex, 'dietaryNeeds', updatedNeeds);
  };

  const handleAddPet = () => {
    const newPet: PetFormData = {
      name: '',
      breed: '',
      ageYears: 2,
      ageMonths: 0,
      weightLbs: 35,
      weightKg: 15.9,
      dietaryNeeds: [],
      healthNotes: '',
      activityLevel: 'moderate'
    };
    onChange([...pets, newPet]);
    setActivePetIndex(pets.length);
  };

  const handleRemovePet = (index: number) => {
    if (pets.length <= 1) return;
    const filtered = pets.filter((_, i) => i !== index);
    onChange(filtered);
    setActivePetIndex(Math.max(0, index - 1));
  };

  return (
    <div>
      <div className="step-intro">
        <h2 className="step-heading">Tell Us About Your Dog</h2>
        <p className="step-desc">
          We use weight, age, and health details to compute exact caloric and portion requirements 
          for your fresh food delivery.
        </p>
      </div>

      {/* Tabs if multiple pets */}
      {pets.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {pets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePetIndex(idx)}
              className={`btn btn-sm ${activePetIndex === idx ? 'btn-primary' : 'btn-outline'}`}
            >
              🐕 {p.name ? p.name : `Dog #${idx + 1}`}
            </button>
          ))}
          <button
            type="button"
            onClick={handleAddPet}
            className="btn btn-outline btn-sm"
          >
            <Plus size={14} /> Add Another Dog
          </button>
        </div>
      )}

      {/* Pet Form */}
      {pets.map((pet, idx) => {
        if (idx !== activePetIndex && pets.length > 1) return null;

        const portion = calculatePortion(pet.weightLbs, pet.ageYears, pet.activityLevel);

        return (
          <div key={idx} className="pet-entry-card">
            <div className="pet-entry-header">
              <div className="pet-entry-title">
                <span>🐕 Profile for {pet.name || `Dog #${idx + 1}`}</span>
              </div>
              {pets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePet(idx)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-error)' }}
                  title="Remove this pet profile"
                >
                  <Trash2 size={16} /> Remove
                </button>
              )}
            </div>

            <div className="form-grid">
              {/* Pet Name */}
              <div className="form-group">
                <label className="form-label" htmlFor={`pet-name-${idx}`}>
                  Dog's Name *
                </label>
                <input
                  id={`pet-name-${idx}`}
                  type="text"
                  placeholder="e.g. Buster, Bella, Milo"
                  value={pet.name}
                  onChange={e => updatePet(idx, 'name', e.target.value)}
                  className={`form-input ${errors[`pet_${idx}_name`] ? 'has-error' : ''}`}
                />
                {errors[`pet_${idx}_name`] && (
                  <div className="form-error-msg">
                    <AlertCircle size={13} /> {errors[`pet_${idx}_name`]}
                  </div>
                )}
              </div>

              {/* Breed */}
              <div className="form-group">
                <label className="form-label" htmlFor={`pet-breed-${idx}`}>
                  Breed *
                </label>
                <input
                  id={`pet-breed-${idx}`}
                  type="text"
                  list={`breeds-list-${idx}`}
                  placeholder="e.g. Golden Retriever, Doodle, Mixed..."
                  value={pet.breed}
                  onChange={e => updatePet(idx, 'breed', e.target.value)}
                  className={`form-input ${errors[`pet_${idx}_breed`] ? 'has-error' : ''}`}
                />
                <datalist id={`breeds-list-${idx}`}>
                  {COMMON_DOG_BREEDS.map((b, i) => (
                    <option key={i} value={b} />
                  ))}
                </datalist>
                {errors[`pet_${idx}_breed`] && (
                  <div className="form-error-msg">
                    <AlertCircle size={13} /> {errors[`pet_${idx}_breed`]}
                  </div>
                )}
              </div>

              {/* Age (Years & Months) */}
              <div className="form-group">
                <label className="form-label">
                  Age *
                  <span className="form-label-hint">Years & Months</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <select
                    value={pet.ageYears}
                    onChange={e => updatePet(idx, 'ageYears', parseInt(e.target.value, 10))}
                    className="form-select"
                    aria-label="Age in years"
                  >
                    {Array.from({ length: 21 }).map((_, y) => (
                      <option key={y} value={y}>
                        {y === 0 ? 'Under 1 yr' : `${y} ${y === 1 ? 'year' : 'years'}`}
                      </option>
                    ))}
                  </select>
                  <select
                    value={pet.ageMonths}
                    onChange={e => updatePet(idx, 'ageMonths', parseInt(e.target.value, 10))}
                    className="form-select"
                    aria-label="Age in months"
                  >
                    {Array.from({ length: 12 }).map((_, m) => (
                      <option key={m} value={m}>{m} months</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weight */}
              <div className="form-group">
                <label className="form-label" htmlFor={`pet-weight-${idx}`}>
                  Current Weight *
                  <span className="form-label-hint">Approx. {(pet.weightKg || 0)} kg</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id={`pet-weight-${idx}`}
                    type="number"
                    min="1"
                    max="220"
                    placeholder="e.g. 45"
                    value={pet.weightLbs || ''}
                    onChange={e => updatePet(idx, 'weightLbs', parseFloat(e.target.value) || 0)}
                    className={`form-input ${errors[`pet_${idx}_weightLbs`] ? 'has-error' : ''}`}
                    style={{ paddingRight: '3.5rem' }}
                  />
                  <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', fontSize: '0.85rem', fontWeight: 600 }}>
                    lbs
                  </span>
                </div>
                {errors[`pet_${idx}_weightLbs`] && (
                  <div className="form-error-msg">
                    <AlertCircle size={13} /> {errors[`pet_${idx}_weightLbs`]}
                  </div>
                )}
              </div>

              {/* Activity Level */}
              <div className="form-group span-full">
                <label className="form-label">Daily Activity Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'low', label: 'Couch Potato', sub: 'Calm walks' },
                    { id: 'moderate', label: 'Moderate', sub: '1-2 hrs daily' },
                    { id: 'high', label: 'Very Active', sub: 'Runs & hikes' },
                    { id: 'working', label: 'Agile/Working', sub: 'High energy' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => updatePet(idx, 'activityLevel', act.id)}
                      className={`chip-btn ${pet.activityLevel === act.id ? 'selected' : ''}`}
                      style={{ padding: '0.65rem 0.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{act.label}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{act.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Needs Chips */}
              <div className="form-group span-full">
                <label className="form-label">
                  Dietary Needs & Sensitivities
                  <span className="form-label-hint">Select all that apply</span>
                </label>
                <div className="chip-group">
                  {DIETARY_NEEDS_OPTIONS.map(opt => {
                    const isSelected = pet.dietaryNeeds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleDietaryNeed(idx, opt.id)}
                        className={`chip-btn ${isSelected ? 'selected' : ''}`}
                      >
                        {isSelected ? '✓ ' : '+ '} {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Health Notes */}
              <div className="form-group span-full">
                <label className="form-label" htmlFor={`pet-notes-${idx}`}>
                  Health & Medical Notes
                  <span className="form-label-hint">Allergies, medications, or fussy eating habits</span>
                </label>
                <textarea
                  id={`pet-notes-${idx}`}
                  rows={2}
                  placeholder="e.g. Mild chicken allergy, dry itchy skin during spring, tends to eat fast, picky with vegetables..."
                  value={pet.healthNotes}
                  onChange={e => updatePet(idx, 'healthNotes', e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Calculated Daily Portion Widget */}
            <div className="portion-preview-box">
              <div className="portion-preview-left">
                <div className="portion-badge-icon">
                  <Utensils size={18} />
                </div>
                <div className="portion-preview-text">
                  <strong>Recommended Daily Fresh Portion:</strong>
                  <span>Calculated for {pet.name || 'your dog'} ({pet.weightLbs} lbs • {pet.activityLevel} activity)</span>
                </div>
              </div>
              <div className="portion-preview-val">
                ~{portion.dailyGrams}g / day ({portion.pouchesPerDay} {portion.pouchesPerDay === 1 ? 'pouch' : 'pouches'})
              </div>
            </div>
          </div>
        );
      })}

      {pets.length === 1 && (
        <button
          type="button"
          onClick={handleAddPet}
          className="btn btn-outline"
          style={{ width: '100%', borderStyle: 'dashed' }}
        >
          <Plus size={16} /> Have another dog? Add another pet profile
        </button>
      )}
    </div>
  );
};
