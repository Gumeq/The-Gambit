import React from "react";
import { DocumentData } from "firebase/firestore";
import LevelBadgeSmall from "../level-badge-small";

type UserBetCardProps = {
  user: DocumentData;
  bet: DocumentData;
};

const UserBetCardWheel = ({ user, bet }: UserBetCardProps) => {
  return (
    <div className="flex w-full flex-row justify-between rounded-md bg-foreground/5 p-2">
      <div className="flex flex-row items-center gap-2">
        <LevelBadgeSmall exp={user.exp}></LevelBadgeSmall>
        <p>{user.displayName}</p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <img src="/assets/images/chip.png" className="ml-2 h-4 w-4" alt="" />
        <p>{bet.betAmount}</p>
      </div>
    </div>
  );
};

export default UserBetCardWheel;
