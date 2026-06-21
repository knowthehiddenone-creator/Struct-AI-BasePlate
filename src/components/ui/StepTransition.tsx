import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export default function StepTransition({ children, stepKey }: { children: ReactNode; stepKey: string | number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
