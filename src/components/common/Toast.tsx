import React from 'react';
import { usePetPlatter } from '../../context/PetPlatterContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = usePetPlatter();

  if (!toast) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${toast.type}`}>
        {toast.type === 'success' && <CheckCircle2 size={20} color="var(--color-success)" style={{ flexShrink: 0 }} />}
        {toast.type === 'error' && <AlertCircle size={20} color="var(--color-error)" style={{ flexShrink: 0 }} />}
        {toast.type === 'info' && <Info size={20} color="var(--color-info)" style={{ flexShrink: 0 }} />}
        <div className="toast-message">{toast.message}</div>
        <button 
          onClick={dismissToast} 
          className="modal-close-btn" 
          aria-label="Close notification"
          style={{ width: '1.5rem', height: '1.5rem', marginLeft: 'auto', flexShrink: 0 }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number; height?: string }> = ({ 
  rows = 3, 
  height = '1.5rem' 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="skeleton-box" 
          style={{ height, width: i === rows - 1 ? '70%' : '100%' }} 
        />
      ))}
    </div>
  );
};
