import { usePetPlatter } from '../../context/PetPlatterContext';
import { MapPin, Phone, Star, Video, Building2, CalendarCheck, Shield } from 'lucide-react';

export const PartnerClinicsView: React.FC = () => {
  const { clinics, startOnboarding, subscription } = usePetPlatter();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div className="section-heading-box">
        <span className="section-eyebrow">Accredited Veterinary Network</span>
        <h1 className="section-title">Our Partner Veterinary Clinics</h1>
        <p className="section-subtitle">
          Because nutrition and clinical medicine go hand-in-hand, every PetPlatter subscriber receives a complimentary 
          wellness and dietary consultation (worth up to $160) with our trusted clinic partners.
        </p>
      </div>

      <div style={{
        background: 'var(--color-primary-light)',
        border: '1.5px solid rgba(35, 83, 60, 0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '0.4rem' }}>
            <Shield size={20} />
            <span>Why We Partner With Local Clinics</span>
          </div>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
            Transitioning to freshly made food transforms digestion, weight, and allergy symptoms. 
            Our partner veterinarians evaluate your dog’s baseline health, review bloodwork or sensitivity histories, 
            and guide your feeding plan for maximum longevity.
          </p>
        </div>
        {!subscription && (
          <button onClick={() => startOnboarding('mid')} className="btn btn-primary">
            <CalendarCheck size={18} />
            Claim Free Consultation
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {clinics.map(clinic => (
          <div 
            key={clinic.id} 
            className="clinic-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'stretch', 
              cursor: 'default',
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <img 
                src={clinic.image} 
                alt={clinic.name} 
                className="clinic-img-thumb" 
                style={{ width: '5.5rem', height: '5.5rem' }} 
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                  <Star size={15} fill="#eab308" color="#eab308" />
                  <strong style={{ fontSize: '0.9rem' }}>{clinic.rating}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>({clinic.reviewCount} reviews)</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{clinic.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{clinic.doctorName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{clinic.doctorCredentials}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>{clinic.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                <Phone size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>{clinic.phone}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.785rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.4rem' }}>
                Clinical Specialties:
              </div>
              <div className="clinic-specialties-row">
                {clinic.specialties.map((spec, i) => (
                  <span key={i} className="specialty-tag">{spec}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {clinic.modesOffered.includes('in-clinic') && (
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    <Building2 size={12} /> In-Clinic
                  </span>
                )}
                {clinic.modesOffered.includes('telehealth') && (
                  <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                    <Video size={12} /> Video Telehealth
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-success)' }}>
                100% Free with Plan
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
