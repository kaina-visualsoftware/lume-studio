import React, { useEffect } from 'react';
import { darkColors } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  colors?: typeof darkColors;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  type = 'info',
  colors: customColors,
}) => {
  const colors = customColors || darkColors;

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

  const typeColors = {
    danger: { bg: colors.error, text: '#FFFFFF' },
    warning: { bg: colors.warning, text: '#FFFFFF' },
    info: { bg: colors.info, text: '#FFFFFF' },
  };

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
      background: colors.bgSecondary,
      borderRadius: 16,
      border: `1px solid ${colors.borderLight}`,
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
      background: `${typeColors[type].bg}20`,
      color: typeColors[type].bg,
    } as React.CSSProperties,
    title: {
      fontSize: 18,
      fontWeight: 600,
      color: colors.text,
    } as React.CSSProperties,
    message: {
      fontSize: 14,
      color: colors.textSecondary,
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
      background: colors.bgTertiary,
      color: colors.textSecondary,
    } as React.CSSProperties,
    buttonConfirm: {
      background: typeColors[type].bg,
      color: typeColors[type].text,
    } as React.CSSProperties,
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.icon}>
            {type === 'danger' ? '!' : type === 'warning' ? '?' : 'i'}
          </div>
          <div style={styles.title}>{title}</div>
        </div>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button style={{ ...styles.button, ...styles.buttonCancel }} onClick={onClose}>
            {cancelText}
          </button>
          <button style={{ ...styles.button, ...styles.buttonConfirm }} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};