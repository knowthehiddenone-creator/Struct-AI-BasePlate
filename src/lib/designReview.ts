import { CalcResult, ExtractedParams, ReviewResult } from "./types";

export function runDesignReview(calc: CalcResult, params: ExtractedParams): ReviewResult {
  const safePoints: string[] = [];
  const warnings: string[] = [];
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  // Bearing
  if (calc.bearing.status === "SAFE") {
    safePoints.push(`Concrete bearing utilisation at ${calc.bearing.util.toFixed(2)} — within safe limits.`);
  } else if (calc.bearing.status === "WARNING") {
    warnings.push(`Concrete bearing utilisation at ${calc.bearing.util.toFixed(2)} — close to capacity, monitor confinement factor.`);
  } else {
    criticalIssues.push(`Concrete bearing pressure exceeds allowable by ${((calc.bearing.util - 1) * 100).toFixed(0)}%. Increase plate area or pedestal confinement.`);
  }

  // Thickness
  if (calc.thickness.status === "SAFE") {
    safePoints.push(`Plate thickness provided exceeds required thickness with utilisation ${calc.thickness.util.toFixed(2)}.`);
  } else if (calc.thickness.status === "WARNING") {
    warnings.push(`Plate thickness utilisation is ${calc.thickness.util.toFixed(2)} — limited margin against bending failure.`);
  } else {
    criticalIssues.push(`Provided plate thickness is inadequate for bending demand. Increase thickness or add stiffeners.`);
  }
  if (calc.thickness.stiffenerWarning) {
    warnings.push("Required thickness exceeds 40 mm — a stiffened base plate configuration is strongly recommended over a single thick plate for constructability and cost.");
  }

  // Anchors
  if (calc.anchors.status === "SAFE") {
    safePoints.push(`Anchor tension-shear interaction ratio ${calc.anchors.interactionRatio.toFixed(2)} confirms adequate anchor capacity.`);
  } else if (calc.anchors.status === "WARNING") {
    warnings.push(`Anchor interaction ratio ${calc.anchors.interactionRatio.toFixed(2)} is close to the limit of 1.0 — consider increasing anchor diameter or count.`);
  } else {
    criticalIssues.push(`Anchor tension-shear interaction ratio of ${calc.anchors.interactionRatio.toFixed(2)} exceeds 1.0. Increase anchor count, diameter, or grade.`);
  }
  if (calc.anchors.condition === "Partial / Uplift") {
    warnings.push("Load case produces net uplift on part of the base plate — verify anchor tension transfer path and embedment carefully.");
  } else {
    safePoints.push("Base plate remains in full compression under applied loads — no net anchor uplift demand.");
  }

  // Embedment
  if (calc.embedment.status === "SAFE") {
    safePoints.push(`Anchor embedment of ${calc.embedment.hef.toFixed(0)} mm satisfies all preliminary checks.`);
  } else {
    const failed = calc.embedment.checks.filter((c) => !c.pass).map((c) => c.name);
    warnings.push(`Embedment checks flagged for review: ${failed.join(", ")}. Confirm with detailed anchor design per manufacturer ICC-ES report.`);
  }
  if (calc.embedment.diaWarning) {
    warnings.push("Anchor diameter exceeds provided plate thickness — not a strength failure, but a constructability concern. Consider a thicker plate or a separate washer/leveling plate.");
  }

  // Weld
  if (calc.weld.status === "SAFE") {
    safePoints.push(`Weld size of ${calc.weld.sizeProv} mm provides adequate capacity for the connection demand.`);
  } else if (calc.weld.status === "WARNING") {
    warnings.push(`Weld utilisation ${calc.weld.util.toFixed(2)} is near capacity — verify weld access and effective length assumptions.`);
  } else {
    criticalIssues.push(`Weld size is undersized for the connection demand. Increase fillet weld size or weld length.`);
  }

  // Stiffener / shear key
  if (calc.stiffener.required) {
    recommendations.push(`Provide stiffener plates: thickness ${calc.stiffener.thickness} mm, height ${calc.stiffener.height} mm, length ${calc.stiffener.length} mm.`);
  }
  if (calc.shearKey.required) {
    recommendations.push(`Provide a shear key: depth ${calc.shearKey.depth} mm, thickness ${calc.shearKey.thickness} mm, width ${calc.shearKey.width} mm to transfer base shear.`);
  }

  recommendations.push("Verify all preliminary results against IS 800 / AISC 360 detailed design provisions before issuing for fabrication.");
  recommendations.push("Confirm anchor edge distances and spacing satisfy minimum requirements to avoid concrete breakout.");
  if (params.anchors.count && params.anchors.count < 4) {
    recommendations.push("Consider a minimum of 4 anchors for stability during erection, even if fewer are required by load.");
  }

  let finalStatus: "PROCEED" | "REVIEW" | "REDESIGN" = "PROCEED";
  if (criticalIssues.length > 0) finalStatus = "REDESIGN";
  else if (warnings.length > 0) finalStatus = "REVIEW";

  return { safePoints, warnings, criticalIssues, recommendations, finalStatus };
}
