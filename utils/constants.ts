export const EXP_MULTIPLIERS = {
  WHEEL: 0.25,
};

export const BASE_EXP = 10000; // First level requires 10,000 EXP
export const EXP_MULTIPLIER = 1.5; // Multiplier for level scaling

/**
 * Function to calculate the required experience for a specific level.
 * @param level - The current level of the user.
 * @returns Required experience to reach the next level.
 */
export const getExpForLevel = (level: number): number => {
  if (level === 1) return BASE_EXP; // Level 1 requires 10,000 EXP
  return BASE_EXP * Math.pow(EXP_MULTIPLIER, level - 1); // Scale for level 2 and beyond
};

/**
 * Function to calculate the user's current level and progress percentage to the next level.
 * @param currentXP - The user's current experience points.
 * @returns An object containing the user's level and progress percentage to the next level.
 */
export const getLevelAndProgress = (currentXP: number) => {
  let level = 1;
  let expForNextLevel = getExpForLevel(level);

  // Determine the level based on the XP
  while (currentXP >= expForNextLevel) {
    level += 1;
    currentXP -= expForNextLevel; // Deduct exp for each level
    expForNextLevel = getExpForLevel(level); // Calculate required exp for the next level
  }

  // Calculate the progress percentage to the next level
  const progressPercent = (currentXP / expForNextLevel) * 100;

  return {
    level,
    progressPercent,
  };
};

export function getLevelColor(level: number) {
  // Define the array of colors for the 15 levels
  const colors = [
    "#D4EFDF", // Level 1
    "#A9DFBF", // Level 2
    "#7DCEA0", // Level 3
    "#52BE80", // Level 4
    "#27AE60", // Level 5
    "#F7DC6F", // Level 6
    "#F4D03F", // Level 7
    "#F39C12", // Level 8
    "#E67E22", // Level 9
    "#D35400", // Level 10
    "#F1948A", // Level 11
    "#EC7063", // Level 12
    "#E74C3C", // Level 13
    "#C0392B", // Level 14
    "#922B21", // Level 15
  ];

  // Ensure the level is within the bounds of the array
  if (level < 1 || level > 15) {
    return "Invalid level";
  }

  // Return the corresponding color
  return colors[level - 1];
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
