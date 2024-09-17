"use client";

import { auth, googleProvider, db } from "../../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore"; // Added getDoc to retrieve the user document
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

      // Check if the document exists and if it contains a balance
      let balance = 10000; // Default balance for new users
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        balance = userData.balance ?? 0; // Use existing balance if available, otherwise default to 0
      }

      // Store user data in Firestore, but preserve the existing balance
      await setDoc(
        userDocRef,
        {
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
          balance: balance, // Keep the existing balance or set to 0 for new users
        },
        { merge: true },
      ); // Use merge option to update fields without overwriting the entire document

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
