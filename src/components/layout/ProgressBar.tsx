import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgressBar({ currentStep, totalSteps = 10 }: { currentStep: number; totalSteps?: number }) {
  return (
    <div className="w-full bg-surface border-b border-borderLight px-6 py-3.5 overflow-x-auto">
      <div className="flex items-center max-w-[900px] mx-auto">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isComplete = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <div key={stepNum} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center shrink-0">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isComplete ? "#16A34A" : isActive ? "#2563EB" : "#FFFFFF",
                    borderColor: isComplete ? "#16A34A" : isActive ? "#2563EB" : "#CBD5E1",
                    color: isComplete || isActive ? "#FFFFFF" : "#94A3B8",
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold"
                >
                  {isComplete ? <Check size={14} /> : stepNum}
                </motion.div>
              </div>
              {stepNum < totalSteps && (
                <motion.div
                  initial={false}
                  animate={{ backgroundColor: stepNum < currentStep ? "#16A34A" : "#E2E8F0" }}
                  transition={{ duration: 0.3 }}
                  className="h-[2px] flex-1 mx-1"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
