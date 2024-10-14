"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore functions
import { useAuth } from "./providers/auth-provider"; // Use your auth provider for real-time user data
import { db } from "@/config/firebase";
import { decrementUserBalance } from "@/utils/firebase/user-data";

// Define the Picture interface to represent the data
interface Picture {
  id: string;
  name: string;
  price: number;
  url: string;
}

const PicturesStore = () => {
  const [pictures, setPictures] = useState<Picture[]>([]); // Use the Picture type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userData, balance } = useAuth(); // Use real-time user data

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const picturesSnapshot = await getDocs(
          collection(db, "profile_pictures"),
        );
        const picturesList: Picture[] = picturesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Picture[]; // Ensure that the result is typed as Picture[]

        // Sort pictures by price (ascending order)
        picturesList.sort((a, b) => a.price - b.price);

        setPictures(picturesList);
        setLoading(false);
      } catch (err) {
        setError("Failed to load pictures.");
        console.error(err);
      }
    };

    fetchPictures();
  }, []);

  const buyPicture = async (pictureId: string, picturePrice: number) => {
    if (!userData || !balance) {
      alert("User data or balance not loaded.");
      return;
    }

    if (balance >= picturePrice) {
      try {
        // Decrement the user's balance
        await decrementUserBalance(userData.id, picturePrice);

        // Add the picture to the user's unlocked pictures
        const userRef = doc(db, "users", userData.id);
        const updatedUnlockedProfilePictures = [
          ...userData.unlockedProfilePictures,
          pictureId,
        ];

        await updateDoc(userRef, {
          unlockedProfilePictures: updatedUnlockedProfilePictures,
        });
      } catch (err) {
        console.error("Error purchasing picture:", err);
      }
    } else {
      alert("Not enough coins to purchase this picture.");
    }
  };

  if (loading) return <div>Loading pictures...</div>;
  if (error) return <div>{error}</div>;

  if (!userData || !balance) {
    return <div>Loading user data...</div>; // Handle case when userData or balance is not yet loaded
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {pictures.map((picture) => (
        <div key={picture.id} className="rounded-lg border p-2">
          <img
            src={picture.url}
            alt={picture.name}
            className="aspect-[1/1] w-full"
          />
          <h2 className="mt-2 font-semibold">{picture.name}</h2>
          <p className="text-sm text-foreground/80">{picture.price} chips</p>
          {(userData.unlockedProfilePictures ?? []).includes(picture.id) ? (
            <button
              className="mt-2 w-full rounded bg-foreground/10 py-2 text-white"
              onClick={() => buyPicture(picture.id, picture.price)}
            >
              Owned
            </button>
          ) : (
            <button
              className="mt-2 w-full rounded bg-primary py-2 text-white"
              onClick={() => buyPicture(picture.id, picture.price)}
            >
              Buy
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PicturesStore;
