const paths = {
  download: 'M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4',
  menu: 'M3 7h18M3 16h18',
  close: 'm5 5 14 14M19 5 5 19'
};

export default function Icon({ name, size = 16 }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d={paths[name]} />
  </svg>;
}
