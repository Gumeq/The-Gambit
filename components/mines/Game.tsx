"use client";

import React, { useState, useEffect } from "react";
import Square from "./Square";
import { useAuth } from "../providers/auth-provider";
import {
  decrementUserBalance,
  incrementUserBalance,
  incrementUserExp,
} from "@/utils/firebase/user-data";
import { EXP_MULTIPLIERS } from "@/utils/constants";

interface SquareState {
  hasMine: boolean;
  revealed: boolean;
}

const Game: React.FC = () => {
  const [grid, setGrid] = useState<SquareState[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [minesCount, setMinesCount] = useState<number>(5); // User-selectable mines
  const [betAmount, setBetAmount] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [safeClicks, setSafeClicks] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const { userData, balance } = useAuth();

  const gridSize = 5;
  const totalSquares = gridSize * gridSize;

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (gameStarted) {
      initializeGrid();
    }
  }, [gameStarted]);

  const initializeGrid = () => {
    const newGrid: SquareState[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        hasMine: false,
        revealed: false,
      })),
    );

    if (gameStarted) {
      let minesPlaced = 0;
      while (minesPlaced < minesCount) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        if (!newGrid[row][col].hasMine) {
          newGrid[row][col].hasMine = true;
          minesPlaced++;
        }
      }
    }
    setGrid(newGrid);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!gameStarted) {
      setMessage("Please place a bet to start the game.");
      return;
    }
    if (grid[row][col].revealed) return;

    const square = grid[row][col];

    if (square.hasMine) {
      const newGrid = grid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, revealed: true };
          }
          return cell;
        }),
      );
      setGrid(newGrid);
      setMessage(
        `Clicked square ${row + 1}x${col + 1}, mine found! Game over.`,
      );
      setGameStarted(false);
    } else {
      const newGrid = grid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, revealed: true };
          }
          return cell;
        }),
      );
      setGrid(newGrid);

      const newSafeClicks = safeClicks + 1;
      setSafeClicks(newSafeClicks);
      const newMultiplier = calculateMultiplier(
        newSafeClicks,
        totalSquares,
        minesCount,
      );
      setMultiplier(newMultiplier);

      setMessage(`Clicked square ${row + 1}x${col + 1}, no mine.`);
    }
  };

  const calculateMultiplier = (
    clicks: number,
    totalSquares: number,
    totalMines: number,
    houseEdge: number = 0.01,
  ) => {
    let cumulativeProbability = 1;

    for (let i = 1; i <= clicks; i++) {
      const safeSquaresRemaining = totalSquares - totalMines - (i - 1);
      const squaresRemaining = totalSquares - (i - 1);
      const pSafeAtStep = safeSquaresRemaining / squaresRemaining;
      cumulativeProbability *= pSafeAtStep;
    }

    const adjustedMultiplier = (1 - houseEdge) / cumulativeProbability;
    return parseFloat(adjustedMultiplier.toFixed(2));
  };

  const handleWithdraw = async () => {
    if (!userData || !userData.id) {
      setMessage("User not authenticated.");
      return;
    }
    const winnings = parseFloat((betAmount * multiplier).toFixed(2));
    try {
      await incrementUserBalance(userData.id, winnings);
      setMessage(`You won ${winnings}!`);
      setGameStarted(false);
    } catch (error) {
      setMessage("Error processing withdrawal: " + error);
    }
  };

  const handleBetPlaced = async () => {
    if (!canPlaceBet()) {
      setMessage("Invalid bet amount.");
      return;
    }
    if (!userData || !userData.id) {
      setMessage("User not authenticated.");
      return;
    }
    try {
      await decrementUserBalance(userData.id, betAmount);
      await incrementUserExp(userData.id, betAmount * EXP_MULTIPLIERS["MINES"]);
      setMultiplier(1);
      setSafeClicks(0);
      setMessage("");
      setGameStarted(true);
    } catch (error) {
      setMessage("Error placing bet: " + error);
    }
  };

  const canPlaceBet = () => {
    return (
      betAmount > 0 &&
      balance !== null &&
      balance !== undefined &&
      betAmount <= balance
    );
  };

  const potentialProfit =
    gameStarted && betAmount
      ? parseFloat((betAmount * multiplier).toFixed(2))
      : 0;

  useEffect(() => {
    const adScriptConfig = document.createElement("script");
    adScriptConfig.type = "text/javascript";
    adScriptConfig.innerHTML = `
      atOptions = {
        'key' : '8fb5579118bbd7c598361a7fc241cfd2',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
    `;

    const adScriptSrc = document.createElement("script");
    adScriptSrc.type = "text/javascript";
    adScriptSrc.src =
      "//www.topcpmcreativeformat.com/8fb5579118bbd7c598361a7fc241cfd2/invoke.js";

    document.body.appendChild(adScriptConfig);
    document.body.appendChild(adScriptSrc);

    return () => {
      document.body.removeChild(adScriptConfig);
      document.body.removeChild(adScriptSrc);
    };
  }, []);

  return (
    <div className="flex w-full overflow-hidden rounded-lg bg-foreground/5 text-white">
      {/* Left side */}
      <div className="flex w-1/4 flex-col gap-4 p-4">
        {/* Bet Controls */}
        <div className="-mb-3 flex flex-row justify-between text-sm font-semibold text-foreground/50">
          <p>Bet Amount</p>
          <p className="">
            {balance !== null && balance !== undefined ? balance : "..."}
          </p>
        </div>
        <div className="flex w-full flex-row rounded bg-foreground/5 p-1">
          <input
            id="betAmount"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full rounded-l bg-background p-2 font-semibold text-foreground"
            min="1"
            max={
              balance !== null && balance !== undefined ? balance : undefined
            }
            disabled={gameStarted}
          />
          <div className="flex aspect-[1/1] h-full items-center justify-center rounded-r bg-background">
            <img src="/assets/images/chip.png" className="h-4 w-4" alt="" />
          </div>
          <div className="flex w-32 flex-row text-sm">
            <div
              className="flex aspect-[1/1] h-full w-full cursor-pointer items-center justify-center"
              onClick={() =>
                setBetAmount((prev) => Math.max(1, Math.floor(prev / 2)))
              }
            >
              1/2
            </div>
            <div className="my-auto h-[50%] w-1 rounded-full bg-background"></div>
            <div
              className="flex aspect-[1/1] h-full w-full cursor-pointer items-center justify-center"
              onClick={() =>
                setBetAmount((prev) =>
                  balance !== null && balance !== undefined
                    ? Math.min(balance, prev * 2)
                    : prev * 2,
                )
              }
            >
              2x
            </div>
          </div>
        </div>
        <div className="">
          <label className="block text-sm font-semibold text-foreground/50">
            Number of Mines
          </label>
          <input
            id="minesCount"
            type="number"
            value={minesCount}
            onChange={(e) => setMinesCount(Number(e.target.value))}
            className="w-full rounded bg-background p-2 font-semibold text-foreground"
            min="1"
            max={totalSquares - 1}
            disabled={gameStarted}
          />
        </div>

        {gameStarted && (
          <>
            <p className="-mb-3 text-sm font-semibold text-foreground/50">
              Multiplier: {multiplier}x
            </p>
            <div className="flex w-full flex-row items-center justify-between rounded-lg bg-background p-2">
              <p className="font-semibold">
                {potentialProfit ? potentialProfit : "0.00"}
              </p>
              <img src="/assets/images/chip.png" className="h-4 w-4" alt="" />
            </div>
          </>
        )}

        <button
          className="btn w-full rounded-lg bg-primary px-4 py-4 text-white disabled:bg-gray-500 disabled:opacity-50"
          onClick={handleBetPlaced}
          disabled={!canPlaceBet() || gameStarted}
        >
          Place Bet
        </button>

        {gameStarted && (
          <button
            className="btn mt-2 w-full rounded-lg bg-green-500 px-4 py-4 text-white"
            onClick={handleWithdraw}
          >
            Cashout
          </button>
        )}

        {message && (
          <>
            <pre className="mt-4 whitespace-pre-wrap text-primary">
              {message}
            </pre>
          </>
        )}
        <div
          id="adsterra-ad"
          className="mt-4 rounded-lg bg-background p-4"
        ></div>
      </div>

      {/* Right side */}
      <div className="flex min-h-[750px] w-3/4 flex-col items-center justify-center bg-background p-4">
        <div className="grid grid-cols-5 gap-2">
          {grid.map((row, rowIndex) =>
            row.map((square, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                revealed={square.revealed}
                hasMine={square.hasMine}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                gameStarted={gameStarted}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
