import {
  getLevelAndProgress,
  getLevelColor,
  hexToRgba,
} from "@/utils/constants";
import React from "react";

// Assuming getLevelAndProgress, getLevelColor, and hexToRgba are utility functions.

interface LevelBadgeProps {
  exp: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ exp }) => {
  const { level } = getLevelAndProgress(exp);
  const levelColor = getLevelColor(level);
  const backgroundColorWithOpacity = hexToRgba(levelColor, 0.2);

  return (
    <div
      className="items flex h-full items-center rounded-lg px-4 py-1 text-center font-semibold"
      style={{
        borderColor: levelColor,
        backgroundColor: backgroundColorWithOpacity,
      }}
    >
      <p>{level} LVL</p>
    </div>
  );
};

export default LevelBadge;
