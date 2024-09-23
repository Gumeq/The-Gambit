import React from "react";
import { Card } from "./blackjack";
import { motion } from "framer-motion";

type CardDisplayProps = {
  card: Card;
  initialPosition?: { x: number; y: number };
};

const CardDisplay = ({
  card,
  initialPosition = { x: -200, y: -200 },
}: CardDisplayProps) => {
  const suitColor = getSuitColor(card.suit);

  return (
    <motion.div
      className="pointer-events-none relative h-[220px] w-[157px] rounded-xl bg-foreground p-4 text-background"
      initial={{ x: initialPosition.x, y: initialPosition.y, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <div
        className={`absolute left-4 top-4 flex flex-col items-center text-4xl font-bold ${suitColor}`}
      >
        <p>{card.name}</p>
        <p>{getSuitUnicode(card.suit)}</p>
      </div>
      <div
        className={`absolute bottom-4 right-4 flex rotate-180 flex-col items-center text-4xl font-bold ${suitColor}`}
      >
        <p>{card.name}</p>
        <p>{getSuitUnicode(card.suit)}</p>
      </div>
    </motion.div>
  );
};

export default CardDisplay;

function getSuitUnicode(suit: string) {
  switch (suit) {
    case "hearts":
      return "♥";
    case "spades":
      return "♠";
    case "diamonds":
      return "♦";
    case "clubs":
      return "♣";
    default:
      return "wrong suit";
  }
}

function getSuitColor(suit: string) {
  if (suit === "hearts" || suit === "diamonds") {
    return "text-red-500";
  } else if (suit === "spades" || suit === "clubs") {
    return "text-black";
  } else {
    return "text-gray-500";
  }
}
