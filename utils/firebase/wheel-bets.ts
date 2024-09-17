import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { fetchUserData, updateUserBalance } from "./user-data";

// Define a type for the allowed colors
export type Color = "black" | "red" | "blue" | "gold";

// Interface for Bet
interface Bet {
  id: string;
  userId: string;
  betAmount: number;
  betColor: string;
  timestamp: Timestamp;
  spinId: string;
}

// Function to save a bet to Firestore
export const saveBetToDatabase = async (
  userId: string,
  betAmount: number,
  betColor: Color, // Use the Color type here
  spinId: string,
) => {
  try {
    const docRef = await addDoc(collection(db, "wheel_bets"), {
      userId: userId,
      betAmount: betAmount,
      betColor: betColor,
      timestamp: Timestamp.now(),
      spinId: spinId,
    });

    console.log("Bet saved with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding bet: ", e);
  }
};

// Fetch winning bets based on spinId and winningColor
export const fetchWinningBets = async (
  spinId: string,
  winningColor: Color, // Ensure this is a valid Color type
  userId: string,
): Promise<Bet[]> => {
  console.log(
    "Querying for spinId:",
    spinId,
    "winningColor:",
    winningColor,
    "userId:",
    userId,
  );

  // Query Firestore for bets matching spinId, betColor, and userId
  const q = query(
    collectionGroup(db, "wheel_bets"),
    where("spinId", "==", spinId.toString()),
    where("betColor", "==", winningColor),
    where("userId", "==", userId),
  );

  try {
    const querySnapshot = await getDocs(q);

    // Check if there are results
    if (querySnapshot.empty) {
      console.log("No matching bets found.");
      return []; // Return an empty array if no bets are found
    }

    // Type each document as a Bet and log the data
    const bets: Bet[] = querySnapshot.docs.map((doc) => {
      const betData = doc.data();
      console.log("Fetched bet data:", betData); // Log each document's data to ensure it's what you expect
      return {
        id: doc.id, // Ensure the document ID is included
        ...betData,
      } as Bet; // Cast to Bet type
    });

    console.log("Fetched bets:", bets);

    return bets;
  } catch (error) {
    console.error("Error fetching winning bets:", error);
    throw error; // Throw the error so it can be caught by the caller
  }
};

// Reward winners based on the fetched bets
export const rewardWinners = async (
  spinId: string,
  winningColor: Color, // Use the Color type here
  userId: string,
) => {
  try {
    const bets = await fetchWinningBets(spinId, winningColor, userId); // Fetch all bets for this spin
    const payoutMultiplier: Record<Color, number> = {
      black: 2,
      red: 3,
      blue: 5,
      gold: 50,
    };

    const userData = await fetchUserData(userId);

    let newBalance = 0;

    if (userData) {
      newBalance = userData.balance;
    }

    for (const bet of bets) {
      console.log(payoutMultiplier[winningColor]);
      let payout = bet.betAmount * payoutMultiplier[winningColor];

      // Update new balance
      newBalance += payout;
    }

    await updateUserBalance(userId, newBalance);

    console.log("Winners rewarded successfully, new balance:", newBalance);
  } catch (error) {
    console.error("Error rewarding winners:", error);
  }
};
