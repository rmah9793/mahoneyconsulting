export function Molecule({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 520"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <g stroke="#edfffe" strokeOpacity="0.55" strokeWidth="1">
        <line x1="70" y1="90" x2="180" y2="150" />
        <line x1="180" y1="150" x2="310" y2="80" />
        <line x1="180" y1="150" x2="140" y2="280" />
        <line x1="140" y1="280" x2="260" y2="250" />
        <line x1="260" y1="250" x2="310" y2="80" />
        <line x1="140" y1="280" x2="90" y2="410" />
        <line x1="260" y1="250" x2="340" y2="390" />
        <line x1="90" y1="410" x2="220" y2="450" />
        <line x1="340" y1="390" x2="220" y2="450" />
        <line x1="260" y1="250" x2="220" y2="450" />
      </g>
      {[
        [70, 90, 8],
        [180, 150, 14],
        [310, 80, 9],
        [140, 280, 11],
        [260, 250, 16],
        [90, 410, 8],
        [340, 390, 10],
        [220, 450, 12],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ffffff" fillOpacity="0.88" />
      ))}
    </svg>
  );
}
