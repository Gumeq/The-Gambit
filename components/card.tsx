import React from "react";
import { Card } from "./blackjack";

type CardDisplayProps = {
  card: Card;
};

const CardDisplay = (card: CardDisplayProps) => {
  const suitColor = getSuitColor(card.card.suit);

  return (
    <div className="pointer-events-none relative h-[220px] w-[157px] rounded-xl bg-foreground p-4 text-background">
      <div
        className={`absolute left-4 top-4 flex flex-col items-center text-4xl font-bold ${suitColor}`}
      >
        <p>{card.card.name}</p>
        <p>{getSuitUnicode(card.card.suit)}</p>
      </div>
      <div
        className={`absolute bottom-4 right-4 flex flex-col items-center text-4xl font-bold ${suitColor} rotate-180`}
      >
        <p>{card.card.name}</p>
        <p>{getSuitUnicode(card.card.suit)}</p>
      </div>
    </div>
  );
};

export default CardDisplay;

function getSuitUnicode(suit: string) {
  if (suit === "hearts") {
    return "♥";
  } else if (suit === "spades") {
    return "♠";
  } else if (suit === "diamonds") {
    return "♦";
  } else if (suit === "clubs") {
    return "♣";
  } else {
    return "wrong suit";
  }
}

function getSuitColor(suit: string) {
  if (suit === "hearts" || suit === "diamonds") {
    return "text-red-500"; // Tailwind class for red color
  } else if (suit === "spades" || suit === "clubs") {
    return "text-black"; // Tailwind class for black color
  } else {
    return "text-gray-500"; // Fallback color for invalid suits
  }
}
