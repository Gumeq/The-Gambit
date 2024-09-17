import { NextResponse } from "next/server";
import crypto from "crypto";
import { pusher } from "@/lib/pusher/pusher";
import { processBetsAfterSpin } from "@/lib/wheel/game-state";
import { getNumberColorName } from "@/utils/roulette/roulette-functions";

// Function to generate a random spin result
function generateRandomSpin() {
  // Generate a truly random integer between 0 and 51
  const spinResult = crypto.randomInt(0, 52);
  return spinResult;
}

// Delay helper function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  try {
    const spinResult = generateRandomSpin();
    const spinResultColor = getNumberColorName(spinResult);

    console.log("Spin result color:", spinResultColor);

    // Trigger the "spin-result" event on Pusher immediately
    await pusher.trigger("wheel-channel", "spin-result", {
      result: spinResult,
    });

    // Wait for 5.2 seconds before processing the bets
    await delay(5200);

    // Process bets placed in the last minute
    await processBetsAfterSpin(spinResultColor);

    // Set the headers to disable caching
    const response = NextResponse.json({
      message: "Spin triggered",
      result: spinResult,
    });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Error during spin:", error);
    return NextResponse.json(
      { message: "Failed to trigger spin", error: error },
      { status: 500 },
    );
  }
}
