// firebaseUtils.ts
import { db } from "@/config/firebase";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";

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
