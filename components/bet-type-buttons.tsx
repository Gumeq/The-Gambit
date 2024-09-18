import React, { useEffect, useState } from "react";
import {
  getFirestore,
  query,
  where,
  collection,
  onSnapshot,
  getDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import BetButton from "./wheel-bet-button";
import { Color } from "@/utils/firebase/wheel-bets"; // Adjust the import path as needed
import UserBetCardWheel from "./user-bet-card-wheel";

interface BetData {
  userRef: DocumentReference<DocumentData>; // Reference to the user document
  betType: Color;
  betAmount: number;
}

export interface UserData {
  displayName: string;
  id: string;
  photoUrl: string;
  exp: number;
}

interface BetWithUser {
  bet: BetData;
  user: UserData;
}

const BetTypeButtons = ({
  betAmount,
  onBetSelect,
  nextSpinId,
}: {
  betAmount: number;
  onBetSelect: (type: Color) => void;
  nextSpinId: number | null;
}) => {
  const [blackBets, setBlackBets] = useState<BetWithUser[]>([]);
  const [redBets, setRedBets] = useState<BetWithUser[]>([]);
  const [blueBets, setBlueBets] = useState<BetWithUser[]>([]);
  const [goldBets, setGoldBets] = useState<BetWithUser[]>([]);
  const db = getFirestore();

  // Function to listen for real-time bet updates for the next spin
  const listenToBetsForNextSpin = (nextSpinId: number) => {
    const betsRef = collection(db, "wheel_bets");
    const betsQuery = query(betsRef, where("spinId", "==", nextSpinId));

    const unsubscribe = onSnapshot(betsQuery, async (snapshot) => {
      const black: BetWithUser[] = [];
      const red: BetWithUser[] = [];
      const blue: BetWithUser[] = [];
      const gold: BetWithUser[] = [];

      // Loop through each bet and fetch the corresponding user data
      for (const doc of snapshot.docs) {
        const betData = doc.data() as BetData;
        const userRef = betData?.userRef;

        if (userRef) {
          // Fetch the user details using the reference
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data() as UserData;

            // Combine both betData and userData into a single object
            const betWithUser: BetWithUser = {
              bet: betData,
              user: userData,
            };

            // Group bets by betType
            switch (betData.betType) {
              case "black":
                black.push(betWithUser);
                break;
              case "red":
                red.push(betWithUser);
                break;
              case "blue":
                blue.push(betWithUser);
                break;
              case "gold":
                gold.push(betWithUser);
                break;
            }
          }
        }
      }

      // Update state with the combined bet and user information
      setBlackBets(black);
      setRedBets(red);
      setBlueBets(blue);
      setGoldBets(gold);
    });

    return unsubscribe; // Return the unsubscribe function to stop listening when the component unmounts
  };

  // Set up real-time listener for the next spin bets
  useEffect(() => {
    if (nextSpinId) {
      const unsubscribe = listenToBetsForNextSpin(nextSpinId);

      // Cleanup listener on component unmount or when nextSpinId changes
      return () => {
        unsubscribe();
      };
    }
  }, [nextSpinId]);

  return (
    <div className="flex w-full flex-row gap-4">
      <div className="flex w-full flex-col gap-2 rounded-md">
        <BetButton
          betType="black"
          multiplier="2x"
          color="#545454"
          onBetSelect={onBetSelect}
          disabled={betAmount <= 0} // Disable if betAmount is 0
        />
        {blackBets.length > 0 && (
          <ul className="flex w-full flex-col gap-2">
            {blackBets.map((item, index) => (
              <UserBetCardWheel
                user={item.user}
                bet={item.bet}
              ></UserBetCardWheel>
            ))}
          </ul>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 rounded-md">
        <BetButton
          betType="red"
          multiplier="3x"
          color="#cc3c2f"
          onBetSelect={onBetSelect}
          disabled={betAmount <= 0}
        />
        {redBets.length > 0 && (
          <ul className="flex w-full flex-col gap-2">
            {redBets.map((item, index) => (
              <UserBetCardWheel
                user={item.user}
                bet={item.bet}
              ></UserBetCardWheel>
            ))}
          </ul>
        )}
      </div>

      <div className="flex w-full flex-col gap-2 rounded-md">
        <BetButton
          betType="blue"
          multiplier="5x"
          color="#4c80f1"
          onBetSelect={onBetSelect}
          disabled={betAmount <= 0}
        />
        {blueBets.length > 0 && (
          <ul className="flex w-full flex-col gap-2">
            {blueBets.map((item, index) => (
              <UserBetCardWheel
                user={item.user}
                bet={item.bet}
              ></UserBetCardWheel>
            ))}
          </ul>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 rounded-md">
        <BetButton
          betType="gold"
          multiplier="50x"
          color="#f4ce3b"
          onBetSelect={onBetSelect}
          disabled={betAmount <= 0}
        />
        {goldBets.length > 0 && (
          <ul className="flex w-full flex-col gap-2">
            {goldBets.map((item, index) => (
              <UserBetCardWheel
                user={item.user}
                bet={item.bet}
              ></UserBetCardWheel>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BetTypeButtons;
