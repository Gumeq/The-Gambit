"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { getNumberColorHex } from "@/utils/roulette/roulette-functions";

interface RouletteWheelProps {
  targetNumber: number | null;
  spinStartTime: number;
  spinDuration: number;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  targetNumber,
  spinStartTime,
  spinDuration,
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const radius = 200; // Radius of the wheel
  const cx = radius; // Center x-coordinate
  const cy = radius; // Center y-coordinate
  const [pointerColor, setPointerColor] = useState("#ffffff"); // Default pointer color
  const [timeLeft, setTimeLeft] = useState("00:00"); // Timer state
  const [spinning, setSpinning] = useState(false); // State to track if the wheel is spinning

  const numbers = useMemo(() => Array.from({ length: 53 }, (_, i) => i), []);
  const totalNumbers = numbers.length;

  const targetSecond = 5;

  const segments = useMemo(() => {
    return numbers.map((number, i) => {
      const startAngle = (i * 360) / totalNumbers;
      const endAngle = ((i + 1) * 360) / totalNumbers;
      const pathData = describeArc(cx, cy, radius, startAngle, endAngle);
      const fillColor = getNumberColorHex(number);

      return (
        <g key={number}>
          <path
            d={pathData}
            fill={fillColor}
            stroke="hsl(var(--background))"
            strokeWidth={8}
          />
        </g>
      );
    });
  }, [numbers, cx, cy, radius, totalNumbers]);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      let nextTarget = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        targetSecond,
        0,
      );

      // If the target second has already passed in the current minute, move to the next minute
      if (now.getSeconds() >= targetSecond) {
        nextTarget.setMinutes(nextTarget.getMinutes() + 1);
      }

      const timeDiff = nextTarget.getTime() - now.getTime();
      const secondsLeft = Math.floor((timeDiff % 60000) / 1000);
      const millisecondsLeft = Math.floor((timeDiff % 1000) / 10);

      setTimeLeft(`${secondsLeft.toString().padStart(2, "0")}`);
    };

    // Update every 10 milliseconds for smooth countdown
    const intervalId = setInterval(updateTimeLeft, 10);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    if (wheelRef.current && targetNumber !== null) {
      const totalRotation = 360 * 3; // 3 full rotations
      const segmentAngle = 360 / totalNumbers;
      const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
      const targetRotation =
        totalRotation -
        targetNumber * segmentAngle -
        segmentAngle / 2 +
        randomOffset;

      const currentTime = Date.now();
      const elapsedTime = currentTime - spinStartTime;
      const remainingDuration = Math.max(spinDuration - elapsedTime, 0);

      // Reset wheel to default position before spinning
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = `rotate(0deg)`;
      wheelRef.current.getBoundingClientRect(); // Force reflow to ensure the reset takes effect

      // Set spinning state to true before starting the spin
      setSpinning(true);

      // Spin the wheel to the target number
      setTimeout(() => {
        wheelRef.current!.style.transition = `transform ${remainingDuration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
        wheelRef.current!.style.transform = `rotate(${targetRotation}deg)`;
      }, 100); // Delay slightly to ensure reset is applied

      // Change the pointer color after the spin completes
      setTimeout(() => {
        setPointerColor(getNumberColorHex(targetNumber)); // Change pointer color after spin
        setSpinning(false); // Set spinning state to false after the spin completes
      }, remainingDuration + 100); // Wait for the spin duration before updating the pointer color
    }
  }, [targetNumber, spinStartTime, spinDuration, totalNumbers]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {/* Rotating Wheel Container */}
      <div className="relative rotate-90">
        <svg
          ref={wheelRef}
          width={radius * 2}
          height={radius * 2}
          style={{ transformOrigin: "50% 50%" }}
        >
          {segments}
        </svg>
      </div>

      {/* Non-rotating central circle */}
      <svg
        width={radius * 2}
        height={radius * 2}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none", // Prevent interaction with the center
        }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius * 0.95}
          fill="hsl(var(--background))"
        />
        {/* Timer Text in the Center, hidden when spinning */}
        {!spinning && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="96"
            fill="white"
            fontWeight="bold"
          >
            {timeLeft}
          </text>
        )}
      </svg>

      {/* Pointer adjusted to bottom and facing down */}
      <div
        className="absolute"
        style={{
          bottom: 35,
          left: "50%",
          transform: "translate(-50%, 50%) rotate(0deg)",
        }}
      >
        <div
          className="h-0 w-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `20px solid ${pointerColor}`, // Dynamic pointer color
          }}
        ></div>
      </div>
    </div>
  );
};

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    `M ${cx} ${cy}`, // Move to center
    `L ${x1} ${y1}`, // Line to start of arc
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
    "Z", // Close path back to center
  ].join(" ");

  return d;
}

export default RouletteWheel;
