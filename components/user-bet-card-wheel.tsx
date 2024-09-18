import React from "react";
import { DocumentData } from "firebase/firestore";

type UserBetCardProps = {
  user: DocumentData;
  bet: DocumentData;
};

const UserBetCardWheel = ({ user, bet }: UserBetCardProps) => {
  return (
    <div className="flex w-full flex-row justify-between rounded-md bg-foreground/5 p-2">
      <div className="flex flex-row gap-2">
        <img src={user.photoURL} alt="" className="h-16 w-16 rounded-md" />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{user.displayName}</p>
          <p>Rank: {user.exp}</p>
        </div>
      </div>
      <div className="flex h-full flex-row items-center justify-center gap-2 p-2 text-xl font-semibold">
        <img src="/assets/images/chip.png" className="ml-2 h-4 w-4" alt="" />
        <p>{bet.betAmount}</p>
      </div>
    </div>
  );
};

export default UserBetCardWheel;
