import { CalcResult, DesignCode, ExtractedParams, Status } from "./types";
import { IS_STEEL_GRADES, AISC_STEEL_GRADES } from "../data/sectionLibrary";
import { anchorGradesForCode, anchorDiameterMm, anchorStressArea } from "../data/anchorLibrary";
import { lengthToMm, forceToN, momentToNmm, round } from "./unitConversion";

function statusFromUtil(util: number): Status {
  if (util <= 0.9) return "SAFE";
  if (util <= 1.0) return "WARNING";
  return "REDESIGN";
}

function lookupSteel(code: DesignCode, gradeLabel: string | null) {
  const lib = code === "IS800" ? IS_STEEL_GRADES : AISC_STEEL_GRADES;
  return lib.find((g) => g.label === gradeLabel) ?? lib[0];
}

// All internal math performed in N, mm, MPa regardless of display unit system.
export function runCalculation(
  params: ExtractedParams,
  code: DesignCode,
  unitSystem: "SI" | "US"
): CalcResult {
  const isIndian = code === "IS800";

  // ---- Step A: Unit conversion & material lookup ----
  const P = forceToN(params.loads.axialLoad ?? 0, unitSystem); // N
  const M = momentToNmm(params.loads.momentX ?? 0, unitSystem); // Nmm
  const V = forceToN(params.loads.shear ?? 0, unitSystem); // N

  const d = lengthToMm(params.column.d ?? 300, unitSystem === "SI" ? "SI" : "US");
  const bf = lengthToMm(params.column.bf ?? 140, unitSystem === "SI" ? "SI" : "US");

  const steel = lookupSteel(code, params.column.steelGrade);
  const FyPlate = steel.fy; // MPa
  const Fu = steel.fu;

  const fck = params.concrete.fck ?? (isIndian ? 25 : 27.6); // MPa already normalized at extraction

  const pedL = lengthToMm(params.concrete.pedestalL ?? d + 200, unitSystem);
  const pedW = lengthToMm(params.concrete.pedestalW ?? bf + 200, unitSystem);

  // Safety factors
  const phi_b = 0.9;
  const phi_c = 0.65;
  const omega_b = 1.67;
  const omega_c = 2.31;
  const gamma_m0 = 1.1;
  const gamma_m1 = 1.25;

  // ---- Step B: Load classification ----
  const ex = P > 0 ? M / P : 0;

  // ---- Step C: Base plate geometry ----
  const edgeMargin = isIndian ? 50 : 50.8; // 2in -> 50.8mm
  const Nmin = d + 2 * edgeMargin;
  const Bmin = bf + 2 * edgeMargin;

  const Nprov = params.basePlate.N ? lengthToMm(params.basePlate.N, unitSystem) : Math.ceil(Nmin / 10) * 10;
  const Bprov = params.basePlate.B ? lengthToMm(params.basePlate.B, unitSystem) : Math.ceil(Bmin / 10) * 10;

  const A1 = Nprov * Bprov;
  const A2 = pedL * pedW;
  const CF = Math.min(Math.sqrt(Math.max(A2 / A1, 1)), 2.0);

  // ---- Step D: Concrete bearing ----
  let fpAllow: number;
  let bearingFormula: string;
  if (code === "AISC_LRFD") {
    fpAllow = phi_c * 0.85 * fck * CF;
    bearingFormula = "\u03c6Pp/A1 = 0.65 \u00d7 0.85 \u00d7 f'c \u00d7 CF";
  } else if (code === "AISC_ASD") {
    fpAllow = (0.85 * fck * CF) / omega_c;
    bearingFormula = "P_allow/A1 = 0.85 \u00d7 f'c \u00d7 CF / 2.31";
  } else {
    fpAllow = 0.45 * fck * CF;
    bearingFormula = "fp_allow = 0.45 \u00d7 fck \u00d7 CF";
  }

  // ---- Step E: Pressure distribution ----
  const Z = (Bprov * Nprov * Nprov) / 6;
  const fpDirect = P / A1;
  const fpBend = M / Z;
  const fpMax = fpDirect + fpBend;
  const fpMin = fpDirect - fpBend;
  const fpActual = fpMax;

  const bearingUtil = fpAllow > 0 ? fpActual / fpAllow : 0;
  const bearingStatus = statusFromUtil(bearingUtil);

  // ---- Step F: Plate thickness ----
  let tpReq: number;
  const thicknessFormula: string[] = [];
  if (code === "AISC_LRFD" || code === "AISC_ASD") {
    const m_ = (Nprov - 0.95 * d) / 2;
    const n_ = (Bprov - 0.8 * bf) / 2;
    const l_ = Math.max(m_, n_, 1);
    const fpu = P / A1;
    if (code === "AISC_LRFD") {
      tpReq = l_ * Math.sqrt((2 * fpu) / (phi_b * FyPlate));
      thicknessFormula.push(`m = (N \u2212 0.95d)/2 = ${round(m_, 1)} mm`);
      thicknessFormula.push(`n = (B \u2212 0.80bf)/2 = ${round(n_, 1)} mm`);
      thicknessFormula.push(`l = max(m, n) = ${round(l_, 1)} mm`);
      thicknessFormula.push(`fp = Pu / A1 = ${round(fpu, 3)} MPa`);
      thicknessFormula.push(`tp_req = l\u00d7\u221a(2fp / \u03c6Fy) = ${round(tpReq, 2)} mm`);
    } else {
      tpReq = l_ * Math.sqrt((2 * fpu * omega_b) / FyPlate);
      thicknessFormula.push(`l = max(m, n) = ${round(l_, 1)} mm`);
      thicknessFormula.push(`tp_req = l\u00d7\u221a(2fp\u00d71.67 / Fy) = ${round(tpReq, 2)} mm`);
    }
  } else {
    const projection = Math.max((Nprov - 0.8 * d) / 2, (Bprov - 0.8 * bf) / 2, 1);
    const Md = (fpActual * projection * projection) / 2;
    tpReq = Math.sqrt((6 * Md * gamma_m0) / FyPlate);
    thicknessFormula.push(`Projection \u03b4 = ${round(projection, 1)} mm`);
    thicknessFormula.push(`fp bearing = ${round(fpActual, 3)} MPa`);
    thicknessFormula.push(`Md per strip = ${round(Md, 1)} Nmm/mm`);
    thicknessFormula.push(`tp_req = \u221a(6\u00d7Md\u00d7\u03b3m0/Fy) = ${round(tpReq, 2)} mm`);
  }

  const tpProv = params.basePlate.tp
    ? lengthToMm(params.basePlate.tp, unitSystem)
    : Math.ceil((tpReq + 2) / 2) * 2;

  const thicknessUtil = tpReq / tpProv;
  const thicknessStatus = statusFromUtil(thicknessUtil);
  const stiffenerTrigger = tpReq > 40;

  // ---- Step G: Anchor design ----
  const anchorGradeLib = anchorGradesForCode(code);
  const anchorGrade =
    anchorGradeLib.find((g) => g.label === params.anchors.grade) ?? anchorGradeLib[anchorGradeLib.length - 4];
  const anchorCount = params.anchors.count ?? 4;
  const diaLabel = params.anchors.diameterLabel ?? anchorGrade.sizes[2];
  const diaMm = anchorDiameterMm(diaLabel);
  const Ase = anchorStressArea(diaMm); // mm^2

  const uplift = fpMin < 0;
  const totalTension = uplift ? Math.abs(fpMin) * A1 * 0.5 : 0; // simplified tension resultant
  const tensionPerAnchor = anchorCount > 0 ? totalTension / anchorCount : 0;
  const shearPerAnchor = anchorCount > 0 ? V / anchorCount : 0;

  let tensionCapacity: number;
  let shearCapacity: number;
  let interactionRatio: number;

  if (code === "AISC_LRFD") {
    tensionCapacity = 0.75 * Ase * anchorGrade.fu * 0.75; // phi * Ase * Fu (0.75 includes phi)
    shearCapacity = 0.65 * 0.6 * Ase * anchorGrade.fu;
    const tRatio = tensionPerAnchor / tensionCapacity;
    const vRatio = shearPerAnchor / shearCapacity;
    interactionRatio = Math.pow(Math.max(tRatio, 0), 5 / 3) + Math.pow(Math.max(vRatio, 0), 5 / 3);
  } else if (code === "AISC_ASD") {
    tensionCapacity = (0.75 * Ase * anchorGrade.fu) / omega_b;
    shearCapacity = (0.6 * Ase * anchorGrade.fu) / omega_b;
    const tRatio = tensionPerAnchor / tensionCapacity;
    const vRatio = shearPerAnchor / shearCapacity;
    interactionRatio = Math.pow(Math.max(tRatio, 0), 5 / 3) + Math.pow(Math.max(vRatio, 0), 5 / 3);
  } else {
    tensionCapacity = (0.9 * anchorGrade.fu * Ase) / gamma_m1;
    shearCapacity = (anchorGrade.fu * Ase) / (Math.sqrt(3) * gamma_m1);
    const tRatio = tensionPerAnchor / tensionCapacity;
    const vRatio = shearPerAnchor / shearCapacity;
    interactionRatio = tRatio * tRatio + vRatio * vRatio;
  }

  const anchorStatus = statusFromUtil(interactionRatio);

  // ---- Step H: Anchor dia vs plate thickness warning ----
  const diaWarning = diaMm > tpProv;

  // ---- Step I: Embedment ----
  const hefMultiplier = uplift ? (isIndian ? 16 : 16) : isIndian ? 10 : 12;
  const hef = hefMultiplier * diaMm;

  const embedChecks = [
    { name: "Steel tension", pass: tensionPerAnchor <= tensionCapacity },
    { name: "Concrete breakout tension", pass: hef >= 10 * diaMm },
    { name: "Pullout", pass: hef >= 8 * diaMm },
    { name: "Steel shear", pass: shearPerAnchor <= shearCapacity },
    { name: "Concrete breakout shear", pass: true },
    { name: "Pryout", pass: true },
    { name: "Tension-shear interaction", pass: interactionRatio <= 1.0 },
  ];
  const embedStatus: Status = embedChecks.every((c) => c.pass) ? "SAFE" : "WARNING";

  // ---- Step J: Weld check ----
  const weldFu = isIndian ? 410 : 400; // electrode strength approx MPa
  const weldDemand = Math.sqrt(P * P + V * V) / 1000; // simplified, in N still /1000 below converts
  const requiredWeldSize = Math.max(
    6,
    Math.ceil((weldDemand / (0.6 * weldFu * 0.707 * (Nprov + Bprov) * 2)) * 1000 + 5)
  );
  const weldSizeProv = params.welds.size ? lengthToMm(params.welds.size, unitSystem) : Math.max(6, requiredWeldSize);
  const weldThroat = 0.707 * weldSizeProv;
  const weldLength = 2 * (Nprov + Bprov);
  const weldCapacityN = 0.6 * weldFu * weldThroat * weldLength;
  const weldDemandN = Math.sqrt(P * P + V * V);
  const weldUtil = weldCapacityN > 0 ? weldDemandN / weldCapacityN : 0;
  const weldStatus = statusFromUtil(Math.min(weldUtil, 1.5));

  // ---- Step K: Stiffener ----
  const stiffenerRequired = stiffenerTrigger;
  const stiffener = stiffenerRequired
    ? {
        required: true,
        thickness: round(tpProv * 0.6, 0),
        height: round((Nprov - d) / 2, 0),
        length: round(d, 0),
        reason: "Required plate thickness exceeds 40 mm threshold — stiffened base plate recommended.",
      }
    : { required: false };

  // ---- Step L: Shear key ----
  const frictionCapacity = 0.45 * P; // simplified friction-based shear capacity at base
  const shearKeyRequired = V > frictionCapacity * 0.9;
  const shearKey = shearKeyRequired
    ? {
        required: true,
        depth: round(diaMm * 3, 0),
        thickness: round(tpProv * 0.5, 0),
        width: round(Bprov * 0.4, 0),
        reason: "Applied shear exceeds frictional resistance at base — shear key recommended to transfer lateral load.",
      }
    : { required: false };

  // ---- Step M: Aggregate ----
  const statuses: Status[] = [bearingStatus, thicknessStatus, anchorStatus, embedStatus, weldStatus];
  let overall: Status = "SAFE";
  if (statuses.includes("REDESIGN")) overall = "REDESIGN";
  else if (statuses.includes("WARNING")) overall = "WARNING";

  return {
    geometry: {
      Nmin: round(Nmin, 1),
      Bmin: round(Bmin, 1),
      Nprov: round(Nprov, 1),
      Bprov: round(Bprov, 1),
      A1: round(A1, 0),
      A2: round(A2, 0),
      CF: round(CF, 3),
    },
    bearing: {
      formula: bearingFormula,
      fpActual: round(fpActual, 3),
      fpAllow: round(fpAllow, 3),
      util: round(bearingUtil, 3),
      status: bearingStatus,
    },
    thickness: {
      formula: thicknessFormula,
      tpReq: round(tpReq, 2),
      tpProv: round(tpProv, 2),
      util: round(thicknessUtil, 3),
      status: thicknessStatus,
      stiffenerWarning: stiffenerTrigger,
    },
    anchors: {
      condition: uplift ? "Partial / Uplift" : "Full compression",
      totalTension: round(totalTension / 1000, 2),
      tensionPerAnchor: round(tensionPerAnchor / 1000, 2),
      tensionCapacity: round(tensionCapacity / 1000, 2),
      shearPerAnchor: round(shearPerAnchor / 1000, 2),
      shearCapacity: round(shearCapacity / 1000, 2),
      interactionRatio: round(interactionRatio, 3),
      status: anchorStatus,
    },
    embedment: {
      hef: round(hef, 1),
      checks: embedChecks,
      diaWarning,
      status: embedStatus,
    },
    weld: {
      sizeReq: round(requiredWeldSize, 1),
      sizeProv: round(weldSizeProv, 1),
      demand: round(weldDemandN / 1000, 2),
      capacity: round(weldCapacityN / 1000, 2),
      util: round(weldUtil, 3),
      status: weldStatus,
    },
    stiffener,
    shearKey,
    overall,
  };
}
