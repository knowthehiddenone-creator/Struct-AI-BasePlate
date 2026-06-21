// Section properties: d = depth (mm), bf = flange width (mm), weight kg/m
// Simplified but representative engineering values for preliminary design.

export interface SectionProps {
  name: string;
  d: number; // mm
  bf: number; // mm
  weight: number; // kg/m
  category: string;
}

export const IS_SECTIONS: SectionProps[] = [
  // ISMB
  { name: "ISMB 100", d: 100, bf: 75, weight: 8.9, category: "ISMB" },
  { name: "ISMB 125", d: 125, bf: 75, weight: 13.0, category: "ISMB" },
  { name: "ISMB 150", d: 150, bf: 80, weight: 17.0, category: "ISMB" },
  { name: "ISMB 175", d: 175, bf: 85, weight: 19.4, category: "ISMB" },
  { name: "ISMB 200", d: 200, bf: 100, weight: 25.4, category: "ISMB" },
  { name: "ISMB 225", d: 225, bf: 110, weight: 31.2, category: "ISMB" },
  { name: "ISMB 250", d: 250, bf: 125, weight: 37.3, category: "ISMB" },
  { name: "ISMB 300", d: 300, bf: 140, weight: 44.2, category: "ISMB" },
  { name: "ISMB 350", d: 350, bf: 140, weight: 52.4, category: "ISMB" },
  { name: "ISMB 400", d: 400, bf: 140, weight: 61.6, category: "ISMB" },
  { name: "ISMB 450", d: 450, bf: 150, weight: 72.4, category: "ISMB" },
  { name: "ISMB 500", d: 500, bf: 180, weight: 86.9, category: "ISMB" },
  { name: "ISMB 550", d: 550, bf: 190, weight: 103.7, category: "ISMB" },
  { name: "ISMB 600", d: 600, bf: 210, weight: 122.6, category: "ISMB" },
  // ISWB
  { name: "ISWB 150", d: 150, bf: 100, weight: 18.1, category: "ISWB" },
  { name: "ISWB 175", d: 175, bf: 125, weight: 23.8, category: "ISWB" },
  { name: "ISWB 200", d: 200, bf: 150, weight: 31.5, category: "ISWB" },
  { name: "ISWB 225", d: 225, bf: 150, weight: 33.9, category: "ISWB" },
  { name: "ISWB 250", d: 250, bf: 150, weight: 37.4, category: "ISWB" },
  { name: "ISWB 300", d: 300, bf: 150, weight: 44.1, category: "ISWB" },
  { name: "ISWB 350", d: 350, bf: 150, weight: 52.0, category: "ISWB" },
  { name: "ISWB 400", d: 400, bf: 150, weight: 56.9, category: "ISWB" },
  { name: "ISWB 450", d: 450, bf: 200, weight: 79.4, category: "ISWB" },
  { name: "ISWB 500", d: 500, bf: 200, weight: 95.2, category: "ISWB" },
  { name: "ISWB 550", d: 550, bf: 200, weight: 103.7, category: "ISWB" },
  { name: "ISWB 600", d: 600, bf: 250, weight: 133.7, category: "ISWB" },
  // ISHB (columns)
  { name: "ISHB 150", d: 150, bf: 150, weight: 36.9, category: "ISHB" },
  { name: "ISHB 200", d: 200, bf: 200, weight: 49.9, category: "ISHB" },
  { name: "ISHB 225", d: 225, bf: 225, weight: 65.3, category: "ISHB" },
  { name: "ISHB 250", d: 250, bf: 250, weight: 73.0, category: "ISHB" },
  { name: "ISHB 300", d: 300, bf: 250, weight: 92.5, category: "ISHB" },
  { name: "ISHB 350", d: 350, bf: 250, weight: 103.5, category: "ISHB" },
  { name: "ISHB 400", d: 400, bf: 250, weight: 129.6, category: "ISHB" },
  { name: "ISHB 450", d: 450, bf: 250, weight: 155.5, category: "ISHB" },
  // ISMC (channels)
  { name: "ISMC 75", d: 75, bf: 40, weight: 6.8, category: "ISMC" },
  { name: "ISMC 100", d: 100, bf: 50, weight: 9.6, category: "ISMC" },
  { name: "ISMC 125", d: 125, bf: 65, weight: 13.1, category: "ISMC" },
  { name: "ISMC 150", d: 150, bf: 75, weight: 16.4, category: "ISMC" },
  { name: "ISMC 175", d: 175, bf: 75, weight: 19.0, category: "ISMC" },
  { name: "ISMC 200", d: 200, bf: 75, weight: 22.3, category: "ISMC" },
  { name: "ISMC 225", d: 225, bf: 80, weight: 25.9, category: "ISMC" },
  { name: "ISMC 250", d: 250, bf: 80, weight: 30.4, category: "ISMC" },
  { name: "ISMC 300", d: 300, bf: 90, weight: 36.3, category: "ISMC" },
  { name: "ISMC 350", d: 350, bf: 100, weight: 42.1, category: "ISMC" },
  { name: "ISMC 400", d: 400, bf: 100, weight: 49.4, category: "ISMC" },
  // SHS
  { name: "SHS 50x50x4", d: 50, bf: 50, weight: 5.4, category: "SHS" },
  { name: "SHS 75x75x4", d: 75, bf: 75, weight: 8.4, category: "SHS" },
  { name: "SHS 100x100x5", d: 100, bf: 100, weight: 14.4, category: "SHS" },
  { name: "SHS 125x125x6", d: 125, bf: 125, weight: 21.5, category: "SHS" },
  { name: "SHS 150x150x6", d: 150, bf: 150, weight: 26.1, category: "SHS" },
  { name: "SHS 200x200x8", d: 200, bf: 200, weight: 46.4, category: "SHS" },
  { name: "SHS 250x250x10", d: 250, bf: 250, weight: 72.3, category: "SHS" },
  // RHS
  { name: "RHS 100x50x4", d: 100, bf: 50, weight: 8.6, category: "RHS" },
  { name: "RHS 150x75x5", d: 150, bf: 75, weight: 16.0, category: "RHS" },
  { name: "RHS 200x100x6", d: 200, bf: 100, weight: 26.4, category: "RHS" },
  { name: "RHS 250x150x8", d: 250, bf: 150, weight: 46.8, category: "RHS" },
  // CHS
  { name: "CHS 48.3x4", d: 48.3, bf: 48.3, weight: 4.3, category: "CHS" },
  { name: "CHS 60.3x4", d: 60.3, bf: 60.3, weight: 5.5, category: "CHS" },
  { name: "CHS 76.1x5", d: 76.1, bf: 76.1, weight: 8.7, category: "CHS" },
  { name: "CHS 88.9x5", d: 88.9, bf: 88.9, weight: 10.3, category: "CHS" },
  { name: "CHS 114.3x6", d: 114.3, bf: 114.3, weight: 15.9, category: "CHS" },
  { name: "CHS 139.7x6", d: 139.7, bf: 139.7, weight: 19.6, category: "CHS" },
  { name: "CHS 168.3x6", d: 168.3, bf: 168.3, weight: 23.8, category: "CHS" },
  { name: "CHS 219.1x8", d: 219.1, bf: 219.1, weight: 41.6, category: "CHS" },
  { name: "Custom Built-up", d: 0, bf: 0, weight: 0, category: "Custom" },
];

