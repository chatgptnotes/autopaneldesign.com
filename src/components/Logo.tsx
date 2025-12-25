/**
 * AutoPanel Design Logo
 * Professional electrical panel design icon
 */

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main panel background */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="12"
        fill="url(#logoGradient)"
        opacity="0.9"
      />

      {/* Panel door frame */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="12"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />

      {/* DIN Rail (horizontal bar) */}
      <rect x="20" y="35" width="60" height="4" fill="white" opacity="0.9" rx="1" />
      <rect x="20" y="61" width="60" height="4" fill="white" opacity="0.9" rx="1" />

      {/* Component blocks (circuit breakers/contactors) */}
      {/* CB 1 */}
      <rect x="25" y="40" width="8" height="16" fill="white" opacity="0.95" rx="1" />
      <rect x="26" y="42" width="6" height="3" fill="url(#circuitGradient)" rx="0.5" />

      {/* CB 2 */}
      <rect x="38" y="40" width="8" height="16" fill="white" opacity="0.95" rx="1" />
      <rect x="39" y="42" width="6" height="3" fill="url(#circuitGradient)" rx="0.5" />

      {/* CB 3 */}
      <rect x="51" y="40" width="8" height="16" fill="white" opacity="0.95" rx="1" />
      <rect x="52" y="42" width="6" height="3" fill="url(#circuitGradient)" rx="0.5" />

      {/* CB 4 */}
      <rect x="64" y="40" width="8" height="16" fill="white" opacity="0.95" rx="1" />
      <rect x="65" y="42" width="6" height="3" fill="url(#circuitGradient)" rx="0.5" />

      {/* Circuit connections (wires) */}
      <line x1="29" y1="35" x2="29" y2="40" stroke="white" strokeWidth="1.5" opacity="0.9" />
      <line x1="42" y1="35" x2="42" y2="40" stroke="white" strokeWidth="1.5" opacity="0.9" />
      <line x1="55" y1="35" x2="55" y2="40" stroke="white" strokeWidth="1.5" opacity="0.9" />
      <line x1="68" y1="35" x2="68" y2="40" stroke="white" strokeWidth="1.5" opacity="0.9" />

      {/* Bottom connections */}
      <line x1="29" y1="56" x2="29" y2="61" stroke="white" strokeWidth="1.5" opacity="0.9" />
      <line x1="42" y1="56" x2="42" y2="61" stroke="white" strokeWidth="1.5" opacity="0.9" />
      <line x1="55" y1="56" x2="55" y2="61" stroke="white" strokeWidth="1.5" opacity="0.9" />
      <line x1="68" y1="56" x2="68" y2="61" stroke="white" strokeWidth="1.5" opacity="0.9" />

      {/* AI Spark/Lightning bolt accent (top right) */}
      <path
        d="M 75 18 L 72 24 L 75 24 L 72 30 L 78 23 L 75 23 Z"
        fill="#FBBF24"
        opacity="0.95"
      />

      {/* Connection points */}
      <circle cx="29" cy="35" r="1.5" fill="#60A5FA" />
      <circle cx="42" cy="35" r="1.5" fill="#60A5FA" />
      <circle cx="55" cy="35" r="1.5" fill="#60A5FA" />
      <circle cx="68" cy="35" r="1.5" fill="#60A5FA" />
    </svg>
  );
};

export default Logo;
