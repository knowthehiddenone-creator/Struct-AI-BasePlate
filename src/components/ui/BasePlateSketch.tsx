import { motion } from "framer-motion";

export default function BasePlateSketch({
  N,
  B,
  d,
  bf,
  anchorCount = 0,
  showAnchors = false,
  unit,
}: {
  N: number;
  B: number;
  d: number;
  bf: number;
  anchorCount?: number;
  showAnchors?: boolean;
  unit: string;
}) {
  const viewSize = 280;
  const margin = 50;
  const scale = (viewSize - 2 * margin) / Math.max(N, B);
  const plateW = N * scale;
  const plateH = B * scale;
  const colW = bf * scale;
  const colH = d * scale;
  const cx = viewSize / 2;
  const cy = viewSize / 2;

  // anchor positions: 4 at corners-ish or evenly distributed
  const anchorPositions: [number, number][] = [];
  if (showAnchors && anchorCount > 0) {
    const inset = 18;
    const half = anchorCount / 2;
    const corners: [number, number][] = [
      [-plateW / 2 + inset, -plateH / 2 + inset],
      [plateW / 2 - inset, -plateH / 2 + inset],
      [-plateW / 2 + inset, plateH / 2 - inset],
      [plateW / 2 - inset, plateH / 2 - inset],
    ];
    for (let i = 0; i < anchorCount; i++) {
      anchorPositions.push(corners[i % 4]);
    }
  }

  return (
    <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className="w-full h-auto max-w-[280px] mx-auto">
      {/* base plate */}
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        x={cx - plateW / 2}
        y={cy - plateH / 2}
        width={plateW}
        height={plateH}
        fill="#EFF6FF"
        stroke="#2563EB"
        strokeWidth={1.5}
        rx={2}
      />
      {/* column outline */}
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        x={cx - colW / 2}
        y={cy - colH / 2}
        width={colW}
        height={colH}
        fill="none"
        stroke="#0F172A"
        strokeWidth={1.5}
        strokeDasharray="4 2"
      />
      {/* anchors */}
      {anchorPositions.map(([ax, ay], i) => (
        <motion.circle
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
          cx={cx + ax}
          cy={cy + ay}
          r={4}
          fill="#DC2626"
        />
      ))}
      {/* dimension labels */}
      <text x={cx} y={cy - plateH / 2 - 10} textAnchor="middle" fontSize="10" fill="#2563EB" fontFamily="monospace">
        N = {N.toFixed(0)} {unit}
      </text>
      <text
        x={cx + plateW / 2 + 12}
        y={cy}
        textAnchor="middle"
        fontSize="10"
        fill="#2563EB"
        fontFamily="monospace"
        transform={`rotate(90, ${cx + plateW / 2 + 12}, ${cy})`}
      >
        B = {B.toFixed(0)} {unit}
      </text>
    </svg>
  );
}
