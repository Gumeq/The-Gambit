"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // For unique picture IDs
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage functions
import { addDoc, collection } from "firebase/firestore"; // Import Firestore functions
import { db, storage } from "@/config/firebase";

const AdminUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [name, setName] = useState<string>("");
  // const [rarity, setRarity] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !price || !name) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate a unique ID for the picture
      const uniqueId = uuidv4();

      // Create a reference for Firebase Storage
      const storageRef = ref(
        storage,
        `profile_pictures/${uniqueId}-${file.name}`,
      );

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL for the uploaded file
      const url = await getDownloadURL(storageRef);

      // Save image details to Firestore
      await addDoc(collection(db, "profile_pictures"), {
        name,
        price,
        // rarity,
        url,
      });

      setSuccess("Picture uploaded and saved successfully!");
      setFile(null);
      setPrice(0);
      // setRarity("");
      setName("");
    } catch (err) {
      setError("Error uploading the picture.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">Upload New Profile Picture</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">
            Picture File:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Picture Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Price (Chips):
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded border p-2"
            required
          />
        </div>

        {/* <div>
          <label className="mb-1 block text-sm font-medium">Rarity:</label>
          <input
            type="number"
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div> */}

        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Picture"}
        </button>
      </form>
    </div>
  );
};

export default AdminUploadPage;
