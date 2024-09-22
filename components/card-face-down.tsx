import React from "react";

const CardDisplayFaceDown = () => {
  return (
    <div className="relative h-[220] w-[157px] bg-background text-background">
      <div className="pointer-events-none flex h-full w-full items-center justify-center rounded-xl bg-foreground/20 p-4 text-center text-2xl font-bold text-foreground">
        <p className="pointer-events-none">THE GAMBIT</p>
      </div>
    </div>
  );
};

export default CardDisplayFaceDown;
