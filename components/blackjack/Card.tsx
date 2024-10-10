import React from "react";
import { RANKS, SUITS } from "./utils/constants";

export interface Card {
  suit: (typeof SUITS)[number];
  rank: (typeof RANKS)[number];
  value: number;
}

interface CardProps {
  card: Card;
  isHidden?: boolean;
  style?: React.CSSProperties;
  border?: string;
}

const CardComponent: React.FC<CardProps> = ({
  card,
  isHidden = false,
  style,
  border,
}) => {
  const getSuitColor = (suit: Card["suit"]) => {
    return suit === "♥" || suit === "♦" ? "text-red-600" : "text-black";
  };

  return (
    <div
      className={`relative mx-1 flex aspect-[2/3] h-48 select-none rounded bg-foreground shadow-2xl ${border}`}
      style={style}
    >
      {isHidden ? (
        <div className="h-full w-full rounded bg-primary"></div>
      ) : (
        <div
          className={`absolute left-2 top-2 text-4xl font-bold ${getSuitColor(card.suit)} pointer-events-none flex flex-col items-center`}
        >
          <p className="leading-none">{card.rank}</p>
          <p className="leading-none">{card.suit}</p>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
