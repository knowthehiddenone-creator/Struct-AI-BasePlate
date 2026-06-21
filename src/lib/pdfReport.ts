import jsPDF from "jspdf";
import { CalcResult, DesignCode, ExtractedParams, ProjectInfo, ReviewResult, UnitSystem } from "./types";
import { unitLabels, lengthFromMm, stressFromMpa } from "./unitConversion";

const COLORS = {
  primary: [37, 99, 235] as [number, number, number],
  text: [15, 23, 42] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  success: [22, 163, 74] as [number, number, number],
  warning: [217, 119, 6] as [number, number, number],
  danger: [220, 38, 38] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
};

export function generatePDFReport(
  project: ProjectInfo,
  params: ExtractedParams,
  calc: CalcResult,
  review: ReviewResult,
  code: DesignCode,
  unit: UnitSystem
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const u = unitLabels(unit);
  const isIndian = code === "IS800";
  const pageW = 210;
  const margin = 18;
  let y = 0;

  const codeLabel =
    code === "AISC_LRFD" ? "AISC LRFD (AISC 360-22)" : code === "AISC_ASD" ? "AISC ASD (AISC 360-22)" : "IS 800:2007 Limit State";

  function footer(pageNum: number) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...COLORS.muted);
    doc.text(
      "Preliminary design only. Verify and approve by a qualified structural engineer before construction.",
      pageW / 2,
      289,
      { align: "center" }
    );
    doc.text(`Page ${pageNum}`, pageW - margin, 289, { align: "right" });
  }

  function header(title: string) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.primary);
    doc.text("StructAI BasePlate", margin, 12);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "normal");
    doc.text(project.projectName || "Untitled Project", pageW - margin, 12, { align: "right" });
    doc.setDrawColor(...COLORS.border);
    doc.line(margin, 15, pageW - margin, 15);
  }

  function sectionTitle(text: string) {
    if (y > 260) {
      footer(doc.getNumberOfPages());
      doc.addPage();
      header("");
      y = 25;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.text);
    doc.text(text, margin, y);
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.6);
    doc.line(margin, y + 1.5, margin + 30, y + 1.5);
    doc.setLineWidth(0.2);
    y += 8;
  }

  function bodyLine(text: string, opts: { bold?: boolean; color?: [number, number, number] } = {}) {
    if (y > 275) {
      footer(doc.getNumberOfPages());
      doc.addPage();
      header("");
      y = 25;
    }
    doc.setFontSize(9.5);
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setTextColor(...(opts.color ?? COLORS.text));
    doc.text(text, margin, y);
    y += 5.5;
  }

  function tableRow(label: string, value: string) {
    if (y > 278) {
      footer(doc.getNumberOfPages());
      doc.addPage();
      header("");
      y = 25;
    }
    doc.setFontSize(9.3);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.text);
    doc.text(value, pageW - margin, y, { align: "right" });
    doc.setDrawColor(...COLORS.border);
    doc.line(margin, y + 1.6, pageW - margin, y + 1.6);
    y += 6;
  }

  function statusChip(status: string): [number, number, number] {
    if (status === "SAFE") return COLORS.success;
    if (status === "WARNING") return COLORS.warning;
    return COLORS.danger;
  }

  // ===== COVER PAGE =====
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageW, 4, "F");
  y = 50;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text("Steel Base Plate", pageW / 2, y, { align: "center" });
  y += 9;
  doc.text("Design Report", pageW / 2, y, { align: "center" });
  y += 14;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(codeLabel, pageW / 2, y, { align: "center" });
  y += 20;

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  const coverRows: [string, string][] = [
    ["Project Name", project.projectName || "—"],
    ["Designer", project.designerName || "—"],
    ["Date", project.date || "—"],
    ["Design Code", codeLabel],
    ["Unit System", unit === "SI" ? "SI Metric" : "US Customary"],
    ["Revision", "A — Preliminary"],
  ];
  coverRows.forEach(([k, v]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(k, 70, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.text);
    doc.text(v, 140, y);
    y += 7;
  });

  y += 10;
  const chipColor = statusChip(calc.overall === "SAFE" ? "SAFE" : calc.overall === "WARNING" ? "WARNING" : "REDESIGN");
  doc.setFillColor(...chipColor);
  doc.roundedRect(70, y, 70, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PRELIMINARY DESIGN", 105, y + 6.7, { align: "center" });

  y += 25;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.muted);
  const disclaimer =
    "This report is generated by StructAI BasePlate for preliminary design assistance only. Results must be reviewed, verified, and approved by a qualified structural engineer before use in construction or fabrication. StructAI and its developers accept no liability for design decisions made based on this output.";
  const wrapped = doc.splitTextToSize(disclaimer, 150);
  doc.text(wrapped, pageW / 2, y, { align: "center" });

  footer(1);

  // ===== CONTENT PAGES =====
  doc.addPage();
  header("");
  y = 25;

  sectionTitle("1. Design Code and Method");
  bodyLine(`Design code: ${codeLabel}`);
  bodyLine(`Method: ${code === "IS800" ? "Limit State Method (\u03b3m0 = 1.10, \u03b3m1 = 1.25)" : code === "AISC_LRFD" ? "Load and Resistance Factor Design (\u03c6b=0.90, \u03c6c=0.65)" : "Allowable Strength Design (\u03a9b=1.67, \u03a9c=2.31)"}`);

  sectionTitle("2. Project Details");
  tableRow("Project Name", project.projectName || "—");
  tableRow("Designer", project.designerName || "—");
  tableRow("Date", project.date || "—");

  sectionTitle("3. Material Properties");
  tableRow("Column steel grade", params.column.steelGrade || "—");
  tableRow("Base plate grade", params.basePlate.plateGrade || params.column.steelGrade || "—");
  tableRow("Concrete grade", params.concrete.grade || "—");
  tableRow("Anchor grade", params.anchors.grade || "—");

  sectionTitle("4. Input Summary");
  tableRow("Column section", params.column.sectionName || "—");
  tableRow(`Axial load P`, `${params.loads.axialLoad ?? "—"} ${u.force}`);
  tableRow(`Moment Mx`, `${params.loads.momentX ?? "—"} ${u.moment}`);
  tableRow(`Shear V`, `${params.loads.shear ?? "—"} ${u.force}`);

  sectionTitle("5. Load Data");
  tableRow("Axial Load (P)", `${params.loads.axialLoad ?? "—"} ${u.force}`);
  tableRow("Moment (Mx)", `${params.loads.momentX ?? "—"} ${u.moment}`);
  tableRow("Shear (V)", `${params.loads.shear ?? "—"} ${u.force}`);

  sectionTitle("6. Load Classification");
  bodyLine(`Eccentricity-based classification: ${calc.anchors.condition}`);

  sectionTitle("7. Column Data");
  tableRow("Section", params.column.sectionName || "—");
  tableRow("Depth (d)", `${params.column.d ?? "—"} ${u.length}`);
  tableRow("Flange width (bf)", `${params.column.bf ?? "—"} ${u.length}`);

  sectionTitle("8. Base Plate Geometry");
  tableRow("Provided N \u00d7 B", `${lengthFromMm(calc.geometry.Nprov, unit).toFixed(1)} \u00d7 ${lengthFromMm(calc.geometry.Bprov, unit).toFixed(1)} ${u.length}`);
  tableRow("Area A1", `${calc.geometry.A1.toFixed(0)} mm\u00B2`);
  tableRow("Pedestal Area A2", `${calc.geometry.A2.toFixed(0)} mm\u00B2`);
  tableRow("Confinement factor", calc.geometry.CF.toFixed(3));

  sectionTitle("9. Pressure Distribution");
  tableRow("Max bearing pressure", `${stressFromMpa(calc.bearing.fpActual, unit).toFixed(2)} ${u.stress}`);

  sectionTitle("10. Concrete Bearing Check");
  bodyLine(calc.bearing.formula);
  tableRow("Bearing pressure", `${stressFromMpa(calc.bearing.fpActual, unit).toFixed(2)} ${u.stress}`);
  tableRow("Allowable pressure", `${stressFromMpa(calc.bearing.fpAllow, unit).toFixed(2)} ${u.stress}`);
  tableRow("Utilisation", calc.bearing.util.toFixed(2));
  tableRow("Status", calc.bearing.status);

  sectionTitle("11. Base Plate Thickness Check");
  calc.thickness.formula.forEach((f) => bodyLine(f));
  tableRow("Required thickness", `${lengthFromMm(calc.thickness.tpReq, unit).toFixed(2)} ${u.length}`);
  tableRow("Provided thickness", `${lengthFromMm(calc.thickness.tpProv, unit).toFixed(2)} ${u.length}`);
  tableRow("Status", calc.thickness.status);

  sectionTitle("12. Anchor Bolt Design");
  tableRow("Anchor grade", params.anchors.grade || "—");
  tableRow("Anchor count / diameter", `${params.anchors.count ?? 4} \u00d7 ${params.anchors.diameterLabel ?? "—"}`);
  tableRow("Tension per anchor", `${calc.anchors.tensionPerAnchor.toFixed(2)} ${u.force}`);
  tableRow("Shear per anchor", `${calc.anchors.shearPerAnchor.toFixed(2)} ${u.force}`);
  tableRow("Interaction ratio", calc.anchors.interactionRatio.toFixed(3));

  sectionTitle("13. Anchor Diameter vs Plate Thickness");
  bodyLine(
    calc.embedment.diaWarning
      ? "Warning: anchor diameter exceeds plate thickness — constructability concern, not a strength failure."
      : "Anchor diameter is within plate thickness. No constructability concern flagged."
  );

  sectionTitle("14. Embedment Length");
  bodyLine(isIndian ? "Reference: IS 5624 & IS 800 recommendations" : "Reference: ACI 318 Chapter 17");
  tableRow("Embedment hef", `${lengthFromMm(calc.embedment.hef, unit).toFixed(1)} ${u.length}`);
  calc.embedment.checks.forEach((c) => tableRow(c.name, c.pass ? "PASS" : "REVIEW"));

  sectionTitle("15. Punching / Concrete Check");
  bodyLine("Concrete breakout and punching checks performed per embedment provisions above.");

  sectionTitle("16. Weld Check");
  tableRow("Required weld size", `${lengthFromMm(calc.weld.sizeReq, unit).toFixed(2)} ${u.length}`);
  tableRow("Provided weld size", `${lengthFromMm(calc.weld.sizeProv, unit).toFixed(2)} ${u.length}`);
  tableRow("Utilisation", calc.weld.util.toFixed(2));
  tableRow("Status", calc.weld.status);

  sectionTitle("17. Stiffener Plate");
  if (calc.stiffener.required) {
    tableRow("Thickness", `${lengthFromMm(calc.stiffener.thickness ?? 0, unit).toFixed(1)} ${u.length}`);
    tableRow("Height", `${lengthFromMm(calc.stiffener.height ?? 0, unit).toFixed(1)} ${u.length}`);
    tableRow("Length", `${lengthFromMm(calc.stiffener.length ?? 0, unit).toFixed(1)} ${u.length}`);
    bodyLine(calc.stiffener.reason || "");
  } else {
    bodyLine("Not required.");
  }

  sectionTitle("18. Shear Key / Shear Lug");
  if (calc.shearKey.required) {
    tableRow("Depth", `${lengthFromMm(calc.shearKey.depth ?? 0, unit).toFixed(1)} ${u.length}`);
    tableRow("Thickness", `${lengthFromMm(calc.shearKey.thickness ?? 0, unit).toFixed(1)} ${u.length}`);
    tableRow("Width", `${lengthFromMm(calc.shearKey.width ?? 0, unit).toFixed(1)} ${u.length}`);
    bodyLine(calc.shearKey.reason || "");
  } else {
    bodyLine("Not required.");
  }

  sectionTitle("19. AI Design Review Comments");
  bodyLine("Safe points:", { bold: true, color: COLORS.success });
  review.safePoints.forEach((s) => bodyLine(`\u2022 ${s}`));
  bodyLine("Warnings:", { bold: true, color: COLORS.warning });
  if (review.warnings.length === 0) bodyLine("None");
  review.warnings.forEach((s) => bodyLine(`\u2022 ${s}`));
  bodyLine("Critical issues:", { bold: true, color: COLORS.danger });
  if (review.criticalIssues.length === 0) bodyLine("None");
  review.criticalIssues.forEach((s) => bodyLine(`\u2022 ${s}`));

  sectionTitle("20. Final Design Summary");
  tableRow("Base plate size", `${lengthFromMm(calc.geometry.Nprov, unit).toFixed(0)} \u00d7 ${lengthFromMm(calc.geometry.Bprov, unit).toFixed(0)} ${u.length}`);
  tableRow("Anchor", `${params.anchors.count ?? 4} \u00d7 ${params.anchors.diameterLabel ?? "—"} — ${params.anchors.grade ?? "—"}`);
  tableRow("Overall status", calc.overall);

  sectionTitle("21. Engineering Notes & Disclaimer");
  const note = doc.splitTextToSize(
    "This report is generated by StructAI BasePlate for preliminary design assistance only. Results must be reviewed, verified, and approved by a qualified structural engineer before use in construction or fabrication. StructAI and its developers accept no liability for design decisions made based on this output.",
    pageW - 2 * margin
  );
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.muted);
  doc.text(note, margin, y);

  // footers for all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    footer(p);
  }

  const filename = `StructAI_BasePlate_${(project.projectName || "Design").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
