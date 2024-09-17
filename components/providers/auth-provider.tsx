"use client"; // Mark this as a client component for Firebase interactions

import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/config/firebase"; // Ensure you have Firestore initialized in your firebase config
import { doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore"; // Import Firestore methods

interface AuthContextProps {
  user: User | null;
  userData: DocumentData | null; // Store user data fetched from Firestore
  balance: number | null; // Real-time balance
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null); // New state to store Firestore user data
  const [balance, setBalance] = useState<number | null>(null); // Real-time balance state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser); // Set the Firebase user

      if (firebaseUser) {
        try {
          // Fetch user data from Firestore based on UID
          const userDocRef = doc(db, "users", firebaseUser.uid); // Assuming user data is stored under "users" collection
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data()); // Set the user data from Firestore
          } else {
            console.error("No user data found for this UID:", firebaseUser.uid);
            setUserData(null);
          }

          // Set up real-time listener for balance field
          const unsubscribeBalance = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              if (data?.balance !== undefined) {
                setBalance(data.balance); // Update balance in real-time
              } else {
                setBalance(null); // Set to null if no balance field
              }
            } else {
              console.log("User document does not exist");
              setBalance(null); // Clear balance if no document exists
            }
          });

          // Cleanup balance listener on unmount
          return () => unsubscribeBalance();
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
          setBalance(null);
        }
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
