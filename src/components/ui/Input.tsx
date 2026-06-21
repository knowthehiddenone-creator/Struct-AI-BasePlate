import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
  error?: boolean;
}

export default function Input({ label, unit, error, className = "", ...props }: Props) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-[#64748B] mb-1.5">{label}</label>}
      <div className="relative">
        <input
          className={`w-full rounded-input border px-3 py-2.5 text-sm text-textPrimary bg-surface
            placeholder:text-textMuted outline-none transition-all duration-150
            ${error ? "border-danger" : "border-borderMed"}
            focus:border-primary focus:shadow-inputFocus
            ${unit ? "pr-14" : ""} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-textMuted">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
