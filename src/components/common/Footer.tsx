import React from 'react';
import { ShieldCheck, Stethoscope, UtensilsCrossed, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-trust-grid">
          <div className="trust-item">
            <div className="trust-icon-box">
              <UtensilsCrossed size={28} />
            </div>
            <div>
              <h4>100% Human-Grade Fresh</h4>
              <p>Prepared in USDA-inspected kitchens under 165°F to preserve essential micronutrients.</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Stethoscope size={28} />
            </div>
            <div>
              <h4>Free Partner Vet Consultation</h4>
              <p>Every active subscription includes a free wellness consultation with accredited partner clinics.</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4>AAFCO Complete & Balanced</h4>
              <p>Formulated by Board-Certified Veterinary Nutritionists for all canine life stages.</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={28} />
            </div>
            <div>
              <h4>Cold-Chained Eco Delivery</h4>
              <p>Arrives chilled in curbside-recyclable insulated packaging. Pause, skip, or cancel anytime.</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PetPlatter Inc. Farm-to-bowl nutrition for canine longevity.</p>
          <p>Mock Architecture Ready for Production Backend Integration</p>
        </div>
      </div>
    </footer>
  );
};
