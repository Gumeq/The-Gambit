// firebaseUtils.ts
import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  increment,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

// Fetch user data from Firestore based on userId
export const fetchUserData = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data(); // Return user data (e.g., balance)
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
};

export const updateUserBalance = async (userId: string, newBalance: number) => {
  try {
    const userRef = doc(db, "users", userId); // Reference to the user's document

    // Update the balance field in Firestore
    await updateDoc(userRef, {
      balance: newBalance,
    });

    console.log("User balance updated successfully:", newBalance);
  } catch (error) {
    console.error("Error updating user balance:", error);
    throw new Error("Failed to update user balance");
  }
};

export async function incrementUserBalance(userId: string, amount: number) {
  const userRef = doc(db, "users", userId);

  // Increment the user's balance by the winnings
  await updateDoc(userRef, {
    balance: increment(amount),
  });
}

export async function decrementUserBalance(userId: string, amount: number) {
  const userRef = doc(db, "users", userId);

  // Increment the user's balance by the winnings
  await updateDoc(userRef, {
    balance: increment(-amount),
  });
}

export async function incrementUserExp(userId: string, amount: number) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    exp: increment(amount),
  });
}

export async function isEligibleForDailyBonus(userId: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const now = Timestamp.now();

  if (!userSnap.exists()) return true; // No record means eligible

  const lastClaimed = userSnap.data().lastDailyBonusClaimed;
  if (!lastClaimed) return true;

  const hoursSinceLastClaim = (now.seconds - lastClaimed.seconds) / 3600;
  return hoursSinceLastClaim >= 24;
}

export async function isEligibleForWeeklyBonus(userId: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const now = Timestamp.now();

  if (!userSnap.exists()) return true; // No record means eligible

  const lastClaimed = userSnap.data().lastWeeklyBonusClaimed;
  if (!lastClaimed) return true;

  const daysSinceLastClaim = (now.seconds - lastClaimed.seconds) / (3600 * 24);
  return daysSinceLastClaim >= 7;
}

export async function giveBonusToUser(
  userId: string,
  amount: number,
  bonusType: "daily" | "weekly" | null = null,
): Promise<void> {
  const userRef = doc(db, "users", userId);
  const updateData: Record<string, any> = {
    balance: increment(amount),
  };
  if (bonusType === "daily") {
    updateData.lastDailyBonusClaimed = Timestamp.now();
  } else if (bonusType === "weekly") {
    updateData.lastWeeklyBonusClaimed = Timestamp.now();
  }
  await updateDoc(userRef, updateData);
}
