import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { Status } from "../../lib/types";

const config: Record<Status, { bg: string; text: string; border: string; icon: any; label: string }> = {
  SAFE: { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", icon: CheckCircle2, label: "SAFE" },
  WARNING: { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A", icon: AlertTriangle, label: "WARNING" },
  REDESIGN: { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", icon: XCircle, label: "REDESIGN" },
  INFO: { bg: "#ECFEFF", text: "#0891B2", border: "#A5F3FC", icon: Info, label: "INFO" },
};

export default function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-badge text-xs font-medium border whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      <Icon size={13} strokeWidth={2.4} />
      {label ?? c.label}
    </motion.span>
  );
}
