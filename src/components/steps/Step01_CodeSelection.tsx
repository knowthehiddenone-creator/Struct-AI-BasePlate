import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { DesignCode, ProjectInfo } from "../../lib/types";
import Input from "../ui/Input";
import Button from "../ui/Button";

const CODES: { code: DesignCode; title: string; standard: string; method: string; factors: string }[] = [
  { code: "AISC_LRFD", title: "AISC LRFD", standard: "AISC 360-22", method: "Limit State", factors: "\u03c6 = 0.90 / 0.65" },
  { code: "AISC_ASD", title: "AISC ASD", standard: "AISC 360-22", method: "Allowable Stress", factors: "\u03a9 = 1.67 / 2.31" },
  { code: "IS800", title: "IS 800 LSM", standard: "IS 800:2007", method: "Limit State", factors: "\u03b3m0 = 1.10" },
];

export default function Step01_CodeSelection({
  project,
  onChange,
  onNext,
}: {
  project: ProjectInfo;
  onChange: (p: ProjectInfo) => void;
  onNext: () => void;
}) {
  const isIndian = project.code === "IS800";

  return (
    <div className="bg-surface border border-borderLight rounded-card shadow-card p-7">
      <h2 className="text-xl font-semibold text-textPrimary mb-1">Code & Project Selection</h2>
      <p className="text-sm text-textSecondary mb-6">Choose your design code, then fill in basic project details.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Input
          label="Project Name"
          placeholder="Column C-12, Grid A-B"
          value={project.projectName}
          onChange={(e) => onChange({ ...project, projectName: e.target.value })}
        />
        <Input
          label="Designer Name"
          placeholder="Your name"
          value={project.designerName}
          onChange={(e) => onChange({ ...project, designerName: e.target.value })}
        />
        <Input
          label="Date"
          type="date"
          value={project.date}
          onChange={(e) => onChange({ ...project, date: e.target.value })}
        />
      </div>

      <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-3">Design Code</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-2">
        {CODES.map((c) => {
          const selected = project.code === c.code;
          return (
            <motion.button
              key={c.code}
              onClick={() => onChange({ ...project, code: c.code })}
              whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className={`relative text-left rounded-card border-2 p-5 transition-colors duration-150 ${
                selected ? "border-primary bg-primaryLight" : "border-borderLight bg-surface hover:border-borderMed"
              }`}
            >
              {selected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check size={12} />
                </span>
              )}
              <p className={`text-base font-semibold mb-1 ${selected ? "text-primary" : "text-textPrimary"}`}>
                {c.title}
              </p>
              <p className="text-xs text-textSecondary mb-2">{c.standard}</p>
              <p className="text-xs text-textMuted">{c.method}</p>
              <p className="text-xs font-mono text-textMuted mt-1">{c.factors}</p>
            </motion.button>
          );
        })}
      </div>

      {project.code && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-info bg-infoLight border border-infoBorder rounded-input px-3 py-2 mt-3 inline-block"
        >
          Units: {isIndian ? "kN, kNm, mm, MPa" : "kips, kip-ft, inches, ksi"}
        </motion.p>
      )}

      <div className="flex justify-end mt-7">
        <Button onClick={onNext} disabled={!project.code}>
          Next Step →
        </Button>
      </div>
    </div>
  );
}
