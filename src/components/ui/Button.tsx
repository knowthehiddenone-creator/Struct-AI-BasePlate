import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-primaryDark shadow-sm",
  secondary: "bg-surfaceGray text-textPrimary hover:bg-surfaceHover",
  success: "bg-success text-white hover:bg-[#15803D] shadow-sm",
  outline: "bg-surface text-textPrimary border border-borderMed hover:bg-surfaceGray",
  ghost: "bg-transparent text-textSecondary hover:bg-surfaceGray",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth,
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`rounded-btn font-medium inline-flex items-center justify-center gap-2 transition-all duration-150 ease-out
        ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]"}
        ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
