import React from 'react';

export const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="2"/>
    </svg>
  ),
  Train: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="3" width="16" height="16" rx="2" strokeWidth="2"/>
      <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M9 15h.01M15 15h.01" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Track: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 19L19 4M5 5l14 14M8 4l2 2M14 10l2 2M4 8l2 2M10 14l2 2M16 20l2 2" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Signal: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="7" y="2" width="10" height="20" rx="3" strokeWidth="2"/>
      <circle cx="12" cy="7" r="2" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="17" r="2" fill="currentColor"/>
    </svg>
  ),
  Schedule: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/>
      <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Traffic: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Performance: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M18 20V10M12 20V4M6 20v-6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Alerts: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Gauge: () => (
    <svg width="20" height="20" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 14v-4M4.93 19.07A10 10 0 1119.07 19.07" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

export const getStatusBadge = (status) => {
  const s = status ? status.toLowerCase() : '';
  if (s.includes('normal') || s.includes('clear') || s.includes('on-time') || s.includes('green') || s.includes('optimal')) {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: status
    };
  }
  if (s.includes('warning') || s.includes('caution') || s.includes('yellow') || s.includes('moderate') || s.includes('delayed')) {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
      label: status
    };
  }
  if (s.includes('critical') || s.includes('danger') || s.includes('red') || s.includes('halt') || s.includes('hold')) {
    return {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400',
      label: status
    };
  }
  return {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    label: status
  };
};
