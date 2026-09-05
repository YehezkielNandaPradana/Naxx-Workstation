import React from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-[#141C2D]/80 border border-white/10 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-200 active:scale-[0.98] ${className}`}
      style={{
        borderTop: '1.5px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      {/* Specular fluid light highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
