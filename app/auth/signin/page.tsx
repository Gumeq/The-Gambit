"use client";

import { auth, googleProvider, db } from "../../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import nookies from "nookies";

const SignIn = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get the Firebase ID token
      const token = await user.getIdToken();

      // Store the token in cookies
      nookies.set(null, "token", token, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // Token expires after 30 days
      });

      // Get reference to the user's document in Firestore
      const userDocRef = doc(db, "users", user.uid);

      // Fetch the user's existing document
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // If the user document does not exist, create it
        await setDoc(userDocRef, {
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: serverTimestamp(),
          balance: 10000, // Default balance for new users
          exp: 0, // Default exp for new users
          level: 0,
          lastDailyBonusClaimed: null,
          lastWeeklyBonusClaimed: null,
          lastLevelBonusClaimed: null,
          unlockedProfilePictures: [],
        });
      } else {
        // If user exists, update missing fields and last login
        await setDoc(
          userDocRef,
          {
            displayName: user.displayName ?? userDocSnap.data().displayName, // Add if missing
            email: user.email ?? userDocSnap.data().email, // Add if missing
            // photoURL: user.photoURL ?? userDocSnap.data().photoURL, // Add if missing
            photoUrl:
              user.photoURL ??
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            lastLogin: serverTimestamp(),
            balance: userDocSnap.data().balance ?? 10000, // Add if missing
            exp: userDocSnap.data().exp ?? 0, // Add if missing
            level: userDocSnap.data().level ?? 0, // Add if missing
            lastDailyBonusClaimed:
              userDocSnap.data().lastDailyBonusClaimed ?? null,
            lastWeeklyBonusClaimed:
              userDocSnap.data().lastWeeklyBonusClaimed ?? null,
            lastLevelBonusClaimed:
              userDocSnap.data().lastLevelBonusClaimed ?? null,
            unlockedProfilePictures:
              userDocSnap.data().unlockedProfilePictures ?? [], // Add if missing
          },
          { merge: true },
        );
      }

      // Redirect to dashboard after successful login
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-xs rounded-lg p-8 shadow-md">
        <h1 className="mb-4 text-xl font-bold">Sign In</h1>
        <button
          onClick={handleGoogleSignIn}
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
