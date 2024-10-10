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

const LevelBadgeSmall: React.FC<LevelBadgeProps> = ({ exp }) => {
  const { level } = getLevelAndProgress(exp);
  const levelColor = getLevelColor(level);
  const backgroundColorWithOpacity = hexToRgba(levelColor, 0.2);

  return (
    <div
      className="items flex h-full items-center rounded-sm px-2 py-1 text-center text-xs"
      style={{
        borderColor: levelColor,
        backgroundColor: backgroundColorWithOpacity,
      }}
    >
      <p>{level}</p>
    </div>
  );
};

export default LevelBadgeSmall;
