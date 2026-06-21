import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ReviewResult } from "../../lib/types";
import Button from "../ui/Button";

export default function Step09_DesignReview({
  review,
  onNext,
}: {
  review: ReviewResult;
  onNext: () => void;
}) {
  const bannerConfig = {
    PROCEED: { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A", label: "PROCEED WITH DETAILING" },
    REVIEW: { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706", label: "REVIEW WARNINGS BEFORE PROCEEDING" },
    REDESIGN: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", label: "REDESIGN REQUIRED" },
  }[review.finalStatus];

  return (
    <div className="bg-surface border border-borderLight rounded-card shadow-card p-7">
      <div className="flex items-center gap-2.5 mb-6">
        <h2 className="text-xl font-semibold text-textPrimary">Senior Engineer Review</h2>
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-badge bg-infoLight text-info border border-infoBorder">
          <Sparkles size={11} /> AI
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-7">
        <Column title="SAFE POINTS" color="#16A34A" items={review.safePoints} dotColor="#16A34A" />
        <Column title="WARNINGS" color="#D97706" items={review.warnings} dotColor="#D97706" />
        <Column
          title="CRITICAL ISSUES"
          color="#DC2626"
          items={review.criticalIssues}
          dotColor="#DC2626"
          emptyText="No critical issues found"
        />
      </div>

      <div className="mb-7">
        <p className="text-sm font-semibold text-textPrimary mb-3">Recommendations</p>
        <ol className="space-y-2">
          {review.recommendations.map((r, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              className="text-sm text-textSecondary flex gap-2.5"
            >
              <span className="font-mono text-primary shrink-0">{i + 1}.</span>
              {r}
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-card border px-5 py-4 text-center font-semibold mb-7"
        style={{ backgroundColor: bannerConfig.bg, borderColor: bannerConfig.border, color: bannerConfig.text }}
      >
        {bannerConfig.label}
      </motion.div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Next Step →</Button>
      </div>
    </div>
  );
}

function Column({
  title,
  color,
  items,
  dotColor,
  emptyText,
}: {
  title: string;
  color: string;
  items: string[];
  dotColor: string;
  emptyText?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color }}>
        {title}
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-textMuted italic">{emptyText ?? "None"}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
              className="flex gap-2 text-sm text-textSecondary leading-relaxed"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                style={{ backgroundColor: dotColor }}
              />
              {item}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
