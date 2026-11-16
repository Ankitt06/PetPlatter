import React from 'react';
import { PetPlatterProvider, usePetPlatter } from './context/PetPlatterContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { PlansView } from './components/plans/PlansView';
import { PlanComparison } from './components/plans/PlanComparison';
import { PartnerClinicsView } from './components/plans/PartnerClinicsView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardView } from './components/dashboard/DashboardView';

const AppContent: React.FC = () => {
  const { activeTab } = usePetPlatter();

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {activeTab === 'plans' && <PlansView />}

        {activeTab === 'compare' && (
          <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
            <PlanComparison />
          </div>
        )}

        {activeTab === 'clinics' && <PartnerClinicsView />}

        {activeTab === 'onboard' && <OnboardingWizard />}

        {activeTab === 'dashboard' && <DashboardView />}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <PetPlatterProvider>
      <AppContent />
    </PetPlatterProvider>
  );
}

export default App;
