export interface AnchorGrade {
  label: string; // e.g. "IS 1367 Class 8.8"
  fy: number; // MPa
  fu: number; // MPa
  sizes: string[]; // diameter labels
}

export const IS_ANCHOR_GRADES: AnchorGrade[] = [
  {
    label: "IS 1367 Class 4.6",
    fy: 240,
    fu: 400,
    sizes: ["M12", "M16", "M20", "M24", "M30", "M36", "M42", "M48"],
  },
  {
    label: "IS 1367 Class 4.8",
    fy: 320,
    fu: 400,
    sizes: ["M12", "M16", "M20", "M24", "M30"],
  },
  {
    label: "IS 1367 Class 5.6",
    fy: 300,
    fu: 500,
    sizes: ["M16", "M20", "M24", "M30", "M36"],
  },
  {
    label: "IS 1367 Class 8.8",
    fy: 640,
    fu: 800,
    sizes: ["M16", "M20", "M24", "M30", "M36", "M42", "M48"],
  },
  {
    label: "IS 1367 Class 10.9",
    fy: 900,
    fu: 1000,
    sizes: ["M16", "M20", "M24", "M30", "M36"],
  },
  {
    label: "SS304 (IS 3757)",
    fy: 210,
    fu: 500,
    sizes: ["M12", "M16", "M20", "M24"],
  },
  {
    label: "SS316 (IS 3757)",
    fy: 210,
    fu: 500,
    sizes: ["M12", "M16", "M20", "M24"],
  },
];

// fy/fu stored in MPa (converted from ksi) for internal calc consistency
export const ASTM_ANCHOR_GRADES: AnchorGrade[] = [
  {
    label: "ASTM F1554 Gr.36",
    fy: 248,
    fu: 400,
    sizes: [
      "1/2 in", "5/8 in", "3/4 in", "7/8 in", "1 in",
      "1-1/4 in", "1-1/2 in", "1-3/4 in", "2 in", "2-1/2 in", "3 in",
    ],
  },
  {
    label: "ASTM F1554 Gr.55",
    fy: 379,
    fu: 517,
    sizes: [
      "1/2 in", "5/8 in", "3/4 in", "7/8 in", "1 in",
      "1-1/4 in", "1-1/2 in", "1-3/4 in", "2 in", "2-1/2 in", "3 in",
    ],
  },
  {
    label: "ASTM F1554 Gr.105",
    fy: 724,
    fu: 862,
    sizes: ["3/4 in", "1 in", "1-1/4 in", "1-1/2 in", "2 in", "2-1/2 in", "3 in"],
  },
  {
    label: "ASTM A307",
    fy: 248,
    fu: 414,
    sizes: ["1/2 in", "5/8 in", "3/4 in", "1 in", "1-1/4 in"],
  },
  {
    label: "ASTM F3125 A325",
    fy: 634,
    fu: 827,
    sizes: ["1/2 in", "5/8 in", "3/4 in", "7/8 in", "1 in", "1-1/4 in"],
  },
  {
    label: "ASTM F3125 A490",
    fy: 896,
    fu: 1034,
    sizes: ["1/2 in", "5/8 in", "3/4 in", "7/8 in", "1 in", "1-1/4 in"],
  },
  {
    label: "ASTM F593 SS304/316",
    fy: 207,
    fu: 517,
    sizes: ["1/2 in", "5/8 in", "3/4 in", "1 in"],
  },
];

export function anchorGradesForCode(code: string): AnchorGrade[] {
  return code === "IS800" ? IS_ANCHOR_GRADES : ASTM_ANCHOR_GRADES;
}

// Convert anchor diameter label to nominal mm (for area calc)
export function anchorDiameterMm(label: string): number {
  // Metric: "M24" -> 24
  const mMatch = label.match(/^M(\d+(\.\d+)?)/i);
  if (mMatch) return parseFloat(mMatch[1]);

  // Imperial: "1-1/4 in" or "3/4 in" or "1 in"
  const clean = label.replace(/\s*in$/i, "").trim();
  let inches = 0;
  if (clean.includes("-")) {
    const [whole, frac] = clean.split("-");
    inches = parseFloat(whole) + fracToDecimal(frac);
  } else if (clean.includes("/")) {
    inches = fracToDecimal(clean);
  } else {
    inches = parseFloat(clean);
  }
  return inches * 25.4;
}

function fracToDecimal(frac: string): number {
  const [n, d] = frac.split("/").map(Number);
  if (!d) return 0;
  return n / d;
}

// Nominal stress area approximation (mm^2) using 0.78 * (pi/4) * d^2 (rough ISO/UNC factor)
export function anchorStressArea(diameterMm: number): number {
  return 0.78 * (Math.PI / 4) * diameterMm * diameterMm;
}
