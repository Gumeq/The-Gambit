import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher/pusher";
import { processBetsAfterSpin, saveSpin } from "@/lib/wheel/game-state";
import { getNumberColorName } from "@/utils/roulette/roulette-functions";
import { randomInt } from "crypto";

// Disable caching for this route
export const dynamic = "force-dynamic";

// Function to generate a random spin result using crypto.randomInt()
function generateRandomSpin() {
  // Generate a random integer between 0 and 51 using crypto.randomInt()
  const spinResult = randomInt(0, 52); // The upper bound is exclusive
  console.log("Generated spin result:", spinResult);
  return spinResult;
}

// Delay helper function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  try {
    // Generate the random spin result
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
    await saveSpin(spinResultColor);

    // Create the response and disable caching
    const response = NextResponse.json({
      message: "Spin triggered",
      result: spinResult,
    });
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    );
    return response;
  } catch (error) {
    console.error("Error during spin:", error);
    return NextResponse.json(
      { message: "Failed to trigger spin", error: error },
      { status: 500 },
    );
  }
}
