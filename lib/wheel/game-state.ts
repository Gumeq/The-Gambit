import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase"; // Firebase config
import { incrementUserBalance } from "@/utils/firebase/user-data";
import { Color } from "@/utils/firebase/wheel-bets";

export type Bet = {
  userId: string;
  betAmount: number;
  betColor: string;
};

// Add a bet for a user
export async function addBet(
  userId: string,
  betAmount: number,
  betType: string,
) {
  try {
    const betsCollectionRef = collection(db, "wheel_bets");
    const newBet = {
      userId,
      betAmount,
      betType,
      timestamp: serverTimestamp(), // Firestore server timestamp
    };

    await addDoc(betsCollectionRef, newBet);
    console.log(
      `Bet added: UserId: ${userId}, BetAmount: ${betAmount}, BetType: ${betType}, Timestamp: ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error("Error adding bet:", error);
  }
}

// Retrieve bets placed within the last minute
export async function getRecentBets(winningColor: Color) {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000); // Get timestamp from one minute ago
    console.log(`Fetching bets placed after: ${oneMinuteAgo.toISOString()}`);

    const betsCollectionRef = collection(db, "wheel_bets");
    const q = query(
      betsCollectionRef,
      where("timestamp", ">", oneMinuteAgo),
      where("betType", "==", winningColor), // Only get bets placed after one minute ago
    );

    const betsSnapshot = await getDocs(q);
    const bets: DocumentData[] = [];

    betsSnapshot.forEach((doc) => {
      bets.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Fetched ${bets.length} bets placed in the last minute.`);
    return bets;
  } catch (error) {
    console.error("Error fetching recent bets:", error);
    return [];
  }
}

// Function to process bets after the spin
export async function processBetsAfterSpin(spinResult: Color) {
  try {
    console.log(`Processing bets for spin result: ${spinResult}`);

    const bets = await getRecentBets(spinResult); // Get bets placed in the last minute

    if (bets.length === 0) {
      console.log("No bets to process.");
      return;
    }

    for (const bet of bets) {
      const { userId, betAmount, betType } = bet;
      let winnings = 0;

      console.log(
        `Processing bet: UserId: ${userId}, BetAmount: ${betAmount}, BetType: ${betType}`,
      );

      if (betType === spinResult) {
        winnings = betAmount * getPayoutMultiplier(betType);
        console.log(`User ${userId} won: ${winnings}. Updating balance...`);
        await incrementUserBalance(userId, winnings);
      } else {
        console.log(`User ${userId} did not win. No balance update.`);
      }

      // Clear bet after processing
      const betDocRef = doc(db, "bets", bet.id);
      await deleteDoc(betDocRef);
      console.log(`Bet cleared for UserId: ${userId}, BetId: ${bet.id}`);
    }
  } catch (error) {
    console.error("Error processing bets after spin:", error);
  }
}

// Function to get the payout multiplier
const getPayoutMultiplier = (betType: string) => {
  const multiplier = (() => {
    switch (betType) {
      case "black":
        return 2;
      case "red":
        return 3;
      case "blue":
        return 5;
      case "gold":
        return 50;
      default:
        return 1;
    }
  })();
  console.log(`Payout multiplier for BetType: ${betType} is ${multiplier}`);
  return multiplier;
};
