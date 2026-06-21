import { motion } from "framer-motion";
import { UnitSystem } from "../../lib/types";

export default function UnitToggle({ unit, onChange }: { unit: UnitSystem; onChange: (u: UnitSystem) => void }) {
  return (
    <div className="inline-flex items-center bg-surfaceGray rounded-full p-1 relative">
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-surface shadow-sm"
        initial={false}
        animate={{ left: unit === "SI" ? 4 : "50%", right: unit === "SI" ? "50%" : 4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      <button
        onClick={() => onChange("SI")}
        className={`relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-150 ${
          unit === "SI" ? "text-primary" : "text-textMuted"
        }`}
      >
        SI Metric
      </button>
      <button
        onClick={() => onChange("US")}
        className={`relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-150 ${
          unit === "US" ? "text-primary" : "text-textMuted"
        }`}
      >
        US Customary
      </button>
    </div>
  );
}
