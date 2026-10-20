import React from 'react';

// Brand skin map — realistic per-brand gift card artwork (pure CSS, no images).
const BRANDS = {
  Amazon: {
    bg: 'bg-gradient-to-br from-[#131921] via-[#232f3e] to-[#37475a]',
    wordmark: 'amazon',
    wordmarkCls: 'italic font-extrabold lowercase text-white',
    accent: '#ff9900',
    chip: false,
  },
  Flipkart: {
    bg: 'bg-gradient-to-br from-[#044e9e] via-[#2874f0] to-[#0f5fc0]',
    wordmark: 'Flipkart',
    wordmarkCls: 'italic font-extrabold text-[#ffe500]',
    accent: '#ffe500',
    chip: false,
  },
  Myntra: {
    bg: 'bg-gradient-to-br from-[#ff3f6c] via-[#ff6c63] to-[#ff905a]',
    wordmark: 'Myntra',
    wordmarkCls: 'font-extrabold text-white tracking-wide',
    accent: '#ffd9e2',
    chip: false,
  },
  Swiggy: {
    bg: 'bg-gradient-to-br from-[#fc8019] via-[#f97316] to-[#c2410c]',
    wordmark: 'Swiggy',
    wordmarkCls: 'font-extrabold text-white',
    accent: '#fff3e8',
    chip: false,
  },
  Zomato: {
    bg: 'bg-gradient-to-br from-[#e23744] to-[#8f1220]',
    wordmark: 'zomato',
    wordmarkCls: 'font-extrabold lowercase text-white',
    accent: '#ffd7db',
    chip: false,
  },
  'IDFC FIRST': {
    bg: 'bg-gradient-to-br from-[#4d0000] via-[#990000] to-[#c8102e]',
    wordmark: 'IDFC FIRST BANK',
    wordmarkCls: 'font-extrabold text-white tracking-widest',
    accent: '#e8c95a',
    chip: true,
  },
};

const FALLBACK = {
  bg: 'bg-gradient-to-br from-[#2b2b2b] via-[#3d3d3d] to-[#1a1a1a]',
  wordmark: 'GIFT CARD',
  wordmarkCls: 'font-extrabold text-white tracking-widest',
  accent: '#e8c95a',
  chip: true,
};

export function brandSkin(brand) {
  return BRANDS[brand] || FALLBACK;
}

// A realistic physical-gift-card visual. aspect 8:5 like a real card.
export default function GiftCardVisual({ card, size = 'md', className = '' }) {
  const skin = brandSkin(card.brand);
  const lg = size === 'lg';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${skin.bg} text-white shadow-card aspect-[8/5] select-none ${className}`}
    >
      {/* decorative artwork */}
      <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-white/[0.07]" />
      <div className="absolute top-1/2 right-8 w-24 h-24 rounded-full border-[6px] border-white/10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" />

      {/* redeemed stamp */}
      {card.redeemed ? (
        <>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border-4 border-white/80 text-white/90 font-extrabold tracking-[0.3em] px-4 py-1.5 -rotate-12 rounded">
              REDEEMED
            </span>
          </div>
        </>
      ) : null}

      <div className={`relative h-full flex flex-col justify-between ${lg ? 'p-6' : 'p-4'}`}>
        <div className="flex items-start justify-between">
          <div>
            <span className={`${lg ? 'text-xl' : 'text-sm'} ${skin.wordmarkCls}`}>
              {skin.wordmark}
            </span>
            <div className="h-0.5 w-10 mt-1 rounded" style={{ background: skin.accent }} />
          </div>
          <span
            className={`${lg ? 'text-xs' : 'text-[9px]'} font-semibold tracking-[0.25em] text-white/70`}
          >
            GIFT CARD
          </span>
        </div>

        <div>
          <p className={`${lg ? 'text-4xl' : 'text-2xl'} font-extrabold tracking-tight`}>
            ₹{Number(card.value).toLocaleString('en-IN')}
          </p>
          <p className={`${lg ? 'text-sm' : 'text-[11px]'} text-white/70 truncate`}>
            {card.catalog_name || card.name || 'Gift Voucher'}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className={`${lg ? 'text-[10px]' : 'text-[8px]'} uppercase tracking-widest text-white/50`}>
              Card number
            </p>
            <p className={`${lg ? 'text-sm' : 'text-[10px]'} font-mono tracking-wider text-white/90`}>
              {card.code || 'XXXX-XXXX-XXXX'}
            </p>
          </div>
          {skin.chip && (
            <div className={`${lg ? 'w-11 h-8' : 'w-8 h-6'} rounded-md bg-gradient-to-br from-[#e8c95a] to-[#a8871a] shadow-inner`} />
          )}
        </div>
      </div>
    </div>
  );
}
