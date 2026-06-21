import { CalcResult, ExtractedParams, UnitSystem } from "../../lib/types";
import { unitLabels } from "../../lib/unitConversion";
import { lengthFromMm, stressFromMpa } from "../../lib/unitConversion";
import ResultCard from "../ui/ResultCard";
import UtilisationBar from "../ui/UtilisationBar";
import BasePlateSketch from "../ui/BasePlateSketch";
import Button from "../ui/Button";

export default function Step05_Geometry({
  calc,
  params,
  unit,
  onNext,
}: {
  calc: CalcResult;
  params: ExtractedParams;
  unit: UnitSystem;
  onNext: () => void;
}) {
  const u = unitLabels(unit);
  const g = calc.geometry;

  const Nmin = lengthFromMm(g.Nmin, unit);
  const Bmin = lengthFromMm(g.Bmin, unit);
  const Nprov = lengthFromMm(g.Nprov, unit);
  const Bprov = lengthFromMm(g.Bprov, unit);
  const A1 = unit === "SI" ? g.A1 : g.A1 / 645.16;
  const A2 = unit === "SI" ? g.A2 : g.A2 / 645.16;

  const fpActual = stressFromMpa(calc.bearing.fpActual, unit);
  const fpAllow = stressFromMpa(calc.bearing.fpAllow, unit);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <ResultCard title="Geometry Results" delay={0}>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Minimum N required" value={`${Nmin.toFixed(1)} ${u.length}`} />
            <Row label="Minimum B required" value={`${Bmin.toFixed(1)} ${u.length}`} />
            <Row label="Provided N" value={`${Nprov.toFixed(1)} ${u.length}`} ok />
            <Row label="Provided B" value={`${Bprov.toFixed(1)} ${u.length}`} ok />
            <Row label="Area A1" value={`${A1.toFixed(0)} ${u.area}`} />
            <Row label="Pedestal Area A2" value={`${A2.toFixed(0)} ${u.area}`} />
            <Row label="Confinement \u221a(A2/A1)" value={`${g.CF.toFixed(3)} (\u2264 2.0)`} />
          </tbody>
        </table>
        <div className="mt-5 pt-5 border-t border-borderLight">
          <BasePlateSketch
            N={g.Nprov}
            B={g.Bprov}
            d={params.column.d ?? 300}
            bf={params.column.bf ?? 140}
            unit={unit === "SI" ? "mm" : "in"}
          />
        </div>
      </ResultCard>

      <ResultCard title="Concrete Bearing Check" status={calc.bearing.status} delay={0.1}>
        <div className="bg-neutralDark rounded-input px-4 py-3 mb-4 font-mono text-[13px] text-neutralText leading-relaxed">
          {calc.bearing.formula}
        </div>
        <table className="w-full text-sm mb-4">
          <tbody>
            <Row label="Bearing Pressure" value={`${fpActual.toFixed(2)} ${u.stress}`} />
            <Row label="Allowable Pressure" value={`${fpAllow.toFixed(2)} ${u.stress}`} />
          </tbody>
        </table>
        <UtilisationBar util={calc.bearing.util} label="Utilisation" />
      </ResultCard>

      <div className="md:col-span-2 flex justify-end">
        <Button onClick={onNext}>Next Step →</Button>
      </div>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <tr className="border-b border-borderLight last:border-0">
      <td className="py-2 text-textSecondary">{label}</td>
      <td className="py-2 text-right font-mono font-medium text-textPrimary">
        {value} {ok && <span className="text-success">✓</span>}
      </td>
    </tr>
  );
}
