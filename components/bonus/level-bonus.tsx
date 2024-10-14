"use client";

import React, { useState, useEffect } from "react";
import {
  giveBonusToUser,
  levelBonusesToClaim,
} from "@/utils/firebase/user-data";
import { useAuth } from "../providers/auth-provider";
import { getLevelAndProgress } from "@/utils/constants";

const LevelBonus: React.FC = () => {
  const { userData } = useAuth(); // Get user data from your context
  const [levelBonuses, setLevelBonuses] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0); // Add a state for the progress bar

  useEffect(() => {
    if (userData) {
      const { level, progressPercent } = getLevelAndProgress(userData.exp);
      setCurrentLevel(level);
      setProgress(progressPercent);
      checkBonusLevels(userData.id);
    }
  }, [userData]);

  const checkBonusLevels = async (userId: string): Promise<void> => {
    try {
      const levelBonuses = await levelBonusesToClaim(userId);
      console.log(levelBonuses);
      setLevelBonuses(levelBonuses);
    } catch (error) {
      console.error("Error checking daily bonus eligibility:", error);
    }
  };

  const claimLevelBonuses = async (): Promise<void> => {
    if (!userData) return;
    await giveBonusToUser(
      userData.id,
      1000 * levelBonuses,
      "level",
      currentLevel,
    );
    await checkBonusLevels(userData.id);
  };

  return (
    <div className="relative flex h-64 w-full flex-row items-center gap-4 rounded-t-lg bg-background p-4">
      <div className="relative flex aspect-[2/1] h-full items-center justify-center rounded-lg bg-foreground/5 text-4xl font-bold text-foreground/50">
        Level
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-row justify-between gap-2">
          <h3 className="text-xl font-bold">Level Bonus - 1.000 Chips / LVL</h3>
          <p className="text-sm font-semibold text-foreground/50">
            {(100 - progress).toFixed(2)} % to next LVL
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            style={{ width: `${100 - progress}%` }} // Adjust the height based on progress
            className="h-full bg-primary transition-all duration-300 ease-in-out"
          />
        </div>
        <h3 className="font-medium text-foreground/80">
          {levelBonuses * 1000} Chips
        </h3>
      </div>
      <button
        onClick={claimLevelBonuses}
        disabled={levelBonuses <= 0} // Disable the button if not eligible
        className={`absolute bottom-4 right-4 rounded px-16 py-2 transition-all duration-200 ${levelBonuses > 0 ? "cursor-pointer bg-primary/80 hover:scale-110" : "cursor-not-allowed bg-foreground/10"}`}
      >
        {levelBonuses > 0 ? "Claim" : "Claim"}
      </button>
    </div>
  );
};

export default LevelBonus;
