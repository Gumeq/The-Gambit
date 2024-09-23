import React from "react";
import { motion } from "framer-motion";

const CardDisplayFaceDown = () => {
  return (
    <motion.div
      className="relative h-[220px] w-[157px] bg-background text-background"
      initial={{ x: -200, y: -200, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <div className="pointer-events-none flex h-full w-full items-center justify-center rounded-xl bg-foreground/20 p-4 text-center text-2xl font-bold text-foreground">
        <p className="pointer-events-none">THE GAMBIT</p>
      </div>
    </motion.div>
  );
};

export default CardDisplayFaceDown;
