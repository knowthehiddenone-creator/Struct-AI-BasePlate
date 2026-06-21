import { CalcResult, UnitSystem } from "../../lib/types";
import { unitLabels, lengthFromMm, forceFromN } from "../../lib/unitConversion";
import ResultCard from "../ui/ResultCard";
import UtilisationBar from "../ui/UtilisationBar";
import Button from "../ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function Step08_WeldStiffenerShearKey({
  calc,
  unit,
  onNext,
}: {
  calc: CalcResult;
  unit: UnitSystem;
  onNext: () => void;
}) {
  const u = unitLabels(unit);
  const w = calc.weld;
  const st = calc.stiffener;
  const sk = calc.shearKey;

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-3 gap-5">
        {/* Weld */}
        <ResultCard title="Weld Check" status={w.status}>
          <table className="w-full text-sm mb-4">
            <tbody>
              <Row label="Weld type" value="Fillet" />
              <Row label="Required size" value={`${lengthFromMm(w.sizeReq, unit).toFixed(2)} ${u.length}`} />
              <Row label="Provided size" value={`${lengthFromMm(w.sizeProv, unit).toFixed(2)} ${u.length}`} />
              <Row label="Demand" value={`${forceFromN(w.demand * 1000, unit).toFixed(1)} ${u.weldForce}`} />
              <Row label="Capacity" value={`${forceFromN(w.capacity * 1000, unit).toFixed(1)} ${u.weldForce}`} />
            </tbody>
          </table>
          <UtilisationBar util={w.util} label="Utilisation" />
        </ResultCard>

        {/* Stiffener */}
        <ResultCard title="Stiffener Plate">
          {st.required ? (
            <>
              <p className="text-lg font-bold text-warning mb-3">Required</p>
              <table className="w-full text-sm mb-3">
                <tbody>
                  <Row label="Thickness" value={`${lengthFromMm(st.thickness ?? 0, unit).toFixed(1)} ${u.length}`} />
                  <Row label="Height" value={`${lengthFromMm(st.height ?? 0, unit).toFixed(1)} ${u.length}`} />
                  <Row label="Length" value={`${lengthFromMm(st.length ?? 0, unit).toFixed(1)} ${u.length}`} />
                  <Row label="Weld required" value="Yes" />
                </tbody>
              </table>
              <p className="text-xs text-textSecondary leading-relaxed">{st.reason}</p>
            </>
          ) : (
            <div className="bg-successLight border border-successBorder rounded-input p-4 flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <p className="text-sm font-medium text-success">Not Required</p>
            </div>
          )}
        </ResultCard>

        {/* Shear key */}
        <ResultCard title="Shear Key / Lug">
          {sk.required ? (
            <>
              <p className="text-lg font-bold text-warning mb-3">Required</p>
              <table className="w-full text-sm mb-3">
                <tbody>
                  <Row label="Depth" value={`${lengthFromMm(sk.depth ?? 0, unit).toFixed(1)} ${u.length}`} />
                  <Row label="Thickness" value={`${lengthFromMm(sk.thickness ?? 0, unit).toFixed(1)} ${u.length}`} />
                  <Row label="Width" value={`${lengthFromMm(sk.width ?? 0, unit).toFixed(1)} ${u.length}`} />
                </tbody>
              </table>
              <p className="text-xs text-textSecondary leading-relaxed">{sk.reason}</p>
            </>
          ) : (
            <div className="bg-successLight border border-successBorder rounded-input p-4 flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <p className="text-sm font-medium text-success">Not Required</p>
            </div>
          )}
        </ResultCard>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Next Step →</Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-borderLight last:border-0">
      <td className="py-1.5 text-textSecondary">{label}</td>
      <td className="py-1.5 text-right font-mono font-medium text-textPrimary">{value}</td>
    </tr>
  );
}
