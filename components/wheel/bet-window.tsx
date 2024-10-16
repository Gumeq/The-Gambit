"use client";

import React from "react";
import { useAuth } from "../providers/auth-provider";
import UserBalance from "../user/user-balance";

const BetWindow = ({
  betAmount,
  setBetAmount,
}: {
  betAmount: number;
  setBetAmount: (amount: number) => void;
}) => {
  const { balance } = useAuth();

  // Function to adjust the bet amount
  const handleAmountChange = (increment: number) => {
    setBetAmount(Number(betAmount) + Number(increment));
  };

  const handleHalfBet = () => {
    setBetAmount(Math.floor(betAmount / 2));
  };

  const handleDoubleBet = () => {
    setBetAmount(betAmount * 2);
  };

  const handleMaxBet = () => {
    if (balance) {
      setBetAmount(balance);
    }
  };

  // Function to handle direct input of bet amount
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = parseInt(e.target.value, 10);
    if (!isNaN(newBet)) {
      setBetAmount(newBet);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-md border p-2">
      <div className="flex flex-row items-center justify-center gap-2 rounded-md border p-1 font-bold">
        <img
          src="/assets/images/chip.png"
          className="ml-2 h-4 w-4"
          alt="Chip Icon"
        />
        <UserBalance />
        <div className="h-full w-2"></div>
      </div>
      {/* Input to modify the bet amount directly */}
      <input
        type="number"
        className="w-full rounded-md border p-2"
        value={betAmount}
        onChange={handleInputChange}
        min={0}
        max={balance || 0}
      />
      {/* Buttons to modify the bet */}
      <div className="flex w-full flex-row gap-2">
        <div
          className="flex flex-grow cursor-pointer items-center justify-center rounded-md border px-4 py-2"
          onClick={() => setBetAmount(0)}
        >
          C {/* Reset the bet */}
        </div>
        <div
          className="flex flex-grow cursor-pointer items-center justify-center rounded-md border px-4 py-2"
          onClick={handleHalfBet}
        >
          1/2 {/* Half the current bet */}
        </div>
        <div
          className="flex flex-grow cursor-pointer items-center justify-center rounded-md border px-4 py-2"
          onClick={handleDoubleBet}
        >
          2x {/* Double the current bet */}
        </div>
        <div
          className="flex flex-grow cursor-pointer items-center justify-center rounded-md border px-4 py-2"
          onClick={() => handleAmountChange(10)}
        >
          +10 {/* Increment the bet by 10 */}
        </div>
        <div
          className="flex flex-grow cursor-pointer items-center justify-center rounded-md border px-4 py-2"
          onClick={() => handleAmountChange(100)}
        >
          +100 {/* Increment the bet by 100 */}
        </div>
      </div>

      <div className="flex w-full flex-row gap-2">
        <div
          className="flex flex-grow cursor-pointer items-center justify-center rounded-md border px-4 py-2"
          onClick={() => handleAmountChange(1000)}
        >
          +1K {/* Increment the bet by 1000 */}
        </div>
        <div
          className="flex flex-grow cursor-pointer items-center justify-center rounded-md border px-4 py-2"
          onClick={handleMaxBet}
        >
          MAX {/* Set the bet to the maximum allowable value */}
        </div>
      </div>
    </div>
  );
};

export default BetWindow;
