import { CalcResult, UnitSystem } from "../../lib/types";
import { unitLabels, lengthFromMm } from "../../lib/unitConversion";
import ResultCard from "../ui/ResultCard";
import UtilisationBar from "../ui/UtilisationBar";
import Button from "../ui/Button";
import { AlertTriangle } from "lucide-react";

export default function Step06_Thickness({
  calc,
  unit,
  onNext,
}: {
  calc: CalcResult;
  unit: UnitSystem;
  onNext: () => void;
}) {
  const u = unitLabels(unit);
  const t = calc.thickness;
  const tpReq = lengthFromMm(t.tpReq, unit);
  const tpProv = lengthFromMm(t.tpProv, unit);

  return (
    <div className="space-y-5">
      <ResultCard title="Plate Thickness Design" status={t.status}>
        <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-2">Formula</p>
        <div className="bg-neutralDark rounded-input px-4 py-3.5 mb-5 font-mono text-[13px] text-neutralText leading-relaxed space-y-1">
          {t.formula.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-4">
          <div>
            <p className="text-xs font-medium text-textSecondary mb-1">Required thickness</p>
            <p className="text-lg font-mono font-semibold text-textPrimary">
              {tpReq.toFixed(2)} {u.length}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-textSecondary mb-1">Provided thickness</p>
            <p className="text-lg font-mono font-semibold text-textPrimary">
              {tpProv.toFixed(2)} {u.length}
            </p>
          </div>
        </div>

        <UtilisationBar util={t.util} label="Utilisation" />
      </ResultCard>

      {t.stiffenerWarning && (
        <div className="bg-warningLight border border-warningBorder rounded-card p-4 flex gap-3">
          <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-textPrimary">
            <span className="font-semibold">Stiffener Plate Recommended</span> — Required thickness exceeds 40mm. See Step 8.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext}>Next Step →</Button>
      </div>
    </div>
  );
}
