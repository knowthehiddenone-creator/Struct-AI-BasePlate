import { Check } from "lucide-react";

const STEP_NAMES = [
  "Code & Project",
  "Describe Design",
  "Review Parameters",
  "Missing Data",
  "Geometry & Bearing",
  "Plate Thickness",
  "Anchor & Embedment",
  "Weld & Stiffener",
  "Design Review",
  "Summary & Export",
];

export default function Sidebar({
  currentStep,
  maxReachedStep,
  onStepClick,
}: {
  currentStep: number;
  maxReachedStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <aside className="w-[240px] shrink-0 bg-surface border-r border-borderLight h-full overflow-y-auto py-4 hidden lg:block">
      <div className="px-4 mb-2 text-xs font-semibold text-textMuted uppercase tracking-wide">Steps</div>
      <nav className="flex flex-col">
        {STEP_NAMES.map((name, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isComplete = stepNum < currentStep || stepNum < maxReachedStep;
          const isClickable = stepNum <= maxReachedStep;
          return (
            <button
              key={stepNum}
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(stepNum)}
              className={`flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 border-l-[3px]
                ${isActive ? "border-primary bg-primaryLight text-primary font-medium" : "border-transparent"}
                ${!isActive && isComplete ? "text-textSecondary hover:bg-surfaceGray" : ""}
                ${!isActive && !isComplete ? "text-textMuted" : ""}
                ${isClickable && !isActive ? "cursor-pointer" : ""}
                ${!isClickable ? "cursor-default" : ""}`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0
                  ${isActive ? "bg-primary text-white" : isComplete ? "bg-success text-white" : "bg-surfaceGray text-textMuted"}`}
              >
                {isComplete && !isActive ? <Check size={12} /> : stepNum}
              </span>
              <span className="truncate">{name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
