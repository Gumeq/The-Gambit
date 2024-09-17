"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore"; // Assuming you already have Firebase initialized
import { db } from "@/config/firebase";
import {
  getColorHeight,
  getNumberColorHex,
} from "@/utils/roulette/roulette-functions";

function PastSpins() {
  const [spins, setSpins] = useState<DocumentData[]>([]); // State to hold the list of spins

  useEffect(() => {
    // Reference to the spins collection
    const spinsRef = collection(db, "wheel_spins");

    // Create a Firestore query to limit to 25 documents and order by a field (e.g., spinStartTime or id)
    const spinsQuery = query(
      spinsRef,
      orderBy("spinStartTime", "desc"),
      limit(25),
    );

    const unsubscribe = onSnapshot(
      spinsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // When a new spin is added, wait 5 seconds before updating the spins state
            const newSpin = change.doc.data();

            // Delay the update by 5 seconds
            setTimeout(() => {
              setSpins((prevSpins) => {
                // Add the new spin at the beginning of the array
                const updatedSpins = [newSpin, ...prevSpins];

                // Ensure the array doesn't exceed 25 spins
                if (updatedSpins.length > 25) {
                  updatedSpins.pop(); // Remove the last spin
                }

                return updatedSpins;
              });
            }, 6000); // Wait for 5 seconds before updating
          }
        });
      },
    );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      {spins.length > 0 ? (
        <ul className="flex w-full flex-row-reverse justify-between">
          {spins.map((spin, index) => {
            const color = getNumberColorHex(spin.targetNumber); // Get color dynamically
            const height = getColorHeight(color); // Get height dynamically based on color or any other logic
            return (
              <li
                key={index}
                className="w-2 rounded-full"
                style={{ backgroundColor: color, height: `${height}px` }} // Dynamically set both background color and height
              ></li>
            );
          })}
        </ul>
      ) : (
        <p>No spins available yet.</p>
      )}
    </>
  );
}

export default PastSpins;

// (
//             <li key={index} className="h-6 w-2 rounded-full bg-red-500"></li>
//           )
