import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function Select({ label, options, placeholder, className = "", ...props }: Props) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-[#64748B] mb-1.5">{label}</label>}
      <div className="relative">
        <select
          className={`w-full rounded-input border border-borderMed px-3 py-2.5 text-sm text-textPrimary bg-surface
            outline-none transition-all duration-150 appearance-none pr-9
            focus:border-primary focus:shadow-inputFocus ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
      </div>
    </div>
  );
}
