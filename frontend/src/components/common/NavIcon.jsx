const PATHS = {
  home: <path d="M3 11 12 3l9 8v10h-6v-6H9v6H3Z" />,
  book: (<><path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4Z" /><path d="M8 9h8" /></>),
  lines: <path d="M4 6h16M4 12h10M4 18h14" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />,
  bag: (<><rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V4h6v3" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  chev: <path d="m6 9 6 6 6-6" />
};

/** Small stroke icon used by navigation (replaces emoji). */
export default function NavIcon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
