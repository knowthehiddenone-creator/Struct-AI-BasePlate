import { DesignCode, ExtractedParams } from "./types";
import { IS_SECTIONS, AISC_SECTIONS, IS_STEEL_GRADES, AISC_STEEL_GRADES } from "../data/sectionLibrary";
import { anchorGradesForCode } from "../data/anchorLibrary";

function emptyParams(): ExtractedParams {
  return {
    loads: { axialLoad: null, momentX: null, shear: null },
    column: { sectionType: null, sectionName: null, steelGrade: null, d: null, bf: null },
    concrete: { grade: null, fck: null, pedestalL: null, pedestalW: null },
    basePlate: { N: null, B: null, tp: null, plateGrade: null },
    anchors: { count: null, diameterLabel: null, grade: null, embedment: null },
    welds: { size: null, type: "fillet" },
  };
}

// Extracts engineering parameters from free-form text.
// This mimics an LLM extraction step but runs entirely client-side via pattern matching,
// so the app works instantly with no API key / backend required.
export function extractParameters(text: string, code: DesignCode): ExtractedParams {
  const out = emptyParams();
  const t = text.replace(/\s+/g, " ").trim();
  const isIndian = code === "IS800";

  // --- Axial load ---
  let m =
    t.match(/axial\s*(?:load)?\s*(?:of)?\s*([\d.,]+)\s*(kn|kip[s]?)\b/i) ||
    t.match(/([\d.,]+)\s*(kn|kip[s]?)\s*axial/i);
  if (m) out.loads.axialLoad = parseFloat(m[1].replace(/,/g, ""));

  // --- Moment ---
  m =
    t.match(/moment\s*(?:mx)?\s*(?:of)?\s*([\d.,]+)\s*(knm|kip-?ft|kip\s*ft)\b/i) ||
    t.match(/([\d.,]+)\s*(knm|kip-?ft|kip\s*ft)\s*moment/i);
  if (m) out.loads.momentX = parseFloat(m[1].replace(/,/g, ""));

  // --- Shear ---
  m =
    t.match(/shear\s*(?:load)?\s*(?:of)?\s*([\d.,]+)\s*(kn|kip[s]?)\b/i) ||
    t.match(/([\d.,]+)\s*(kn|kip[s]?)\s*shear/i);
  if (m) out.loads.shear = parseFloat(m[1].replace(/,/g, ""));

  // --- Column section ---
  const sectionLib = isIndian ? IS_SECTIONS : AISC_SECTIONS;
  for (const sec of sectionLib) {
    if (sec.category === "Custom") continue;
    const escaped = sec.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped.replace(/\s/g, "\\s*"), "i");
    if (pattern.test(t)) {
      out.column.sectionName = sec.name;
      out.column.sectionType = sec.category;
      out.column.d = sec.d;
      out.column.bf = sec.bf;
      break;
    }
  }
  // generic patterns like "W10x49" or "ISMB 300" even if not in our exact list
  if (!out.column.sectionName) {
    const wMatch = t.match(/\bW\d+\s*[xX]\s*\d+\b/);
    const isMatch = t.match(/\b(ISMB|ISWB|ISHB|ISMC|SHS|RHS|CHS)\s*\d+/i);
    if (!isIndian && wMatch) {
      out.column.sectionName = wMatch[0].toUpperCase().replace(/\s/g, "");
      out.column.sectionType = "W";
    } else if (isIndian && isMatch) {
      out.column.sectionName = isMatch[0].toUpperCase();
      out.column.sectionType = isMatch[1].toUpperCase();
    }
  }

  // --- Steel grade for column/plate ---
  const steelLib = isIndian ? IS_STEEL_GRADES : AISC_STEEL_GRADES;
  for (const g of steelLib) {
    const key = g.label.split(" ")[0]; // e.g. "E250" or "A36"
    if (new RegExp(`\\b${key}\\b`, "i").test(t)) {
      out.column.steelGrade = g.label;
      out.basePlate.plateGrade = g.label;
      break;
    }
  }

  // --- Concrete grade ---
  if (isIndian) {
    m = t.match(/\bM\s?(15|20|25|30|35|40|45|50)\b/i);
    if (m) out.concrete.grade = `M${m[1]}`;
  } else {
    m = t.match(/f'?c\s*(?:of)?\s*([\d,]+)\s*psi/i);
    if (m) {
      const psi = parseFloat(m[1].replace(/,/g, ""));
      out.concrete.grade = `f'c ${psi} psi`;
      out.concrete.fck = round(psi * 0.00689476, 1);
    }
  }

  // --- Pedestal ---
  m = t.match(/pedestal\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*(mm|in)?/i);
  if (m) {
    out.concrete.pedestalL = parseFloat(m[1]);
    out.concrete.pedestalW = parseFloat(m[2]);
  }

  // --- Anchors ---
  m = t.match(/(\d+)\s*(?:nos\.?\s*)?(?:×|x|\*)?\s*(M\d+|\d+(?:-\d+\/\d+|\/\d+)?\s*in)\s*anchors?/i);
  if (!m) m = t.match(/(\d+)\s*anchors?\s*(M\d+|\d+(?:-\d+\/\d+|\/\d+)?\s*in)?/i);
  if (m) {
    out.anchors.count = parseInt(m[1], 10);
    if (m[2]) out.anchors.diameterLabel = m[2].toUpperCase().includes("M") ? m[2].toUpperCase() : m[2];
  }
  if (!out.anchors.diameterLabel) {
    const dM = t.match(/\bM(12|16|20|24|30|36|42|48)\b/);
    if (dM && isIndian) out.anchors.diameterLabel = `M${dM[1]}`;
    const dIn = t.match(/\b(1\/2|5\/8|3\/4|7\/8|1|1-1\/4|1-1\/2|1-3\/4|2|2-1\/2|3)\s*in\b/i);
    if (dIn && !isIndian) out.anchors.diameterLabel = `${dIn[1]} in`;
  }

  // --- Anchor grade ---
  const anchorLib = anchorGradesForCode(code);
  for (const g of anchorLib) {
    // match "Class 8.8" or "Gr.55" or "Gr 55" or full label fragments
    const classMatch = g.label.match(/Class\s*([\d.]+)/i);
    const grMatch = g.label.match(/Gr\.?\s*([\d.]+)/i);
    if (classMatch && new RegExp(`class\\s*${classMatch[1].replace(".", "\\.")}`, "i").test(t)) {
      out.anchors.grade = g.label;
      break;
    }
    if (grMatch && new RegExp(`gr\\.?\\s*${grMatch[1]}`, "i").test(t)) {
      out.anchors.grade = g.label;
      break;
    }
    if (new RegExp(g.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(t)) {
      out.anchors.grade = g.label;
      break;
    }
  }

  // --- Plate thickness if explicitly mentioned ---
  m = t.match(/plate\s*(?:thickness)?\s*(?:of)?\s*([\d.]+)\s*(mm|in)\b/i);
  if (m) out.basePlate.tp = parseFloat(m[1]);

  // --- Base plate N x B if explicitly given ---
  m = t.match(/base\s*plate\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*(mm|in)/i);
  if (m) {
    out.basePlate.N = parseFloat(m[1]);
    out.basePlate.B = parseFloat(m[2]);
  }

  // --- Weld size ---
  m = t.match(/weld\s*(?:size)?\s*(?:of)?\s*([\d.]+)\s*(mm|in)/i);
  if (m) out.welds.size = parseFloat(m[1]);

  return out;
}

function round(v: number, d: number) {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}
