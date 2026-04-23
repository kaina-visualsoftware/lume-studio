import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, isActive }) => {
  return (
    <div style={{
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {children}
    </div>
  );
};

export const AnimatedListItem: React.FC<{
  children: React.ReactNode;
  index: number;
}> = ({ children, index }) => (
  <div style={{
    animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both`,
  }}>
    {children}
  </div>
);

export const HoverScale: React.FC<{
  children: React.ReactNode;
  scale?: number;
}> = ({ children, scale = 1.02 }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: 'transform 0.2s ease-out',
        transform: isHovered ? `scale(${scale})` : 'scale(1)',
      }}
    >
      {children}
    </div>
  );
};