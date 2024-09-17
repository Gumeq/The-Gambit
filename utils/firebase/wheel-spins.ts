// firebaseUtils.ts
import { db } from "@/config/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

// Fetch the latest spin from Firestore
export const fetchLatestSpin = async () => {
  const q = query(
    collection(db, "wheel_spins"),
    orderBy("timestamp", "desc"),
    limit(1),
  ); // Adjust based on your schema
  const querySnapshot = await getDocs(q);
  const latestSpin = querySnapshot.docs[0];

  if (latestSpin) {
    return latestSpin.id; // Return the spin document ID
  } else {
    console.log("No active spins found");
    return null;
  }
};

// Fetch a specific spin by ID
export const fetchSpinById = async (spinId: string) => {
  const spinDoc = await getDoc(doc(db, "wheel_spins", spinId));
  return spinDoc.exists() ? spinDoc.id : null;
};
