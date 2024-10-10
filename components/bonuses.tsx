"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "./providers/auth-provider";
import {
  giveBonusToUser,
  isEligibleForDailyBonus,
  isEligibleForWeeklyBonus,
} from "@/utils/firebase/user-data";

const Bonuses: React.FC = () => {
  const { userData } = useAuth(); // Get user data from your context
  const [dailyEligible, setDailyEligible] = useState<boolean>(false);
  const [weeklyEligible, setWeeklyEligible] = useState<boolean>(false);
  const [dailyTimer, setDailyTimer] = useState<string>("");
  const [weeklyTimer, setWeeklyTimer] = useState<string>("");

  useEffect(() => {
    if (userData) {
      checkEligibility(userData.id);
    }
  }, [userData]);

  const checkEligibility = async (userId: string): Promise<void> => {
    try {
      const dailyEligible = await isEligibleForDailyBonus(userId);
      const weeklyEligible = await isEligibleForWeeklyBonus(userId);

      setDailyEligible(dailyEligible);
      setWeeklyEligible(weeklyEligible);

      if (!dailyEligible && userData && userData.lastDailyBonusClaimed) {
        // If not eligible, set the timer for daily bonus using data from userData
        const lastDaily = userData.lastDailyBonusClaimed.toDate();
        startTimer("daily", lastDaily, 24 * 60 * 60 * 1000);
      }

      if (!weeklyEligible && userData && userData.lastWeeklyBonusClaimed) {
        // If not eligible, set the timer for weekly bonus using data from userData
        const lastWeekly = userData.lastWeeklyBonusClaimed.toDate();
        startTimer("weekly", lastWeekly, 7 * 24 * 60 * 60 * 1000);
      }
    } catch (error) {
      console.error("Error checking bonus eligibility:", error);
    }
  };

  const startTimer = (
    type: "daily" | "weekly",
    lastClaimedTime: Date,
    duration: number,
  ) => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDiff = lastClaimedTime.getTime() + duration - now.getTime();

      if (timeDiff <= 0) {
        clearInterval(intervalId);
        if (type === "daily") setDailyEligible(true);
        if (type === "weekly") setWeeklyEligible(true);
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        const timeString = `${hours}h ${minutes}m ${seconds}s`;

        if (type === "daily") setDailyTimer(timeString);
        if (type === "weekly") setWeeklyTimer(timeString);
      }
    }, 1000);
  };

  const claimBonus = async (type: "daily" | "weekly"): Promise<void> => {
    if (!userData) return;
    const amount = type === "daily" ? 1000 : 10000;
    await giveBonusToUser(userData.id, amount, type);
    await checkEligibility(userData.id);
  };

  return (
    <div>
      <h2>Bonuses</h2>

      <div>
        <h3>Daily Bonus</h3>
        {dailyEligible ? (
          <button onClick={() => claimBonus("daily")}>
            Claim Daily Bonus (1000)
          </button>
        ) : (
          <p>Next daily bonus in: {dailyTimer}</p>
        )}
      </div>

      <div>
        <h3>Weekly Bonus</h3>
        {weeklyEligible ? (
          <button onClick={() => claimBonus("weekly")}>
            Claim Weekly Bonus (10000)
          </button>
        ) : (
          <p>Next weekly bonus in: {weeklyTimer}</p>
        )}
      </div>
    </div>
  );
};

export default Bonuses;
