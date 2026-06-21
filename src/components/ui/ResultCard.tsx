import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Status } from "../../lib/types";
import StatusBadge from "./StatusBadge";

const stripColor: Record<Status, string> = {
  SAFE: "#16A34A",
  WARNING: "#D97706",
  REDESIGN: "#DC2626",
  INFO: "#0891B2",
};

export default function ResultCard({
  title,
  status,
  children,
  delay = 0,
  className = "",
}: {
  title: string;
  status?: Status;
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
      className={`relative bg-surface border border-borderLight rounded-card shadow-card overflow-hidden ${className}`}
    >
      {status && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: stripColor[status] }} />
      )}
      <div className="pl-5 pr-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-textPrimary">{title}</h3>
          {status && <StatusBadge status={status} />}
        </div>
        {children}
      </div>
    </motion.div>
  );
}
