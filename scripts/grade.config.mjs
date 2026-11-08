// One gentle, consistent grade so 2 years of phone photos feel like one shoot.
// Tweak these numbers, then run `npm run photos:process -- --preview` to see a before/after
// sheet, and `npm run photos:process` to regenerate every image.
//
// Keep it subtle: bread should look golden, never orange.
export const grade = {
  enabled: true,
  // Warm the white balance: red up, blue down (0.03 = 3%).
  warmth: 0.025,
  // Lift the darkest shadows slightly (0–255 scale) and compress highlights to match.
  shadowLift: 7,
  // Saturation multiplier (1 = unchanged).
  saturation: 1.04,
  // Overall brightness multiplier (1 = unchanged).
  brightness: 1.01,
  // Folders that are graphics, not photos: never graded.
  skipFolders: ["01-brand-logo-graphics"],
};

// Output settings
export const output = {
  widths: [640, 1080, 1600, 2400], // never upscaled past the original
  avif: { quality: 52, effort: 4 },
  webp: { quality: 76, effort: 5 },
};
