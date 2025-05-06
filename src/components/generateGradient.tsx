import hash from "string-hash";

const colorPalettes = [
  // Blue: #76A6EA to #A0C3FF
  { start: [214, 73, 69], end: [217, 100, 81] },
  // Green: #7BCFA8 to #98D9B2
  { start: [152, 47, 65], end: [143, 46, 72] },
  // Purple: #B399D4 to #C5A8E0
  { start: [265, 40, 71], end: [268, 44, 77] },
  // Orange: #F6A187 to #FFBE9D
  { start: [14, 85, 76], end: [21, 100, 80] },
  // Red: #E67D8F to #F28B9C
  { start: [349, 67, 70], end: [350, 77, 75] },
  // Teal: #6FC2D0 to #8CD5DF
  { start: [189, 50, 63], end: [189, 59, 72] },
];

export function generateGradient(userId: string) {
  const base = hash(userId);
  const paletteIndex = base % colorPalettes.length;
  const palette = colorPalettes[paletteIndex];
  
  const color1 = `hsl(${palette.start[0]}, ${palette.start[1]}%, ${palette.start[2]}%)`;
  const color2 = `hsl(${palette.end[0]}, ${palette.end[1]}%, ${palette.end[2]}%)`;

  return `linear-gradient(45deg, ${color1}, ${color2})`;
}