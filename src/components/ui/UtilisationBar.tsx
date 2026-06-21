import { motion } from "framer-motion";

export default function UtilisationBar({ util, label }: { util: number; label?: string }) {
  const pct = Math.min(util * 100, 100);
  const color = util < 0.7 ? "#16A34A" : util <= 0.9 ? "#D97706" : "#DC2626";
  const trackColor = util < 0.7 ? "#F0FDF4" : util <= 0.9 ? "#FFFBEB" : "#FEF2F2";

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs font-medium text-textSecondary">{label}</span>
          <span className="text-sm font-mono font-semibold" style={{ color }}>
            {util.toFixed(2)}
          </span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: trackColor }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
