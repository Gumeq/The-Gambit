"use client";

import React, { useState, useEffect } from "react";
import {
  giveBonusToUser,
  isEligibleForDailyBonus,
} from "@/utils/firebase/user-data";
import { useAuth } from "../providers/auth-provider";

const DailyBonus: React.FC = () => {
  const { userData } = useAuth(); // Get user data from your context
  const [dailyEligible, setDailyEligible] = useState<boolean>(false);
  const [dailyTimer, setDailyTimer] = useState<string>("");
  const [progress, setProgress] = useState<number>(0); // Add a state for the progress bar

  useEffect(() => {
    if (userData) {
      checkDailyEligibility(userData.id);
    }
  }, [userData]);

  const checkDailyEligibility = async (userId: string): Promise<void> => {
    try {
      const dailyEligible = await isEligibleForDailyBonus(userId);
      setDailyEligible(dailyEligible);

      if (!dailyEligible && userData && userData.lastDailyBonusClaimed) {
        // If not eligible, set the timer for daily bonus using data from userData
        const lastDaily = userData.lastDailyBonusClaimed.toDate();
        startDailyTimer(lastDaily, 24 * 60 * 60 * 1000);
      }
    } catch (error) {
      console.error("Error checking daily bonus eligibility:", error);
    }
  };

  const startDailyTimer = (lastClaimedTime: Date, duration: number) => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDiff = lastClaimedTime.getTime() + duration - now.getTime();

      if (timeDiff <= 0) {
        clearInterval(intervalId);
        setDailyEligible(true);
        setProgress(100); // Full bar when eligible
      } else {
        const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesLeft = Math.floor(
          (timeDiff % (1000 * 60 * 60)) / (1000 * 60),
        );
        const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setDailyTimer(`${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);

        // Calculate the percentage of time left
        const percentageLeft = (timeDiff / duration) * 100;
        setProgress(percentageLeft);
      }
    }, 1000);
  };

  const claimDailyBonus = async (): Promise<void> => {
    if (!userData) return;
    await giveBonusToUser(userData.id, 1000, "daily");
    await checkDailyEligibility(userData.id);
  };

  return (
    <div className="relative flex h-64 w-full flex-row items-center gap-4 rounded-t-lg bg-background p-4">
      <div className="relative flex aspect-[2/1] h-full items-center justify-center rounded-lg bg-foreground/5 text-4xl font-bold text-foreground/50">
        DAILY
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-row justify-between gap-2">
          <h3 className="text-xl font-bold">Daily Bonus - 1.000 Free Chips</h3>
          <p className="text-sm font-semibold text-foreground/50">
            {dailyTimer}
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            style={{ width: `${100 - progress}%` }} // Adjust the height based on progress
            className="h-full bg-primary transition-all duration-300 ease-in-out"
          />
        </div>
        <h3 className="font-medium text-foreground/80">1.000 Chips</h3>
      </div>
      <button
        onClick={claimDailyBonus}
        disabled={!dailyEligible} // Disable the button if not eligible
        className={`absolute bottom-4 right-4 rounded px-16 py-2 transition-all duration-200 ${dailyEligible ? "cursor-pointer bg-primary/80 hover:scale-110" : "cursor-not-allowed bg-foreground/10"}`}
      >
        {dailyEligible ? "Claim" : "Claim"}
      </button>
    </div>
  );
};

export default DailyBonus;
