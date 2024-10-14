"use client";

import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore"; // Firestore functions
import { useAuth } from "./providers/auth-provider"; // Use your auth provider for real-time user data
import { db } from "@/config/firebase";

type Pictures = {
  name: string;
  price: number;
  url: string;
  id: string;
};

const ProfilePictureSelection = () => {
  const { userData } = useAuth(); // Assuming useAuth gives you current user's data
  const [unlockedPictures, setUnlockedPictures] = useState<Pictures[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnlockedPictures = async () => {
      if (
        !userData?.unlockedProfilePictures ||
        userData.unlockedProfilePictures.length === 0
      ) {
        setUnlockedPictures([]);
        setLoading(false);
        return;
      }

      try {
        const picturePromises = userData.unlockedProfilePictures.map(
          async (pictureId: string) => {
            const pictureRef = doc(db, "profile_pictures", pictureId);
            const pictureSnap = await getDoc(pictureRef);

            if (pictureSnap.exists()) {
              return {
                id: pictureSnap.id,
                ...pictureSnap.data(),
              };
            }
          },
        );

        const pictures = await Promise.all(picturePromises);
        setUnlockedPictures(pictures.filter(Boolean)); // Filter out any undefined results
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pictures: ", err);
        setError("Failed to load pictures.");
        setLoading(false);
      }
    };

    fetchUnlockedPictures();
  }, [userData]);

  const setProfilePicture = async (pictureUrl: string) => {
    if (!userData) return;

    try {
      // Update the user's profile picture in Firestore
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, {
        photoURL: pictureUrl,
      });

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture.");
    }
  };

  if (loading) return <div>Loading unlocked pictures...</div>;
  if (error) return <div>{error}</div>;

  if (!unlockedPictures || unlockedPictures.length === 0) {
    return <p>You havent unlocked any profile pictures yet.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {unlockedPictures.map((picture) => (
        <div key={picture.id} className="rounded border p-4 shadow-lg">
          <img
            src={picture.url} // Assuming each picture document has a `url` field
            alt="Profile picture"
            className="h-auto w-full"
          />
          <button
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => setProfilePicture(picture.url)}
          >
            Set as Profile Picture
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProfilePictureSelection;
