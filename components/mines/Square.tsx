import React from "react";

interface SquareProps {
  revealed: boolean;
  hasMine: boolean;
  onClick: () => void;
  gameStarted: boolean;
}

const Square: React.FC<SquareProps> = ({
  revealed,
  hasMine,
  onClick,
  gameStarted,
}) => {
  const getContent = () => {
    if (!revealed) return null;

    // You can either use static image paths or import images at the top of the file
    if (hasMine) {
      return (
        <img
          src="/assets/images/mine.png"
          alt="Mine"
          className="h-full w-full object-cover"
        />
      );
    }
    return (
      <img
        src="/assets/images/ruby.png"
        alt="Safe"
        className="h-full w-full object-cover"
      />
    );
  };

  return (
    <button
      className={`flex h-32 w-32 cursor-pointer items-center justify-center rounded text-2xl transition-all duration-300 ${
        revealed
          ? hasMine
            ? "bg-red-500"
            : "bg-foreground/25"
          : "bg-foreground/5 hover:bg-foreground/10"
      }`}
      onClick={onClick}
      disabled={!gameStarted || revealed}
    >
      {getContent()}
    </button>
  );
};

export default Square;
