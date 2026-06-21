export type DesignCode = "AISC_LRFD" | "AISC_ASD" | "IS800";
export type UnitSystem = "SI" | "US";
export type Status = "SAFE" | "WARNING" | "REDESIGN" | "INFO";

export interface ProjectInfo {
  projectName: string;
  designerName: string;
  date: string;
  code: DesignCode | null;
}

export interface LoadInputs {
  axialLoad: number | null; // kN or kips (display) -> stored in display unit, converted internally
  momentX: number | null; // kNm or kip-ft
  shear: number | null; // kN or kips
}

export interface ColumnInputs {
  sectionType: string | null; // e.g. "ISMB" or "W"
  sectionName: string | null; // e.g. "ISMB 300" or "W10x49"
  steelGrade: string | null;
  d: number | null; // depth mm/in
  bf: number | null; // flange width mm/in
}

export interface ConcreteInputs {
  grade: string | null; // M25, M30 / 3000psi, 4000psi
  fck: number | null; // MPa or derived
  pedestalL: number | null;
  pedestalW: number | null;
}

export interface BasePlateInputs {
  N: number | null;
  B: number | null;
  tp: number | null; // provided thickness
  plateGrade: string | null;
}

export interface AnchorInputs {
  count: number | null;
  diameterLabel: string | null; // "M24" or "1-1/4 in"
  grade: string | null; // "IS 1367 Class 8.8" or "ASTM F1554 Gr.55"
  embedment: number | null;
}

export interface WeldInputs {
  size: number | null;
  type: "fillet" | "full-pen";
}

export interface ExtractedParams {
  loads: LoadInputs;
  column: ColumnInputs;
  concrete: ConcreteInputs;
  basePlate: BasePlateInputs;
  anchors: AnchorInputs;
  welds: WeldInputs;
}

export interface Assumption {
  id: string;
  label: string;
  value: string;
  overridden: boolean;
}

export interface CalcResult {
  geometry: {
    Nmin: number;
    Bmin: number;
    Nprov: number;
    Bprov: number;
    A1: number;
    A2: number;
    CF: number;
  };
  bearing: {
    formula: string;
    fpActual: number;
    fpAllow: number;
    util: number;
    status: Status;
  };
  thickness: {
    formula: string[];
    tpReq: number;
    tpProv: number;
    util: number;
    status: Status;
    stiffenerWarning: boolean;
  };
  anchors: {
    condition: "Full compression" | "Partial / Uplift";
    totalTension: number;
    tensionPerAnchor: number;
    tensionCapacity: number;
    shearPerAnchor: number;
    shearCapacity: number;
    interactionRatio: number;
    status: Status;
  };
  embedment: {
    hef: number;
    checks: { name: string; pass: boolean }[];
    diaWarning: boolean;
    status: Status;
  };
  weld: {
    sizeReq: number;
    sizeProv: number;
    demand: number;
    capacity: number;
    util: number;
    status: Status;
  };
  stiffener: {
    required: boolean;
    thickness?: number;
    height?: number;
    length?: number;
    reason?: string;
  };
  shearKey: {
    required: boolean;
    depth?: number;
    thickness?: number;
    width?: number;
    reason?: string;
  };
  overall: Status;
}

export interface ReviewResult {
  safePoints: string[];
  warnings: string[];
  criticalIssues: string[];
  recommendations: string[];
  finalStatus: "PROCEED" | "REVIEW" | "REDESIGN";
}

export interface DesignState {
  project: ProjectInfo;
  unitSystem: UnitSystem;
  nlInput: string;
  extracted: ExtractedParams;
  assumptions: Assumption[];
  missingFields: string[];
  calc: CalcResult | null;
  review: ReviewResult | null;
  currentStep: number;
}
