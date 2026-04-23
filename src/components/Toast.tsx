import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#10B981', border: '#059669', icon: '✓' },
  error: { bg: '#EF4444', border: '#DC2626', icon: '✕' },
  warning: { bg: '#F59E0B', border: '#D97706', icon: '!' },
  info: { bg: '#3B82F6', border: '#2563EB', icon: 'i' },
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  zIndex: 1000,
  maxWidth: 360,
};

const toastStyle = (type: ToastType): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 16px',
  background: toastStyles[type].bg,
  borderRadius: 10,
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  animation: 'slideIn 0.3s ease-out',
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: 500,
});

const iconStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 700,
};

const styleKeyframes = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100px); }
  }
`;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <style>{styleKeyframes}</style>
      {children}
      <div style={containerStyle}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            style={toastStyle(toast.type)}
            onClick={() => removeToast(toast.id)}
          >
            <div style={iconStyle}>{toastStyles[toast.type].icon}</div>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastExample: React.FC = () => {
  const { showToast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
      <button onClick={() => showToast('success', 'Operação realizada com sucesso!')} style={{ padding: '8px 16px', background: '#10B981', border: 'none', borderRadius: 8, color: '#FFF', cursor: 'pointer' }}>Success</button>
      <button onClick={() => showToast('error', 'Erro ao processar solicitação')} style={{ padding: '8px 16px', background: '#EF4444', border: 'none', borderRadius: 8, color: '#FFF', cursor: 'pointer' }}>Error</button>
      <button onClick={() => showToast('warning', 'Atenção: Verifique os dados')} style={{ padding: '8px 16px', background: '#F59E0B', border: 'none', borderRadius: 8, color: '#FFF', cursor: 'pointer' }}>Warning</button>
      <button onClick={() => showToast('info', 'Informação adicional')} style={{ padding: '8px 16px', background: '#3B82F6', border: 'none', borderRadius: 8, color: '#FFF', cursor: 'pointer' }}>Info</button>
    </div>
  );
};