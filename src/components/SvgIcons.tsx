import type { CSSProperties } from 'react';

export function SvgIcons() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
      <symbol id="ic-route" viewBox="0 0 24 24">
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="5.5" r="2.5" />
        <path d="M8 18.5h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" />
      </symbol>
      <symbol id="ic-cal" viewBox="0 0 24 24">
        <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      </symbol>
      <symbol id="ic-pill" viewBox="0 0 24 24">
        <rect x="2.9" y="8.2" width="18.2" height="7.6" rx="3.8" transform="rotate(-45 12 12)" />
        <path d="M8.7 15.3l6.6-6.6" />
      </symbol>
      <symbol id="ic-book" viewBox="0 0 24 24">
        <path d="M4.5 4.5A2.5 2.5 0 0 1 7 2h12.5v17.5H7a2.5 2.5 0 0 0-2.5 2.5z" />
        <path d="M4.5 19.5A2.5 2.5 0 0 1 7 17h12.5" />
      </symbol>
      <symbol id="ic-sliders" viewBox="0 0 24 24">
        <path d="M4 7h9.5M18.5 7H20M4 17h3.5M12.5 17H20" />
        <circle cx="15.7" cy="7" r="2.3" />
        <circle cx="9.7" cy="17" r="2.3" />
      </symbol>
      <symbol id="ic-bell" viewBox="0 0 24 24">
        <path d="M6 10a6 6 0 0 1 12 0c0 4 1.6 5.5 1.6 5.5H4.4S6 14 6 10z" />
        <path d="M10 19a2.2 2.2 0 0 0 4 0" />
      </symbol>
      <symbol id="ic-check" viewBox="0 0 24 24">
        <path d="M4.5 12.5l5 5L19.5 6.5" />
      </symbol>
      <symbol id="ic-flag" viewBox="0 0 24 24">
        <path d="M5.5 21V4" />
        <path d="M5.5 4.5c4-2.2 7 2 12.5-.5v10c-5.5 2.5-8.5-1.7-12.5.5" />
      </symbol>
      <symbol id="ic-clock" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2.5" />
      </symbol>
      <symbol id="ic-drop" viewBox="0 0 24 24">
        <path d="M12 3.5s6 6.2 6 10.2a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5z" />
      </symbol>
      <symbol id="ic-moon" viewBox="0 0 24 24">
        <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5z" />
      </symbol>
      <symbol id="ic-bolt" viewBox="0 0 24 24">
        <path d="M13 2.5L5 13.5h5.5L11 21.5l8-11h-5.5z" />
      </symbol>
      <symbol id="ic-x" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6L6 18" />
      </symbol>
      <symbol id="ic-warn" viewBox="0 0 24 24">
        <path d="M12 3.5L2.5 20h19z" />
        <path d="M12 9.5v4.5M12 17v.01" />
      </symbol>
      <symbol id="ic-dl" viewBox="0 0 24 24">
        <path d="M12 3.5v11M7.5 10.5L12 15l4.5-4.5M4.5 19.5h15" />
      </symbol>
      <symbol id="ic-trash" viewBox="0 0 24 24">
        <path d="M4.5 6.5h15M9.5 6.5v-2h5v2M6.5 6.5l1 14h9l1-14" />
      </symbol>
      <symbol id="ic-sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4" />
      </symbol>
      <symbol id="ic-pulse" viewBox="0 0 24 24">
        <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
      </symbol>
      <symbol id="ic-timer" viewBox="0 0 24 24">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5M10 2h4M12 2v3" />
      </symbol>
    </svg>
  );
}

export function Icon({ name, className = '', style }: { name: string; className?: string; style?: CSSProperties }) {
  return (
    <svg className={`ic ${className}`} style={style}>
      <use href={`#ic-${name}`} />
    </svg>
  );
}
