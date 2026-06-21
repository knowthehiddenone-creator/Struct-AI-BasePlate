import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const STEPS = [
  "Running load classification...",
  "Checking base plate geometry...",
  "Calculating plate thickness...",
  "Checking anchor design...",
  "Running weld check...",
  "AI review in progress...",
];

export default function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (doneCount >= STEPS.length) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDoneCount((c) => c + 1), 420);
    return () => clearTimeout(t);
  }, [doneCount]);

  return (
    <div className="space-y-3 py-4">
      {STEPS.map((label, i) => {
        const isDone = i < doneCount;
        const isActive = i === doneCount;
        if (i > doneCount) return null;
        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            {isDone ? (
              <CheckCircle2 size={18} className="text-success shrink-0" />
            ) : isActive ? (
              <Loader2 size={18} className="text-primary shrink-0 animate-spin" />
            ) : null}
            <span className={`text-sm ${isDone ? "text-textSecondary" : "text-textPrimary font-medium"}`}>
              {label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
