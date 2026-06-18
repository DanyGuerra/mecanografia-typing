import React from 'react';

interface KeyboardLogoProps {
  className?: string;
}

export default function KeyboardLogo({ className }: KeyboardLogoProps) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" className={className || 'text-foreground'}>
      <rect x="2" y="6" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="12" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
      <rect x="18" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
      <rect x="24" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="6" y="17" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
      <rect x="12" y="17" width="8" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="22" y="17" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
    </svg>
  );
}