// AISC dims in inches, converted display; weight in lb/ft
export const AISC_SECTIONS: SectionProps[] = [
  { name: "W4x13", d: 4.16, bf: 4.06, weight: 13, category: "W" },
  { name: "W6x15", d: 5.99, bf: 5.99, weight: 15, category: "W" },
  { name: "W6x25", d: 6.38, bf: 6.08, weight: 25, category: "W" },
  { name: "W8x31", d: 8.0, bf: 8.0, weight: 31, category: "W" },
  { name: "W8x48", d: 8.5, bf: 8.11, weight: 48, category: "W" },
  { name: "W10x33", d: 9.73, bf: 7.96, weight: 33, category: "W" },
  { name: "W10x49", d: 10.0, bf: 10.0, weight: 49, category: "W" },
  { name: "W10x68", d: 10.4, bf: 10.13, weight: 68, category: "W" },
  { name: "W12x53", d: 12.06, bf: 9.99, weight: 53, category: "W" },
  { name: "W12x96", d: 12.7, bf: 12.16, weight: 96, category: "W" },
  { name: "W14x68", d: 14.04, bf: 10.04, weight: 68, category: "W" },
  { name: "W14x120", d: 14.48, bf: 14.67, weight: 120, category: "W" },
  { name: "W16x77", d: 16.52, bf: 10.29, weight: 77, category: "W" },
  { name: "W18x97", d: 18.59, bf: 11.15, weight: 97, category: "W" },
  { name: "W21x111", d: 21.51, bf: 12.34, weight: 111, category: "W" },
  { name: "W24x131", d: 24.48, bf: 12.97, weight: 131, category: "W" },
  { name: "W27x146", d: 27.38, bf: 13.97, weight: 146, category: "W" },
  { name: "W30x173", d: 30.44, bf: 14.98, weight: 173, category: "W" },
  { name: "W33x201", d: 33.68, bf: 15.75, weight: 201, category: "W" },
  { name: "W36x231", d: 36.74, bf: 16.47, weight: 231, category: "W" },
  { name: "W40x264", d: 39.7, bf: 15.8, weight: 264, category: "W" },
  { name: "W44x230", d: 42.9, bf: 11.2, weight: 230, category: "W" },
  // HSS square/rect
  { name: "HSS 2x2x1/4", d: 2, bf: 2, weight: 5.4, category: "HSS" },
  { name: "HSS 4x4x1/4", d: 4, bf: 4, weight: 11.97, category: "HSS" },
  { name: "HSS 6x6x3/8", d: 6, bf: 6, weight: 26.4, category: "HSS" },
  { name: "HSS 8x8x1/2", d: 8, bf: 8, weight: 47.9, category: "HSS" },
  { name: "HSS 10x10x1/2", d: 10, bf: 10, weight: 60.9, category: "HSS" },
  { name: "HSS 12x12x1/2", d: 12, bf: 12, weight: 73.9, category: "HSS" },
  { name: "HSS 4x2x1/4", d: 4, bf: 2, weight: 8.4, category: "HSS" },
  { name: "HSS 6x4x3/8", d: 6, bf: 4, weight: 19.2, category: "HSS" },
  { name: "HSS 8x6x3/8", d: 8, bf: 6, weight: 23.3, category: "HSS" },
  { name: "HSS 10x8x1/2", d: 10, bf: 8, weight: 54.5, category: "HSS" },
  // Pipe
  { name: "Pipe 2 STD", d: 2.375, bf: 2.375, weight: 3.65, category: "Pipe" },
  { name: "Pipe 4 STD", d: 4.5, bf: 4.5, weight: 10.79, category: "Pipe" },
  { name: "Pipe 6 STD", d: 6.625, bf: 6.625, weight: 18.97, category: "Pipe" },
  { name: "Pipe 8 STD", d: 8.625, bf: 8.625, weight: 28.55, category: "Pipe" },
  { name: "Pipe 10 STD", d: 10.75, bf: 10.75, weight: 40.48, category: "Pipe" },
  { name: "Pipe 12 STD", d: 12.75, bf: 12.75, weight: 49.56, category: "Pipe" },
  { name: "Custom Built-up", d: 0, bf: 0, weight: 0, category: "Custom" },
];

