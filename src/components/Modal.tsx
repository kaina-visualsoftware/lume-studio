import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
  } as React.CSSProperties,
  modal: {
    width: '100%',
    maxWidth: 420,
    background: '#18181B',
    borderRadius: 16,
    border: '1px solid #27272A',
    padding: 24,
    animation: 'scaleIn 0.2s ease-out',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  } as React.CSSProperties,
  icon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 700,
  } as React.CSSProperties,
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FAFAFA',
  } as React.CSSProperties,
  message: {
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 1.6,
    marginBottom: 24,
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  button: {
    padding: '12px 20px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s',
  } as React.CSSProperties,
  buttonCancel: {
    background: '#27272A',
    color: '#A1A1AA',
  } as React.CSSProperties,
  buttonConfirm: {
    color: '#FFFFFF',
  } as React.CSSProperties,
  closeButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    background: 'transparent',
    border: 'none',
    color: '#71717A',
    cursor: 'pointer',
    padding: 8,
  } as React.CSSProperties,
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    danger: { bg: '#EF4444', icon: '!' },
    warning: { bg: '#F59E0B', icon: '!' },
    info: { bg: '#3B82F6', icon: 'i' },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ ...styles.icon, background: typeConfig[type].bg }}>
            {typeConfig[type].icon}
          </div>
          <h2 style={styles.title}>{title}</h2>
        </div>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button 
            style={{ ...styles.button, ...styles.buttonCancel }} 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            style={{ ...styles.button, ...styles.buttonConfirm, background: typeConfig[type].bg }} 
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const useModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};