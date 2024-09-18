"use client";

import { auth, googleProvider, db } from "../../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
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
          lastLogin: new Date(),
          balance: 10000, // Default balance for new users
          rank: 0, // Default rank for new users
        });
      } else {
        // If user exists, just update the last login timestamp
        await setDoc(
          userDocRef,
          {
            lastLogin: new Date(),
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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-xs rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-xl font-bold">Sign In</h1>
        <button
          onClick={handleGoogleSignIn}
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
