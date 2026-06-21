import { Assumption, DesignCode, ExtractedParams } from "./types";

export interface MissingFieldDef {
  path: string; // dotted path into ExtractedParams
  label: string;
  unit: string;
}

export function checkMissingData(p: ExtractedParams, code: DesignCode): MissingFieldDef[] {
  const isIndian = code === "IS800";
  const lenUnit = isIndian ? "mm" : "in";
  const forceUnit = isIndian ? "kN" : "kips";
  const momUnit = isIndian ? "kNm" : "kip-ft";

  const missing: MissingFieldDef[] = [];

  if (p.loads.axialLoad == null) missing.push({ path: "loads.axialLoad", label: "Axial Load P", unit: forceUnit });
  if (p.loads.momentX == null) missing.push({ path: "loads.momentX", label: "Moment Mx", unit: momUnit });
  if (p.loads.shear == null) missing.push({ path: "loads.shear", label: "Shear V", unit: forceUnit });
  if (!p.column.sectionName) missing.push({ path: "column.sectionName", label: "Column Section", unit: "" });
  if (!p.column.steelGrade) missing.push({ path: "column.steelGrade", label: "Column Steel Grade", unit: "" });
  if (!p.concrete.grade) missing.push({ path: "concrete.grade", label: "Concrete Grade", unit: "" });
  if (p.concrete.pedestalL == null) missing.push({ path: "concrete.pedestalL", label: "Pedestal Length", unit: lenUnit });
  if (p.concrete.pedestalW == null) missing.push({ path: "concrete.pedestalW", label: "Pedestal Width", unit: lenUnit });
  if (p.anchors.count == null) missing.push({ path: "anchors.count", label: "Anchor Count", unit: "nos" });
  if (!p.anchors.diameterLabel) missing.push({ path: "anchors.diameterLabel", label: "Anchor Diameter", unit: "" });
  if (!p.anchors.grade) missing.push({ path: "anchors.grade", label: "Anchor Grade", unit: "" });

  return missing;
}

export function generateAssumptions(p: ExtractedParams, code: DesignCode): Assumption[] {
  const isIndian = code === "IS800";
  const assumptions: Assumption[] = [];

  assumptions.push({
    id: "grout",
    label: "Grout thickness",
    value: isIndian ? "25 mm (default)" : "1 in (default)",
    overridden: false,
  });

  if (p.anchors.count == null || p.anchors.count < 4) {
    assumptions.push({
      id: "anchorCount",
      label: "Anchor count",
      value: "4 (minimum)",
      overridden: false,
    });
  }

  assumptions.push({
    id: "hef",
    label: "Embedment hef",
    value: "12 × diameter (preliminary)",
    overridden: false,
  });

  assumptions.push({
    id: "concreteCondition",
    label: "Concrete condition",
    value: "Cracked (conservative)",
    overridden: false,
  });

  if (p.basePlate.tp == null) {
    assumptions.push({
      id: "plateSize",
      label: "Base plate size",
      value: "Trial-sized from column dimensions",
      overridden: false,
    });
  }

  if (p.welds.size == null) {
    assumptions.push({
      id: "weldSize",
      label: "Weld size",
      value: "Recommended from load demand",
      overridden: false,
    });
  }

  return assumptions;
}

export function setByPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

export function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}
