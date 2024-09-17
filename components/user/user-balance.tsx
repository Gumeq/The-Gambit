"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../providers/auth-provider"; // Assuming `balance` is provided by useAuth

export default function UserBalance() {
  const { balance } = useAuth(); // Using real-time balance from useAuth
  const [previousBalance, setPreviousBalance] = useState<number | null>(null);
  const [balanceChangeClass, setBalanceChangeClass] = useState<string>("");

  useEffect(() => {
    // If previous balance exists, check whether the new balance is higher or lower
    if (
      previousBalance !== null &&
      balance !== null &&
      balance !== previousBalance
    ) {
      if (balance > previousBalance) {
        setBalanceChangeClass("text-green-400 scale-105");
      } else if (balance < previousBalance) {
        setBalanceChangeClass("text-red-400 scale-95");
      }

      // Reset the animation class after a delay (e.g., 2 seconds)
      setTimeout(() => {
        setBalanceChangeClass("");
      }, 200);
    }

    // Set the new previous balance to the current balance
    setPreviousBalance(balance);
  }, [balance, previousBalance]);

  return (
    <p
      className={`font-bold transition-all duration-100 ease-in-out ${balanceChangeClass}`}
    >
      {balance !== null ? balance : "0"} USD
    </p>
  );
}
