import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { CalcResult, DesignCode, ExtractedParams, UnitSystem } from "../../lib/types";
import { unitLabels, forceFromN, lengthFromMm } from "../../lib/unitConversion";
import ResultCard from "../ui/ResultCard";
import BasePlateSketch from "../ui/BasePlateSketch";
import Button from "../ui/Button";

export default function Step07_Anchor({
  calc,
  params,
  code,
  unit,
  onNext,
}: {
  calc: CalcResult;
  params: ExtractedParams;
  code: DesignCode;
  unit: UnitSystem;
  onNext: () => void;
}) {
  const u = unitLabels(unit);
  const isIndian = code === "IS800";
  const a = calc.anchors;
  const count = params.anchors.count ?? 4;
  const diaLabel = params.anchors.diameterLabel ?? "—";
  const grade = params.anchors.grade ?? "—";

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <ResultCard title="Anchor Force Check" status={a.status}>
        <p className="text-sm font-medium text-primary mb-4">
          {grade} — {diaLabel} × {count} nos
        </p>
        <div className="mb-5">
          <BasePlateSketch
            N={calc.geometry.Nprov}
            B={calc.geometry.Bprov}
            d={params.column.d ?? 300}
            bf={params.column.bf ?? 140}
            anchorCount={count}
            showAnchors
            unit={unit === "SI" ? "mm" : "in"}
          />
        </div>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Pressure condition" value={a.condition} />
            <Row label="Total tension" value={`${a.totalTension.toFixed(1)} ${u.force}`} />
            <Row label="Tension per anchor" value={`${a.tensionPerAnchor.toFixed(2)} ${u.force}`} />
            <Row label="Tension capacity" value={`${a.tensionCapacity.toFixed(2)} ${u.force}`} />
            <Row label="Shear per anchor" value={`${a.shearPerAnchor.toFixed(2)} ${u.force}`} />
            <Row label="Shear capacity" value={`${a.shearCapacity.toFixed(2)} ${u.force}`} />
            <Row label="Interaction ratio" value={`${a.interactionRatio.toFixed(3)} (\u2264 1.0)`} />
          </tbody>
        </table>
      </ResultCard>

      <ResultCard title="Embedment Check" status={calc.embedment.status}>
        <p className="text-xs text-textMuted mb-4">
          {isIndian ? "Per IS 5624 & IS 800 recommendations" : "Per ACI 318 Chapter 17"}
        </p>
        <p className="text-sm font-medium text-textPrimary mb-4">
          hef preliminary ={" "}
          <span className="font-mono text-primary">
            {lengthFromMm(calc.embedment.hef, unit).toFixed(1)} {u.length}
          </span>
        </p>
        <div className="space-y-2.5 mb-4">
          {calc.embedment.checks.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-textSecondary">{c.name}</span>
              {c.pass ? (
                <CheckCircle2 size={16} className="text-success" />
              ) : (
                <XCircle size={16} className="text-danger" />
              )}
            </motion.div>
          ))}
        </div>

        {calc.embedment.diaWarning && (
          <div className="bg-warningLight border border-warningBorder rounded-input p-3 flex gap-2.5">
            <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-textPrimary leading-relaxed">
              Anchor diameter ({diaLabel}) may exceed plate thickness. Not a failure — constructability concern.
              Consider: increase tp or add washer plate.
            </p>
          </div>
        )}
      </ResultCard>

      <div className="md:col-span-2 flex justify-end">
        <Button onClick={onNext}>Next Step →</Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-borderLight last:border-0">
      <td className="py-2 text-textSecondary">{label}</td>
      <td className="py-2 text-right font-mono font-medium text-textPrimary">{value}</td>
    </tr>
  );
}
