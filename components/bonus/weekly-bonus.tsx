"use client";

import React, { useState, useEffect } from "react";
import {
  giveBonusToUser,
  isEligibleForWeeklyBonus,
} from "@/utils/firebase/user-data";
import { useAuth } from "../providers/auth-provider";

const WeeklyBonus: React.FC = () => {
  const { userData } = useAuth(); // Get user data from your context
  const [weeklyEligible, setWeeklyEligible] = useState<boolean>(false);
  const [weeklyTimer, setWeeklyTimer] = useState<string>("");
  const [progress, setProgress] = useState<number>(0); // Add a state for the progress bar

  useEffect(() => {
    if (userData) {
      checkWeeklyEligibility(userData.id);
    }
  }, [userData]);

  const checkWeeklyEligibility = async (userId: string): Promise<void> => {
    try {
      const weeklyEligible = await isEligibleForWeeklyBonus(userId);
      setWeeklyEligible(weeklyEligible);

      if (!weeklyEligible && userData && userData.lastWeeklyBonusClaimed) {
        // If not eligible, set the timer for weekly bonus using data from userData
        const lastWeekly = userData.lastWeeklyBonusClaimed.toDate();
        startWeeklyTimer(lastWeekly, 7 * 24 * 60 * 60 * 1000);
      }
    } catch (error) {
      console.error("Error checking weekly bonus eligibility:", error);
    }
  };

  const startWeeklyTimer = (lastClaimedTime: Date, duration: number) => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDiff = lastClaimedTime.getTime() + duration - now.getTime();

      if (timeDiff <= 0) {
        clearInterval(intervalId);
        setWeeklyEligible(true);
        setProgress(100); // Full bar when eligible
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setWeeklyTimer(`${hours}h ${minutes}m ${seconds}s`);

        const percentageLeft = (timeDiff / duration) * 100;
        setProgress(percentageLeft);
      }
    }, 1000);
  };

  const claimWeeklyBonus = async (): Promise<void> => {
    if (!userData) return;
    await giveBonusToUser(userData.id, 10000, "weekly");
    await checkWeeklyEligibility(userData.id);
  };

  return (
    <div className="relative flex h-64 w-full flex-row items-center gap-4 rounded-t-lg bg-background p-4">
      <div className="relative flex aspect-[2/1] h-full items-center justify-center rounded-lg bg-foreground/5 text-4xl font-bold text-foreground/50">
        WEEKLY
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-row justify-between gap-2">
          <h3 className="text-xl font-bold">
            Weekly Bonus - 10.000 Free Chips
          </h3>
          <p className="text-sm font-semibold text-foreground/50">
            {weeklyTimer}
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            style={{ width: `${100 - progress}%` }} // Adjust the height based on progress
            className="h-full bg-primary transition-all duration-300 ease-in-out"
          />
        </div>
        <h3 className="font-medium text-foreground/80">10.000 Chips</h3>
      </div>
      <button
        onClick={claimWeeklyBonus}
        disabled={!weeklyEligible} // Disable the button if not eligible
        className={`absolute bottom-4 right-4 rounded px-16 py-2 transition-all duration-200 ${weeklyEligible ? "cursor-pointer bg-primary/80 hover:scale-110" : "cursor-not-allowed bg-foreground/10"}`}
      >
        {weeklyEligible ? "Claim" : "Claim"}
      </button>
    </div>
  );
};

export default WeeklyBonus;
