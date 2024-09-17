"use client";

// page.tsx
import React, { useState, useEffect } from "react";
import BetWindow from "@/components/bet-window";
import BetTypeButtons from "@/components/bet-type-buttons";
import { updateUserBalance } from "@/utils/firebase/user-data";
import { useAuth } from "@/components/providers/auth-provider";
import Pusher from "pusher-js";
import RouletteWheel from "@/components/roulette-wheel";
import { addBet } from "@/lib/wheel/game-state";

const Page = () => {
  const [betAmount, setBetAmount] = useState(0);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [spinStartTime, setSpinStartTime] = useState<number | null>(null);
  const spinDuration = 5000; // Example spin duration of 5 seconds

  const { user, balance } = useAuth();

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the "wheel-channel"
    const channel = pusher.subscribe("wheel-channel");

    // Listen for the "spin-result" event and update state
    channel.bind("spin-result", (data: { result: number }) => {
      setSpinResult(data.result); // Update the spin result
      setSpinStartTime(Date.now()); // Record the spin start time
    });

    // Cleanup on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Function to handle bet type selection and temporarily store the bet
  const handleBetTypeSelection = async (color: string) => {
    if (user && balance) {
      if (betAmount > 0 && betAmount <= balance) {
        // Temporarily store the bet in local state instead of sending it directly to Firebase
        addBet(user.uid, betAmount, color);
        // Optionally deduct the bet amount visually before actually processing it
        updateUserBalance(user.uid, Number(balance) - betAmount);
      } else {
        console.log("Insufficient balance or invalid bet amount.");
      }
    }
  };

  return (
    <div className="mx-auto flex w-screen max-w-7xl flex-col items-center gap-16">
      <div className="grid w-full grid-cols-3 gap-16">
        <div className="">
          <h2 className="text-lg font-semibold text-foreground">
            PREVIOUS ROLLS
          </h2>
          <div className="my-2 h-[1px] w-full bg-foreground/10"></div>
          <BetWindow betAmount={betAmount} setBetAmount={setBetAmount} />
        </div>
        <RouletteWheel
          targetNumber={spinResult}
          spinStartTime={spinStartTime ?? Date.now()}
          spinDuration={spinDuration}
        />
        <div className="">
          <h2 className="text-lg font-semibold text-foreground">LAST 100</h2>
          <div className="my-2 h-[1px] w-full bg-foreground/10"></div>
          {/* <div className="flex flex-row justify-between">
            <div className="flex h-14 w-20 items-center justify-center rounded-md border">
              48
            </div>
            <div className="flex h-14 w-20 items-center justify-center rounded-md border">
              30
            </div>
            <div className="flex h-14 w-20 items-center justify-center rounded-md border">
              21
            </div>
            <div className="flex h-14 w-20 items-center justify-center rounded-md border">
              1
            </div>
          </div> */}
        </div>
      </div>

      <BetTypeButtons
        betAmount={betAmount}
        onBetSelect={handleBetTypeSelection}
      />
    </div>
  );
};

export default Page;
