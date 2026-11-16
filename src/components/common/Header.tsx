import { usePetPlatter } from '../../context/PetPlatterContext';
import type { NavigationTab } from '../../context/PetPlatterContext';
import { 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle,
  Stethoscope
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    startOnboarding, 
    subscription, 
    isSimulatingError, 
    toggleSimulateError, 
    loadDemoData, 
    clearData,
    actionLoading 
  } = usePetPlatter();

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Dev / Mock Testing Simulation Banner */}
      <aside aria-label="Developer mock backend controls" className="dev-banner">
        <div className="dev-banner-left">
          <span className="dev-badge">Mock API Mode</span>
          <span>Simulated latency (550ms) • LocalStorage persisted</span>
        </div>
        <div className="dev-banner-controls">
          <button
            onClick={() => toggleSimulateError(!isSimulatingError)}
            className={`dev-action-btn ${isSimulatingError ? 'active-error' : ''}`}
            title="Toggle simulated network error to test error handling & retry UI"
          >
            <AlertTriangle size={13} />
            {isSimulatingError ? 'Network Error: ON (Click to Disable)' : 'Simulate Error (500)'}
          </button>
          <button
            onClick={loadDemoData}
            disabled={actionLoading}
            className="dev-action-btn"
            title="Populate with sample customer, pet profile (Buster), and confirmed vet consultation"
          >
            <Sparkles size={13} />
            Load Sample Profile
          </button>
          <button
            onClick={clearData}
            disabled={actionLoading}
            className="dev-action-btn"
            title="Reset storage to test initial clean onboarding"
          >
            <RotateCcw size={13} />
            Reset Data
          </button>
        </div>
      </aside>

      {/* Main App Header */}
      <header className="header">
        <div className="container header-inner">
          <div 
            className="brand-logo" 
            onClick={() => handleNav(subscription ? 'dashboard' : 'plans')}
            role="button"
            tabIndex={0}
            aria-label="PetPlatter home"
          >
            <div className="brand-icon-box">
              <HeartHandshake size={24} />
            </div>
            <div className="brand-name">
              Pet<span>Platter</span>
            </div>
          </div>

          <nav className="nav-links" aria-label="Main Navigation">
            <button
              onClick={() => handleNav('plans')}
              className={`nav-link ${activeTab === 'plans' ? 'active' : ''}`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => handleNav('compare')}
              className={`nav-link ${activeTab === 'compare' ? 'active' : ''}`}
            >
              Compare Plans
            </button>
            <button
              onClick={() => handleNav('clinics')}
              className={`nav-link ${activeTab === 'clinics' ? 'active' : ''}`}
            >
              <Stethoscope size={15} />
              Vet Partners
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              My Dashboard
              {subscription && (
                <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                  Active
                </span>
              )}
            </button>
          </nav>

          <div className="header-cta-group">
            {subscription ? (
              <button
                onClick={() => handleNav('dashboard')}
                className="btn btn-outline btn-sm"
              >
                <CheckCircle2 size={16} color="var(--color-primary)" />
                Manage Plan
              </button>
            ) : (
              <button
                onClick={() => startOnboarding('mid')}
                className="btn btn-primary btn-sm"
              >
                Subscribe Now
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
