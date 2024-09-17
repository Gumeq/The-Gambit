// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import RouletteWheel from "./roulette-wheel";
import { rewardWinners } from "@/utils/firebase/wheel-bets";
import { getNumberColor } from "@/utils/roulette/roulette-functions";
import { useAuth } from "./providers/auth-provider";
import { fetchUserData } from "@/utils/firebase/user-data";

type RouletteProps = {
  userId: string;
};
export default function Roulette({ userId }: RouletteProps) {
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [targetColorName, setTargetColorName] = useState<string | null>(null);
  const [spinStartTime, setSpinStartTime] = useState<number | null>(null);
  const [spinDuration, setSpinDuration] = useState<number>(5000);
  const [countdown, setCountdown] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Using useRef to store timer IDs
  const spinTimeoutId = useRef<number | null>(null);
  const countdownIntervalId = useRef<number | null>(null);

  useEffect(() => {
    const initializeSpin = async () => {
      try {
        const serverResponse = await fetch("/api/spin");
        if (!serverResponse.ok) {
          throw new Error(`Server error: ${serverResponse.status}`);
        }

        const serverData = await serverResponse.json();
        const serverTime = serverResponse.headers.get("Date");
        const clientTime = Date.now();
        const serverTimeMillis = serverTime
          ? new Date(serverTime).getTime()
          : clientTime;

        const timeOffset = serverTimeMillis - clientTime;

        // Adjust spinStartTime based on time offset
        const adjustedSpinStartTime = serverData.spinStartTime - timeOffset;

        setTargetNumber(serverData.targetNumber);
        setSpinStartTime(adjustedSpinStartTime);
        setSpinDuration(serverData.spinDuration);
        setTargetColorName(serverData.targetColorName);

        // Calculate the next spin's start time (assuming spins every 30 seconds)
        const nextSpinStartTime = adjustedSpinStartTime + 30000;

        // Calculate time until next spin
        const currentTime = Date.now();
        let timeUntilNextSpin = nextSpinStartTime - currentTime;

        // If the next spin time is in the past, adjust by adding 30 seconds
        if (timeUntilNextSpin < 0) {
          timeUntilNextSpin += 30000;
        }

        // Set countdown to next spin in seconds
        setCountdown(Math.ceil(timeUntilNextSpin / 1000));

        // Clear existing timers
        if (spinTimeoutId.current) {
          clearTimeout(spinTimeoutId.current);
        }
        if (countdownIntervalId.current) {
          clearInterval(countdownIntervalId.current);
        }

        // Set up countdown interval based on target time
        const targetTime = currentTime + timeUntilNextSpin;

        countdownIntervalId.current = window.setInterval(() => {
          const now = Date.now();
          const remaining = Math.ceil((targetTime - now) / 1000);

          if (remaining >= 0) {
            setCountdown(remaining);
          } else {
            setCountdown(0);
            if (countdownIntervalId.current) {
              clearInterval(countdownIntervalId.current);
            }
          }
        }, 1000);

        // Schedule next spin fetch
        spinTimeoutId.current = window.setTimeout(() => {
          initializeSpin();
        }, timeUntilNextSpin + 200); // Slight delay for synchronization
        await rewardWinners(
          serverData.currentTimeSlot,
          getNumberColor(serverData.targetNumber),
          userId,
        );
      } catch (err: any) {
        console.error("Error fetching spin data:", err);
        setError("Failed to fetch spin data. Please try again later.");
      }
    };

    initializeSpin();

    // Cleanup function to clear timers when component unmounts
    return () => {
      if (spinTimeoutId.current) {
        clearTimeout(spinTimeoutId.current);
      }
      if (countdownIntervalId.current) {
        clearInterval(countdownIntervalId.current);
      }
    };
  }, []);

  return (
    <div className="roulette-container">
      {error && <div className="error-message">{error}</div>}
      {targetNumber !== null && spinStartTime !== null && (
        <RouletteWheel
          targetNumber={targetNumber}
          spinStartTime={spinStartTime}
          spinDuration={spinDuration}
        />
      )}
      {/* Optionally display the target number for debugging */}
      {/* <p>
        Target Number: {targetNumber} color: {targetColorName}
      </p> */}
    </div>
  );
}
