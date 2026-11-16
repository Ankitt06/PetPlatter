import React from 'react';
import type { CustomerInfo } from '../../types';
import { AlertCircle, Truck } from 'lucide-react';

interface DeliveryFormStepProps {
  data: CustomerInfo;
  onChange: (data: CustomerInfo) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const DeliveryFormStep: React.FC<DeliveryFormStepProps> = ({
  data,
  onChange,
  errors,
  setErrors
}) => {
  const updateField = (field: keyof CustomerInfo, value: string) => {
    onChange({ ...data, [field]: value });

    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div>
      <div className="step-intro">
        <h2 className="step-heading">Delivery & Account Details</h2>
        <p className="step-desc">
          Your freshly prepared meals are packed in temperature-monitored, eco-friendly insulated liners.
        </p>
      </div>

      <div className="form-grid">
        {/* First Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="first-name">
            First Name *
          </label>
          <input
            id="first-name"
            type="text"
            autoComplete="given-name"
            placeholder="Jane"
            value={data.firstName}
            onChange={e => updateField('firstName', e.target.value)}
            className={`form-input ${errors.firstName ? 'has-error' : ''}`}
          />
          {errors.firstName && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.firstName}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="last-name">
            Last Name *
          </label>
          <input
            id="last-name"
            type="text"
            autoComplete="family-name"
            placeholder="Smith"
            value={data.lastName}
            onChange={e => updateField('lastName', e.target.value)}
            className={`form-input ${errors.lastName ? 'has-error' : ''}`}
          />
          {errors.lastName && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.lastName}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="customer-email">
            Email Address *
            <span className="form-label-hint">For order tracking & vet voucher</span>
          </label>
          <input
            id="customer-email"
            type="email"
            autoComplete="email"
            placeholder="jane.smith@example.com"
            value={data.email}
            onChange={e => updateField('email', e.target.value)}
            className={`form-input ${errors.email ? 'has-error' : ''}`}
          />
          {errors.email && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.email}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="customer-phone">
            Phone Number *
            <span className="form-label-hint">For delivery courier SMS updates</span>
          </label>
          <input
            id="customer-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 000-0000"
            value={data.phone}
            onChange={e => updateField('phone', e.target.value)}
            className={`form-input ${errors.phone ? 'has-error' : ''}`}
          />
          {errors.phone && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.phone}
            </div>
          )}
        </div>

        {/* Street Address */}
        <div className="form-group span-full">
          <label className="form-label" htmlFor="customer-address">
            Street Address *
          </label>
          <input
            id="customer-address"
            type="text"
            autoComplete="street-address"
            placeholder="123 Oak Bark Way"
            value={data.address}
            onChange={e => updateField('address', e.target.value)}
            className={`form-input ${errors.address ? 'has-error' : ''}`}
          />
          {errors.address && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.address}
            </div>
          )}
        </div>

        {/* Apt / Unit */}
        <div className="form-group">
          <label className="form-label" htmlFor="customer-apt">
            Apt, Suite, Unit <span className="form-label-hint">Optional</span>
          </label>
          <input
            id="customer-apt"
            type="text"
            placeholder="Apt 4B"
            value={data.apartment || ''}
            onChange={e => updateField('apartment', e.target.value)}
            className="form-input"
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label className="form-label" htmlFor="customer-city">
            City *
          </label>
          <input
            id="customer-city"
            type="text"
            autoComplete="address-level2"
            placeholder="Metro City"
            value={data.city}
            onChange={e => updateField('city', e.target.value)}
            className={`form-input ${errors.city ? 'has-error' : ''}`}
          />
          {errors.city && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.city}
            </div>
          )}
        </div>

        {/* State */}
        <div className="form-group">
          <label className="form-label" htmlFor="customer-state">
            State / Province *
          </label>
          <input
            id="customer-state"
            type="text"
            autoComplete="address-level1"
            placeholder="OR"
            value={data.state}
            onChange={e => updateField('state', e.target.value)}
            className={`form-input ${errors.state ? 'has-error' : ''}`}
          />
          {errors.state && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.state}
            </div>
          )}
        </div>

        {/* Zip Code */}
        <div className="form-group">
          <label className="form-label" htmlFor="customer-zip">
            Postal / Zip Code *
          </label>
          <input
            id="customer-zip"
            type="text"
            autoComplete="postal-code"
            placeholder="97201"
            value={data.zipCode}
            onChange={e => updateField('zipCode', e.target.value)}
            className={`form-input ${errors.zipCode ? 'has-error' : ''}`}
          />
          {errors.zipCode && (
            <div className="form-error-msg">
              <AlertCircle size={13} /> {errors.zipCode}
            </div>
          )}
        </div>

        {/* Delivery instructions */}
        <div className="form-group span-full">
          <label className="form-label" htmlFor="customer-notes">
            Drop-off Instructions <span className="form-label-hint">Optional</span>
          </label>
          <textarea
            id="customer-notes"
            rows={2}
            placeholder="e.g. Leave under covered front porch or behind the planter."
            value={data.deliveryNotes || ''}
            onChange={e => updateField('deliveryNotes', e.target.value)}
            className="form-textarea"
          />
        </div>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-bg-warm)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)'
      }}>
        <Truck size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Estimated First Fresh Delivery:</strong> In 3 business days. 
          Freshly prepared the morning before shipment.
        </span>
      </div>
    </div>
  );
};
