"use client";

// components/SlotMachine.tsx
import { useEffect, useState } from "react";

import "../app/slots/slots.css";

const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "🔔"]; // Symbols for the slot machine

const getRandomSymbol = () =>
  symbols[Math.floor(Math.random() * symbols.length)];

const SlotMachine = () => {
  const [spin, setSpin] = useState(false);
  const [ring1, setRing1] = useState<number | undefined>();
  const [ring2, setRing2] = useState<number | undefined>();
  const [ring3, setRing3] = useState<number | undefined>();
  const [price, setPrice] = useState<number | null>(null);
  const [input, setInput] = useState<string>("");
  const [realBet, setRealBet] = useState<number | null>(null);
  const [jackpot, setJackpot] = useState<number>(0);
  const [balance, setBalance] = useState<number>(100000);

  // Trigger win logic after reel3 finishes spinning
  useEffect(() => {
    if (ring3 !== undefined) {
      win();
    }
  }, [ring3]);

  // Helper function to randomize rings and simulate delays
  const spinReels = () => {
    setSpin(true);
    setRing1(undefined);
    setRing2(undefined);
    setRing3(undefined);
    setTimeout(() => setRing1(Math.floor(Math.random() * 100) + 1), 1000);
    setTimeout(() => setRing2(Math.floor(Math.random() * 100) + 1), 2000);
    setTimeout(() => setRing3(Math.floor(Math.random() * 100) + 1), 3000);
  };

  const play = () => {
    const betAmount = Number(input);
    if (betAmount > 0 && betAmount <= balance) {
      setRealBet(betAmount);
      setBalance(balance - betAmount);
      setJackpot(jackpot + betAmount / 2);
      setTimeout(spinReels, 500);
    } else {
      setPrice(10); // Not enough funds
    }
  };

  const win = () => {
    if (ring1 && ring2 && ring3) {
      const matchResult = [ring1, ring2, ring3].every((ring) => ring <= 50);
      if (matchResult) {
        setPrice(1);
        setBalance(balance + realBet! * 15);
      } else if (ring1 > 50 && ring1 <= 75 && ring2 > 50 && ring3 > 50) {
        setPrice(2);
        setBalance(balance + realBet! * 20);
      } else if (ring1 > 75 && ring2 > 75 && ring3 > 75) {
        setPrice(3);
        setBalance(balance + realBet! * 25);
      } else if (ring1 > 95 && ring2 > 95 && ring3 > 95) {
        setPrice(4);
        setBalance(balance + jackpot);
        setJackpot(0);
      } else {
        setPrice(0); // No win
      }
    }
  };

  const renderReel = (ring: number | undefined) => {
    const fruits = ["🍓", "🍇", "🍊", "🥭"];
    if (!spin && ring === undefined) {
      return fruits.map((fruit) => <div className="ringEnd">{fruit}</div>);
    } else if (spin && ring === undefined) {
      return fruits.map((fruit) => <div className="ringMoving">{fruit}</div>);
    } else if (ring !== undefined) {
      const index = ring % fruits.length;
      return fruits.map((fruit, i) => (
        <div className="ringEnd">{fruits[(index + i) % fruits.length]}</div>
      ));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/;
    if (value.match(regex) || value === "") {
      setInput(value);
    }
  };

  const renderWinMessage = () => {
    if (price === 1) return `🍇 X15 You've won ${realBet! * 15}€!`;
    if (price === 2) return `🍊 X20 You've won ${realBet! * 20}€!`;
    if (price === 3) return `🥭 X25 You've won ${realBet! * 25}€!`;
    if (price === 4) return `🍓 Jackpot! You've won ${jackpot}€!`;
    if (price === 0) return `😧 So close! But no luck...`;
    if (price === 10) return `🥶 Not enough funds`;
    return null;
  };

  return (
    <div className="fullSlot">
      <h1 className="casinoName">casino montecarlo</h1>
      <h1 className="price">Jackpot: {jackpot}€</h1>
      <div className="slot">
        <div className="row">{renderReel(ring1)}</div>
        <div className="row">{renderReel(ring2)}</div>
        <div className="row">{renderReel(ring3)}</div>
      </div>
      <h1 className="price">{renderWinMessage()}</h1>
      <div className="slotFoot">
        <input
          value={input}
          type="number"
          onChange={handleInputChange}
          className="betInput"
          placeholder="0€"
        />
        <button className="spinButton" onClick={play}>
          Spin
        </button>
      </div>
      <h1 className="price">Available cash: {balance}€</h1>
      <button
        onClick={() => setBalance(balance + 1000)}
        className="buyMoreButton"
      >
        Add 1000€
      </button>
    </div>
  );
};

export default SlotMachine;
