import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { DesignCode } from "../../lib/types";
import Button from "../ui/Button";

const EXAMPLES: Record<string, { label: string; text: string }[]> = {
  IS800: [
    {
      label: "IS 800 — ISMB 300",
      text: "Design a base plate for ISMB 300 column, axial load 800 kN, moment 60 kNm, shear 40 kN, concrete M30, plate E250, pedestal 600x600 mm, 4 M24 anchors IS 1367 Class 8.8",
    },
    {
      label: "High Moment Case",
      text: "Design a base plate for ISHB 400 column, axial load 1200 kN, moment 180 kNm, shear 90 kN, concrete M35, plate E250, pedestal 750x750 mm, 6 M30 anchors IS 1367 Class 8.8",
    },
    {
      label: "Uplift Condition",
      text: "Design a base plate for ISMB 250 column, axial load 150 kN, moment 95 kNm, shear 35 kN, concrete M25, plate E250, pedestal 500x500 mm, 4 M24 anchors IS 1367 Class 10.9",
    },
  ],
  default: [
    {
      label: "AISC Example — W10x49",
      text: "Design a base plate for W10x49 column, axial load 115 kips, moment 60 kip-ft, shear 9 kips, concrete f'c 4000 psi, A36 plate, pedestal 24x24 in, 4 anchors ASTM F1554 Gr.55",
    },
    {
      label: "High Moment Case",
      text: "Design a base plate for W14x120 column, axial load 270 kips, moment 130 kip-ft, shear 20 kips, concrete f'c 5000 psi, A992 plate, pedestal 30x30 in, 6 anchors ASTM F1554 Gr.55",
    },
    {
      label: "Uplift Condition",
      text: "Design a base plate for W12x53 column, axial load 35 kips, moment 70 kip-ft, shear 8 kips, concrete f'c 3000 psi, A36 plate, pedestal 20x20 in, 4 anchors ASTM F1554 Gr.105",
    },
  ],
};

export default function Step02_NLInput({
  code,
  value,
  onChange,
  onExtract,
}: {
  code: DesignCode;
  value: string;
  onChange: (v: string) => void;
  onExtract: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const isIndian = code === "IS800";
  const examples = isIndian ? EXAMPLES.IS800 : EXAMPLES.default;

  const placeholder = isIndian
    ? `Describe your base plate design in plain English...\n\nExample: Design a base plate for ISMB 300 column, axial load 800 kN, moment 60 kNm, shear 40 kN, concrete M30, plate E250, pedestal 600x600 mm, 4 M24 anchors IS 1367 Class 8.8, IS 800`
    : `Describe your base plate design in plain English...\n\nExample: Design a base plate for W10x49 column, axial load 115 kips, moment 60 kip-ft, shear 9 kips, concrete f'c 4000 psi, A36 plate, pedestal 24x24 in, 4 anchors ASTM F1554 Gr.55, AISC LRFD`;

  const handleExtract = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onExtract();
    }, 900);
  };

  return (
    <div className="bg-surface border border-borderLight rounded-card shadow-card p-7">
      <h2 className="text-xl font-semibold text-textPrimary mb-1">Describe Your Design</h2>
      <p className="text-sm text-textSecondary mb-5">
        Write the base plate design in plain language. The AI extractor will pull out engineering parameters.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[180px] rounded-input border border-borderMed px-4 py-3 text-sm text-textPrimary
          placeholder:text-textMuted outline-none transition-all duration-150 focus:border-primary focus:shadow-inputFocus resize-y"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {examples.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onChange(ex.text)}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-surfaceGray text-textSecondary
              hover:bg-primaryLight hover:text-primary transition-colors duration-150 border border-borderLight"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <Button
        onClick={handleExtract}
        disabled={!value.trim() || loading}
        fullWidth
        size="lg"
        className="mt-6"
      >
        {loading ? (
          <motion.span className="flex items-center gap-2" animate={{ opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
            <Loader2 size={18} className="animate-spin" /> AI is reading your input...
          </motion.span>
        ) : (
          <>
            <Sparkles size={18} /> Extract Parameters →
          </>
        )}
      </Button>
    </div>
  );
}
