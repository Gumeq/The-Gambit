import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase"; // Firebase config
import {
  incrementUserBalance,
  incrementUserExp,
} from "@/utils/firebase/user-data";
import { Color } from "@/utils/firebase/wheel-bets";
import { EXP_MULTIPLIERS } from "@/utils/constants";

export type Bet = {
  userId: string;
  betAmount: number;
  betColor: string;
  spinId: number;
};

// Add a bet for a user
export async function addBet(
  userId: string,
  betAmount: number,
  betType: string,
  spinId: number,
) {
  try {
    const betsCollectionRef = collection(db, "wheel_bets");
    const userRef = doc(db, "users", userId);
    console.log(userRef);
    const newBet = {
      userRef,
      betAmount,
      betType,
      timestamp: serverTimestamp(), // Firestore server timestamp,
      spinId,
    };

    await addDoc(betsCollectionRef, newBet);
    await incrementUserExp(userId, betAmount * EXP_MULTIPLIERS["WHEEL"]);
    console.log(
      `Bet added: UserId: ${userRef}, BetAmount: ${betAmount}, BetType: ${betType}, Timestamp: ${new Date().toISOString()}, spinId: ${spinId}`,
    );
  } catch (error) {
    console.error("Error adding bet:", error);
  }
}

// Retrieve bets placed within the last minute
export async function getRecentBets(winningColor: Color, spinId: number) {
  try {
    const betsCollectionRef = collection(db, "wheel_bets");
    const q = query(
      betsCollectionRef,
      where("spinId", "==", spinId),
      where("betType", "==", winningColor), // Filter by winning color
    );

    const betsSnapshot = await getDocs(q);
    const bets: DocumentData[] = [];

    betsSnapshot.forEach((doc) => {
      const betData = doc.data();
      // Push the bet data along with the user reference (userRef)
      bets.push({ id: doc.id, ...betData });
    });

    return bets;
  } catch (error) {
    console.error("Error fetching recent bets:", error);
    return [];
  }
}

// Function to process bets after the spin
export async function processBetsAfterSpin(spinResult: Color, spinId: number) {
  try {
    console.log(`Processing bets for spin result: ${spinResult}`);

    const bets = await getRecentBets(spinResult, spinId); // Get bets for the winning color

    if (bets.length === 0) {
      console.log("No bets to process.");
      return;
    }

    for (const bet of bets) {
      const { userRef, betAmount, betType } = bet;
      let winnings = 0;

      console.log(
        `Processing bet: UserRef: ${userRef.path}, BetAmount: ${betAmount}, BetType: ${betType}`,
      );

      // Resolve the user reference to get the user data
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        console.log(`User not found for bet: ${bet.id}`);
        continue;
      }

      // const userData = userSnapshot.data();
      const userId = userSnapshot.id; // Extract user ID

      // Check if the bet matches the spin result
      if (betType === spinResult) {
        winnings = betAmount * getPayoutMultiplier(betType);
        console.log(`User ${userId} won: ${winnings}. Updating balance...`);
        await incrementUserBalance(userId, winnings); // Update user's balance
      } else {
        console.log(`User ${userId} did not win. No balance update.`);
      }
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

export async function saveSpin(winningColor: Color) {
  const spinRef = doc(db, "wheel_spins", "spinData");

  // Get the current spin ID from Firestore
  const spinDoc = await getDoc(spinRef);

  let currentSpinID = 0;

  // If the document exists, get the current spin ID
  if (spinDoc.exists()) {
    currentSpinID = spinDoc.data()?.latestSpinID || 0;
  }
  // Increment the spin ID
  const nextSpinID = currentSpinID + 1;

  // Update the latest spin ID in the document
  await setDoc(spinRef, { latestSpinID: nextSpinID });

  // Save the new spin to the spins collection
  const spinData = {
    spinID: nextSpinID,
    createdAt: serverTimestamp(),
    winningColor: winningColor,
  };

  await setDoc(doc(db, "wheel_spins", nextSpinID.toString()), spinData);

  await processBetsAfterSpin(winningColor, nextSpinID);

  console.log(`Saved spin with ID: ${nextSpinID}`);
  return nextSpinID;
}

export function listenToSpinData(callback: (nextSpinId: number) => void) {
  const spinRef = doc(db, "wheel_spins", "spinData");

  // Set up the real-time listener
  const unsubscribe = onSnapshot(spinRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const spinData = docSnapshot.data();
      const latestSpinID = spinData?.latestSpinID;

      if (latestSpinID) {
        const nextSpinID = latestSpinID + 1; // Increment for next spin
        callback(nextSpinID); // Pass the nextSpinID to the callback
      }
    }
  });

  return unsubscribe;
}

export async function fetchInitialSpinID(): Promise<number | null> {
  const spinRef = doc(db, "wheel_spins", "spinData");
  const spinDoc = await getDoc(spinRef);

  if (spinDoc.exists()) {
    const latestSpinID = spinDoc.data()?.latestSpinID;
    if (latestSpinID) {
      return latestSpinID + 1; // Return the next spin ID
    }
  }
  return null; // Return null if no spin data exists
}
