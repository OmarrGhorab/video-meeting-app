import hash from "string-hash"; // install this via `npm install string-hash`

// Predefined color palettes similar to Google Meet with softer gradients
const colorPalettes = [
  // Blue palette
  { start: [210, 45, 65], end: [230, 45, 75] },
  // Green palette
  { start: [120, 45, 65], end: [140, 45, 75] },
  // Purple palette
  { start: [270, 45, 65], end: [290, 45, 75] },
  // Orange palette
  { start: [30, 45, 65], end: [50, 45, 75] },
  // Red palette
  { start: [0, 45, 65], end: [20, 45, 75] },
  // Teal palette
  { start: [180, 45, 65], end: [200, 45, 75] },
];

export function generateGradient(userId: string) {
  const base = hash(userId);
  const paletteIndex = base % colorPalettes.length;
  const palette = colorPalettes[paletteIndex];
  
  // Add subtle variations to the colors
  const hueVariation = (base * 7) % 20 - 10; // -10 to +10 variation
  const saturationVariation = (base * 3) % 5 - 2; // -2 to +2 variation
  const lightnessVariation = (base * 5) % 5 - 2; // -2 to +2 variation

  const color1 = `hsl(${palette.start[0] + hueVariation}, ${palette.start[1] + saturationVariation}%, ${palette.start[2] + lightnessVariation}%)`;
  const color2 = `hsl(${palette.end[0] + hueVariation}, ${palette.end[1] + saturationVariation}%, ${palette.end[2] + lightnessVariation}%)`;

  return `linear-gradient(135deg, ${color1}, ${color2})`;
}
