import React from 'react';

// Approximation of the IDFC FIRST Bank wordmark: angular red/orange mark + wordmark.
export default function BankLogo({ dark = true, compact = false }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 28 L16 4 L21 4 L9 28 Z" fill="#e2571e" />
        <path d="M14 28 L26 4 L31 4 L19 28 Z" fill="#990000" />
      </svg>
      <div className="leading-none">
        <span className={`font-extrabold tracking-wide ${dark ? 'text-idfc-charcoal' : 'text-white'} ${compact ? 'text-base' : 'text-lg'}`}>
          IDFC
        </span>
        <span className={`font-extrabold tracking-wide text-idfc-red ${compact ? 'text-base' : 'text-lg'}`}>
          {' '}FIRST
        </span>
        <span className={`block text-[9px] font-semibold tracking-[0.35em] ${dark ? 'text-gray-500' : 'text-white/70'}`}>
          BANK
        </span>
      </div>
    </div>
  );
}
