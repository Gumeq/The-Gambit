"use client";

import React, { useState, useEffect } from "react";
import BetWindow from "@/components/bet-window";
import BetTypeButtons from "@/components/bet-type-buttons";
import { updateUserBalance } from "@/utils/firebase/user-data";
import { useAuth } from "@/components/providers/auth-provider";
import Pusher from "pusher-js";
import RouletteWheel from "@/components/roulette-wheel";
import {
  addBet,
  fetchInitialSpinID,
  listenToSpinData,
} from "@/lib/wheel/game-state";

const Page = () => {
  const [betAmount, setBetAmount] = useState(0);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [spinStartTime, setSpinStartTime] = useState<number | null>(null);
  const spinDuration = 5000; // Example spin duration of 5 seconds
  const [nextSpin, setNextSpin] = useState<number | null>(null);

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

  useEffect(() => {
    // Set up the real-time listener for subsequent spin updates
    const unsubscribe = listenToSpinData((nextSpinId) => {
      setNextSpin(nextSpinId); // Set the next spin ID when received from real-time updates
      console.log("Real-time nextSpinId:", nextSpinId);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Function to handle bet type selection and temporarily store the bet
  const handleBetTypeSelection = async (color: string) => {
    if (user && balance) {
      if (betAmount > 0 && betAmount <= balance && nextSpin) {
        // Temporarily store the bet in local state instead of sending it directly to Firebase
        addBet(user.uid, betAmount, color, nextSpin);
        // Optionally deduct the bet amount visually before actually processing it
        updateUserBalance(user.uid, Number(balance) - betAmount);
      } else {
        console.log("Insufficient balance or invalid bet amount.");
      }
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-16">
      <div className="grid w-full grid-cols-3 gap-16">
        <div className="">
          <h2 className="text-lg font-semibold text-foreground">
            PREVIOUS ROLLS
          </h2>
          <div className="my-2 h-[1px] w-full bg-foreground/10"></div>
          <BetWindow betAmount={betAmount} setBetAmount={setBetAmount} />
        </div>
        <div className="flex items-center justify-center">
          <RouletteWheel
            targetNumber={spinResult}
            spinStartTime={spinStartTime ?? Date.now()}
            spinDuration={spinDuration}
          />
        </div>

        <div className="">
          <h2 className="text-lg font-semibold text-foreground">LAST 100</h2>
          <div className="my-2 h-[1px] w-full bg-foreground/10"></div>
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
