import { Color } from "@/utils/firebase/wheel-bets";
import React from "react";
import BetButton from "./wheel-bet-button";

const BetTypeButtons = ({
  betAmount,
  onBetSelect,
}: {
  betAmount: number;
  onBetSelect: (type: Color) => void;
}) => {
  return (
    <div className="grid w-full grid-cols-4 gap-4 text-xl font-bold">
      <BetButton
        betType="black"
        multiplier="2x"
        color="[#545454]"
        onBetSelect={onBetSelect}
        disabled={betAmount <= 0} // Disable if betAmount is 0
      />
      <BetButton
        betType="red"
        multiplier="3x"
        color="[#cc3c2f]"
        onBetSelect={onBetSelect}
        disabled={betAmount <= 0}
      />
      <BetButton
        betType="blue"
        multiplier="5x"
        color="[#4c80f1]"
        onBetSelect={onBetSelect}
        disabled={betAmount <= 0}
      />
      <BetButton
        betType="gold"
        multiplier="50x"
        color="[#f4ce3b]"
        onBetSelect={onBetSelect}
        disabled={betAmount <= 0}
      />
    </div>
  );
};

export default BetTypeButtons;
