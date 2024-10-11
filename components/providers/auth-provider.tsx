"use client"; // Mark this as a client component for Firebase interactions

import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/config/firebase"; // Ensure you have Firestore initialized in your firebase config
import { doc, DocumentData, onSnapshot } from "firebase/firestore"; // Import Firestore methods

interface AuthContextProps {
  user: User | null;
  userData: DocumentData | null; // Store user data fetched from Firestore
  balance: number | null; // Real-time balance
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null); // State to store Firestore user data
  const [balance, setBalance] = useState<number | null>(null); // Real-time balance state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Set the Firebase user

      if (firebaseUser) {
        // Reference to the user's document in Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid); // Assuming user data is stored under "users" collection

        // Set up real-time listener for the entire user document
        const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data(); // Get the entire user data
            setUserData(userData); // Update user data in real-time

            // Update balance separately if it exists in the document
            if (userData.balance !== undefined) {
              setBalance(userData.balance.toFixed(2)); // Set real-time balance
            } else {
              setBalance(null); // If no balance field is present, set to null
            }
          } else {
            console.error("No user data found for this UID:", firebaseUser.uid);
            setUserData(null);
            setBalance(null);
          }
        });

        // Cleanup user document listener on unmount
        return () => unsubscribeUserDoc();
      } else {
        setUserData(null); // Clear userData if the user logs out
        setBalance(null); // Clear balance if the user logs out
      }

      setLoading(false); // Stop loading once user and userData are set
    });

    // Cleanup the auth state listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, balance, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
