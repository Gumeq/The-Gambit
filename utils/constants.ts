export const EXP_MULTIPLIERS = {
  WHEEL: 0.25,
  BJ: 0.5,
};

export const BASE_EXP = 1000; // Each level requires 10,000 EXP

/**
 * Function to calculate the user's current level and progress percentage to the next level.
 * @param currentXP - The user's current experience points.
 * @returns An object containing the user's level and progress percentage to the next level.
 */
export const getLevelAndProgress = (currentXP: number) => {
  // Ensure currentXP is a valid number, default to 0 if it's not
  if (isNaN(currentXP) || currentXP < 0) {
    currentXP = 0;
  }

  const level = Math.floor(currentXP / BASE_EXP); // Calculate the level directly
  const expForNextLevel = BASE_EXP; // Every level requires the same amount of EXP
  const progressPercent = ((currentXP % BASE_EXP) / expForNextLevel) * 100; // Calculate progress to the next level

  console.log("Level:", level + 1); // Log the level, with adjustment for 1-based levels

  return {
    level: level + 1, // Levels start at 1, not 0
    progressPercent,
  };
};

// Helper function to convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

// Helper function to convert RGB to hex
export function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function hexToRgba(hex: string, opacity: number) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Main function to generate level color in hex
export function getLevelColor(level: number) {
  // Use the level to calculate a hue value
  const hue = (level * 30) % 360;
  const saturation = 70; // Fixed saturation
  const lightness = 50; // Fixed lightness

  // Convert HSL to RGB
  const [r, g, b] = hslToRgb(hue, saturation, lightness);

  // Convert RGB to hex and return
  return rgbToHex(r, g, b);
}
// src/constants.ts
export const SUITS = ["hearts", "diamonds", "clubs", "spades"];
export const VALUES = [
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 },
  { name: "J", value: 10 },
  { name: "Q", value: 10 },
  { name: "K", value: 10 },
  { name: "A", value: 11 }, // Ace can also be 1, which will be handled in logic
];

export const createDeck = () => {
  let deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ ...value, suit });
    }
  }
  return deck;
};
