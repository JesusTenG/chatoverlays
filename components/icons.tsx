import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;
export function BagIcon(props: Props) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>; }
export function GridIcon(props: Props) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>; }
export function PlayIcon(props: Props) { return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M8 5.5c0-.8.9-1.3 1.6-.9l10 6.5a1 1 0 0 1 0 1.8l-10 6.5c-.7.4-1.6-.1-1.6-.9v-13Z"/></svg>; }
export function PauseIcon(props: Props) { return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>; }
export function ExpandIcon(props: Props) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...props}><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>; }
export function Starburst(props: Props) { return <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}><path d="m50 0 9 27 22-18-7 28 26 13-27 9 18 22-28-7-13 26-9-27-22 18 7-28L0 50l27-9L9 19l28 7Z"/></svg>; }
