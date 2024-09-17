import { NextResponse } from "next/server";
import crypto from "crypto";
import { pusher } from "@/lib/pusher/pusher";
import { processBetsAfterSpin } from "@/lib/wheel/game-state";
import { getNumberColorName } from "@/utils/roulette/roulette-functions";

const SECRET_KEY = process.env.SPIN_TRIGGER_SECRET_KEY || "";

// Function to generate a random spin result using the secret key
function generateRandomSpin() {
  const hash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(crypto.randomBytes(16))
    .digest("hex");

  const randomValue = parseInt(hash, 16);
  const spinResult = randomValue % 52; // Get a number between 0 and 52
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

    return NextResponse.json({ message: "Spin triggered", result: spinResult });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to trigger spin", error: error },
      { status: 500 },
    );
  }
}
