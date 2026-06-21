import { motion } from "framer-motion";
import { FileDown, ClipboardCopy, FileJson, RotateCw, Check } from "lucide-react";
import { CalcResult, DesignCode, ExtractedParams, ProjectInfo, ReviewResult, UnitSystem } from "../../lib/types";
import { unitLabels, lengthFromMm, stressFromMpa } from "../../lib/unitConversion";
import { useState } from "react";

export default function Step10_Summary({
  project,
  params,
  calc,
  review,
  code,
  unit,
  onExportPDF,
  onNewDesign,
}: {
  project: ProjectInfo;
  params: ExtractedParams;
  calc: CalcResult;
  review: ReviewResult;
  code: DesignCode;
  unit: UnitSystem;
  onExportPDF: () => void;
  onNewDesign: () => void;
}) {
  const u = unitLabels(unit);
  const isIndian = code === "IS800";
  const [copied, setCopied] = useState(false);

  const overallSafe = calc.overall === "SAFE";
  const banner = overallSafe
    ? { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A", label: "✅ DESIGN SAFE — All checks passed" }
    : calc.overall === "WARNING"
    ? { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706", label: "⚠ SAFE WITH WARNINGS — Review flagged items" }
    : { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", label: "❌ REDESIGN REQUIRED — See critical issues" };

  const anchorLabel = isIndian
    ? `${params.anchors.count ?? 4} × ${params.anchors.diameterLabel ?? "—"}`
    : `${params.anchors.count ?? 4} × ${params.anchors.diameterLabel ?? "—"}`;

  const rows: { label: string; value: string; ok: boolean }[] = [
    {
      label: "Base Plate Size",
      value: `${lengthFromMm(calc.geometry.Nprov, unit).toFixed(0)} × ${lengthFromMm(calc.geometry.Bprov, unit).toFixed(0)} ${u.length}`,
      ok: true,
    },
    { label: "Required tp", value: `${lengthFromMm(calc.thickness.tpReq, unit).toFixed(2)} ${u.length}`, ok: true },
    { label: "Provided tp", value: `${lengthFromMm(calc.thickness.tpProv, unit).toFixed(2)} ${u.length}`, ok: true },
    { label: "Anchor Count", value: `${params.anchors.count ?? 4} nos`, ok: true },
    { label: "Anchor / Grade", value: `${anchorLabel} — ${params.anchors.grade ?? "—"}`, ok: true },
    { label: "Embedment Length", value: `${lengthFromMm(calc.embedment.hef, unit).toFixed(0)} ${u.length}`, ok: calc.embedment.status === "SAFE" },
    { label: "Bearing Utilisation", value: calc.bearing.util.toFixed(2), ok: calc.bearing.status !== "REDESIGN" },
    { label: "Plate Thickness Util.", value: calc.thickness.util.toFixed(2), ok: calc.thickness.status !== "REDESIGN" },
    { label: "Anchor Interaction Util.", value: calc.anchors.interactionRatio.toFixed(2), ok: calc.anchors.status !== "REDESIGN" },
    { label: "Weld Size", value: `${lengthFromMm(calc.weld.sizeProv, unit).toFixed(1)} ${u.length} fillet`, ok: calc.weld.status !== "REDESIGN" },
    { label: "Stiffener Required", value: calc.stiffener.required ? "Yes" : "No", ok: true },
    { label: "Shear Key Required", value: calc.shearKey.required ? "Yes" : "No", ok: true },
  ];

  const handleCopySummary = () => {
    const lines = [
      `STRUCTAI BASEPLATE — DESIGN SUMMARY`,
      `Project: ${project.projectName || "Untitled"}   Designer: ${project.designerName || "—"}`,
      `Code: ${code}   Units: ${unit === "SI" ? "SI Metric" : "US Customary"}`,
      ``,
      ...rows.map((r) => `${r.label.padEnd(28)}: ${r.value}`),
      ``,
      `OVERALL STATUS: ${calc.overall}`,
    ].join("\n");
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExportJSON = () => {
    const payload = { project, code, unit, params, calc, review };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `StructAI_Results_${project.projectName || "Design"}.json`;
    link.click();
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-card border px-5 py-4 text-center font-semibold"
        style={{ backgroundColor: banner.bg, borderColor: banner.border, color: banner.text }}
      >
        {banner.label}
      </motion.div>

      <div className="bg-surface border border-borderLight rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surfaceGray text-left">
              <th className="px-5 py-3 font-semibold text-textPrimary">Check</th>
              <th className="px-5 py-3 font-semibold text-textPrimary">Result</th>
              <th className="px-5 py-3 font-semibold text-textPrimary text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className={i % 2 === 0 ? "bg-surface" : "bg-page"}>
                <td className="px-5 py-2.5 text-textSecondary">{r.label}</td>
                <td className="px-5 py-2.5 font-mono text-textPrimary">{r.value}</td>
                <td className="px-5 py-2.5 text-right">{r.ok ? "✅" : "❌"}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-borderMed">
              <td className="px-5 py-3 font-semibold text-textPrimary">OVERALL</td>
              <td className="px-5 py-3"></td>
              <td className="px-5 py-3 text-right font-semibold" style={{ color: banner.text }}>
                {calc.overall}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <ExportButton icon={FileDown} label="Download PDF" onClick={onExportPDF} color="#2563EB" />
        <ExportButton
          icon={copied ? Check : ClipboardCopy}
          label={copied ? "Copied!" : "Copy Summary"}
          onClick={handleCopySummary}
          color="#16A34A"
        />
        <ExportButton icon={FileJson} label="Export JSON" onClick={handleExportJSON} color="#0891B2" />
        <ExportButton icon={RotateCw} label="New Design" onClick={onNewDesign} color="#475569" />
      </div>
    </div>
  );
}

function ExportButton({
  icon: Icon,
  label,
  onClick,
  color,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-card border-2 bg-surface
        text-sm font-medium transition-all duration-150 hover:-translate-y-[1px]"
      style={{ borderColor: `${color}40`, color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.color = color;
      }}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}
