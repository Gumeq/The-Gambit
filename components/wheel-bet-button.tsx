import { Color } from "@/utils/firebase/wheel-bets";
import React from "react";

interface BetButtonProps {
  betType: Color; // Use the Color type instead of string
  multiplier: string;
  color: string;
  onBetSelect: (betType: Color) => void; // Update the type here to Color
  disabled: boolean;
}

const BetButton: React.FC<BetButtonProps> = ({
  betType,
  multiplier,
  color,
  onBetSelect,
  disabled,
}) => {
  return (
    <button
      className={`flex h-16 w-full items-center justify-center rounded-md border-2 text-xl font-bold disabled:opacity-50`}
      onClick={() => onBetSelect(betType)}
      disabled={disabled}
      style={{ color: color, borderColor: color }} // Use inline styles for dynamic color
    >
      {multiplier}
    </button>
  );
};

export default BetButton;
