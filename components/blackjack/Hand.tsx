// Hand.tsx
import React from "react";
import CardComponent, { Card } from "./Card";

interface HandProps {
  cards: Card[];
  hideFirstCard?: boolean;
  result?: "win" | "loss" | "push" | "bust";
}

const Hand: React.FC<HandProps> = ({
  cards,
  hideFirstCard = false,
  result,
}) => {
  const getBorderClass = () => {
    if (result === "win") return "border-4 border-green-500";
    if (result === "push") return "border-4 border-yellow-500";
    if (result === "loss" || result === "bust")
      return "border-4 border-red-500";
    return "";
  };

  return (
    <div className={`inline-block rounded-lg p-4`}>
      <div className="flex">
        {cards.map((card, index) => (
          <div
            key={index}
            className="transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-110"
            style={{
              marginLeft: index === 0 ? 0 : -60,
              marginTop: index === 0 ? 0 : index * 30,
              zIndex: index,
            }}
          >
            <CardComponent
              card={card}
              isHidden={hideFirstCard && index === 0}
              border={getBorderClass()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hand;
