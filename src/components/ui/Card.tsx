import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  hover = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" } : undefined}
      className={`bg-surface border border-borderLight rounded-card shadow-card transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}