export interface SteelGrade {
  label: string;
  fy: number; // MPa
  fu: number; // MPa
}

export const IS_STEEL_GRADES: SteelGrade[] = [
  { label: "E250 (Fe410)", fy: 250, fu: 410 },
  { label: "E300 (Fe440)", fy: 300, fu: 440 },
  { label: "E350 (Fe490)", fy: 350, fu: 490 },
  { label: "E410 (Fe540)", fy: 410, fu: 540 },
  { label: "E450 (Fe570)", fy: 450, fu: 570 },
];

export const AISC_STEEL_GRADES: SteelGrade[] = [
  { label: "A36", fy: 248, fu: 400 }, // MPa equivalent of 36/58 ksi
  { label: "A572 Gr50", fy: 345, fu: 448 },
  { label: "A992", fy: 345, fu: 448 },
  { label: "A500 Gr B", fy: 317, fu: 400 },
  { label: "A500 Gr C", fy: 345, fu: 427 },
];

export interface ConcreteGrade {
  label: string;
  fck: number; // MPa
}

export const IS_CONCRETE_GRADES: ConcreteGrade[] = [
  { label: "M20", fck: 20 },
  { label: "M25", fck: 25 },
  { label: "M30", fck: 30 },
  { label: "M35", fck: 35 },
  { label: "M40", fck: 40 },
];

export const US_CONCRETE_GRADES: ConcreteGrade[] = [
  { label: "f'c 3000 psi", fck: 20.7 },
  { label: "f'c 4000 psi", fck: 27.6 },
  { label: "f'c 5000 psi", fck: 34.5 },
  { label: "f'c 6000 psi", fck: 41.4 },
];

export function sectionsForCode(code: string): SectionProps[] {
  return code === "IS800" ? IS_SECTIONS : AISC_SECTIONS;
}

export function steelGradesForCode(code: string): SteelGrade[] {
  return code === "IS800" ? IS_STEEL_GRADES : AISC_STEEL_GRADES;
}

export function concreteGradesForCode(code: string): ConcreteGrade[] {
  return code === "IS800" ? IS_CONCRETE_GRADES : US_CONCRETE_GRADES;
}
