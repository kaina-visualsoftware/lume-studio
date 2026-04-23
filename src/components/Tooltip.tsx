import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const positions = {
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
  left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
  right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
};

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);

  const showTooltip = () => {
    setHasHovered(true);
    setTimeout(() => setIsVisible(true), 300);
  };

  const hideTooltip = () => {
    setIsVisible(false);
    setTimeout(() => setHasHovered(false), 150);
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {hasHovered && (
        <div style={{
          ...positions[position],
          position: 'absolute',
          background: '#27272A',
          color: '#FAFAFA',
          padding: '8px 12px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 100,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s',
          pointerEvents: 'none',
        }}>
          {content}
          <div style={{
            position: 'absolute',
            ...(position === 'top' ? { top: '100%', left: '50%', marginLeft: -5, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #27272A' } : {}),
            ...(position === 'bottom' ? { bottom: '100%', left: '50%', marginLeft: -5, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #27272A' } : {}),
          }} />
        </div>
      )}
    </div>
  );
};