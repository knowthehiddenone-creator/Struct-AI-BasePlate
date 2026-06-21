export default function UnitLabel({ unit, className = "" }: { unit: string; className?: string }) {
  return <span className={`font-mono text-textMuted text-xs ${className}`}>{unit}</span>;
}
