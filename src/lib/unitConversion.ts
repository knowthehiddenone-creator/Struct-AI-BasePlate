// Internal calculations always use SI: N, mm, MPa
// Display layer converts based on active unit system.

export const KN_TO_N = 1000;
export const KIP_TO_N = 4448.22;
export const KIPFT_TO_NMM = 1355818; // 1 kip-ft = 1.355818 kNm = 1,355,818 Nmm
export const KNM_TO_NMM = 1e6;
export const IN_TO_MM = 25.4;
export const MPA_PER_KSI = 6.89476;
export const PSI_TO_MPA = 0.00689476;
export const KGF_PER_KN = 101.97;

export function lengthToMm(value: number, unit: "SI" | "US"): number {
  return unit === "SI" ? value : value * IN_TO_MM;
}
export function lengthFromMm(valueMm: number, unit: "SI" | "US"): number {
  return unit === "SI" ? valueMm : valueMm / IN_TO_MM;
}

export function forceToN(value: number, unit: "SI" | "US"): number {
  return unit === "SI" ? value * KN_TO_N : value * KIP_TO_N;
}
export function forceFromN(valueN: number, unit: "SI" | "US"): number {
  return unit === "SI" ? valueN / KN_TO_N : valueN / KIP_TO_N;
}

export function momentToNmm(value: number, unit: "SI" | "US"): number {
  return unit === "SI" ? value * KNM_TO_NMM : value * KIPFT_TO_NMM;
}
export function momentFromNmm(valueNmm: number, unit: "SI" | "US"): number {
  return unit === "SI" ? valueNmm / KNM_TO_NMM : valueNmm / KIPFT_TO_NMM;
}

export function stressToMpa(value: number, unit: "SI" | "US"): number {
  return unit === "SI" ? value : value * MPA_PER_KSI;
}
export function stressFromMpa(valueMpa: number, unit: "SI" | "US"): number {
  return unit === "SI" ? valueMpa : valueMpa / MPA_PER_KSI;
}

export function round(value: number, decimals = 2): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}

export function unitLabels(unit: "SI" | "US") {
  return unit === "SI"
    ? {
        force: "kN",
        moment: "kNm",
        length: "mm",
        stress: "MPa",
        area: "mm\u00B2",
        weldForce: "kN",
      }
    : {
        force: "kips",
        moment: "kip-ft",
        length: "in",
        stress: "ksi",
        area: "in\u00B2",
        weldForce: "kips",
      };
}
