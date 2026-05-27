import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Animated counter hook
export function useCountUp(end: number, duration: number = 1.5) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
}

// Stat Card Component
export const CertStatCard = React.memo(function CertStatCard({ 
  icon: Icon, 
  value, 
  label, 
  color, 
  total,
  isPercentage = false 
}: { 
  icon: React.ElementType; 
  value: number | string; 
  label: string; 
  color: string; 
  total: number;
  isPercentage?: boolean;
}) {
  const animatedValue = isPercentage ? value : useCountUp(value as number);
  const percentage = total > 0 && !isPercentage ? (value as number / total) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -2, 
        transition: { duration: 0.15 },
        boxShadow: `0 8px 25px ${color}20`
      }}
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-brand)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s ease',
      }}
    >
      {/* Top color bar - "eyebrow" indicator */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: color,
          borderRadius: '4px 4px 0 0',
        }}
      />
      
      {/* Progress bar fill */}
      {!isPercentage && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '4px',
            width: `${percentage}%`,
            backgroundColor: color,
            opacity: 0.7,
            borderRadius: '4px 0 0 0',
          }}
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon style={{ width: '20px', height: '20px', color }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <motion.p
            role="status"
            aria-live="polite"
            aria-label={`${animatedValue}${isPercentage ? '%' : ''} ${label}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {animatedValue}{isPercentage ? '%' : ''}
          </motion.p>
          {!isPercentage && total > 0 && (
            <span style={{ fontSize: '11px', color: '#4A5568', alignSelf: 'flex-end', marginBottom: '3px' }}>
              /{total}
            </span>
          )}
        </div>
      </div>
      
      <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>{label}</p>
    </motion.div>
  );
});
