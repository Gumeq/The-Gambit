// components/Game.tsx
"use client";

import React, { useState } from "react";
import { Deck } from "./Deck";
import Hand from "./Hand";
import { Card } from "./Card";
import { useAuth } from "../providers/auth-provider";
import {
  decrementUserBalance,
  incrementUserBalance,
} from "@/utils/firebase/user-data";

interface PlayerHand {
  hand: Card[];
  bet: number;
  result?: "win" | "loss" | "push" | "bust";
}

interface Player {
  hand: Card[];
  bet: number;
}

export const calculateHandValue = (hand: Card[]): number => {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === "A") {
      aces += 1;
      total += 11;
    } else if (["K", "Q", "J"].includes(card.rank)) {
      total += 10;
    } else {
      total += parseInt(card.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
};

const Game: React.FC = () => {
  const [deck, setDeck] = useState<Deck>(new Deck(6));
  const { userData, balance } = useAuth();
  const [player, setPlayer] = useState<Player>({
    hand: [] as Card[],
    bet: 0,
  });
  const [dealer, setDealer] = useState<Player>({
    hand: [] as Card[],
    bet: 0,
  });
  const [message, setMessage] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState<boolean>(true);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [playerHands, setPlayerHands] = useState<PlayerHand[]>([]);
  const [currentHandIndex, setCurrentHandIndex] = useState<number>(0);

  // Insurance-related state variables
  const [isInsuranceOffered, setIsInsuranceOffered] = useState<boolean>(false);
  const [insuranceBetAmount, setInsuranceBetAmount] = useState<number>(0);

  // Function to handle starting the game after placing a bet
  const handleStartGame = async () => {
    if (betAmount <= 0) {
      setMessage("Please enter a valid bet amount.");
      return;
    }

    if (
      balance === null ||
      balance === undefined ||
      userData === null ||
      userData === undefined
    ) {
      setMessage("User data not available.");
      return;
    }

    if (betAmount > balance) {
      setMessage("You don't have enough balance to place that bet.");
      return;
    }

    try {
      // Deduct the bet amount from Firestore
      await decrementUserBalance(userData.id, betAmount);

      // Start the game with the bet amount
      await startGame(betAmount);
    } catch (error) {
      setMessage("An error occurred while updating your balance.");
      console.error(error);
    }
  };

  const startGame = async (betAmount: number) => {
    // Reset insurance variables
    setInsuranceBetAmount(0);
    setIsInsuranceOffered(false);

    const newDeck = new Deck(6);
    setDeck(newDeck);

    // Set the player's bet and reset hand
    const newPlayer = {
      ...player,
      bet: betAmount,
      hand: [] as Card[],
    };
    setPlayer(newPlayer);

    // Create a new dealer
    const newDealer = {
      hand: [] as Card[],
      bet: 0,
    };

    // Deal initial cards
    const playerHand: PlayerHand = {
      hand: [newDeck.draw(), newDeck.draw()],
      bet: betAmount,
    };

    newDealer.hand.push(newDeck.draw()); // Dealer's hole card (face down)
    newDealer.hand.push(newDeck.draw()); // Dealer's upcard (face up)

    setPlayerHands([playerHand]);
    setCurrentHandIndex(0);
    setDealer(newDealer);
    setIsGameOver(false);
    setMessage("");

    // Check if dealer's upcard is an Ace and offer insurance
    const dealerUpcard = newDealer.hand[1]; // The second card is the upcard
    if (dealerUpcard.rank === "A") {
      setIsInsuranceOffered(true);
      return; // Wait for player's insurance decision
    } else if (["10", "J", "Q", "K"].includes(dealerUpcard.rank)) {
      // Dealer peeks for blackjack
      await checkForBlackjack();
    } else {
      // Game continues without checking for blackjack
      setMessage("Game started. Your move.");
    }
  };

  const checkForBlackjack = async () => {
    if (
      balance === null ||
      balance === undefined ||
      userData === null ||
      userData === undefined
    ) {
      setMessage("User data not available.");
      return;
    }

    const playerHand = playerHands[currentHandIndex];
    const playerTotal = calculateHandValue(playerHand.hand);

    // Calculate dealer's total only using the hole card and upcard
    const dealerTotal = calculateHandValue(dealer.hand.slice(0, 2));

    const playerHasBlackjack = playerTotal === 21;
    const dealerHasBlackjack = dealerTotal === 21;

    const messageList: string[] = [];

    if (dealerHasBlackjack) {
      // Reveal dealer's hole card
      setIsGameOver(true);

      if (insuranceBetAmount > 0) {
        // Pay out insurance bet at 2:1
        await incrementUserBalance(userData.id, insuranceBetAmount * 2);
        messageList.push("Dealer has Blackjack. You win the insurance bet.");
      } else {
        messageList.push("Dealer has Blackjack.");
      }

      if (playerHasBlackjack) {
        // Push on original bet
        await incrementUserBalance(userData.id, player.bet);
        messageList.push(
          "You also have Blackjack. It's a push on your main bet.",
        );
      } else {
        messageList.push("You lose your main bet.");
      }

      setMessage(messageList.join(" "));
      return;
    } else {
      messageList.push("Dealer does not have Blackjack.");

      if (insuranceBetAmount > 0) {
        // Player loses insurance bet
        messageList.push("You lose the insurance bet.");
      }

      if (playerHasBlackjack) {
        // Player wins with blackjack
        await incrementUserBalance(userData.id, player.bet * 2.5); // Blackjack pays 3:2
        messageList.push("Blackjack! You win!");
        setIsGameOver(true);
        setMessage(messageList.join(" "));
        return;
      }

      setMessage(messageList.join(" "));
      // Game continues as normal
    }
  };

  // Function to handle the player's decision to take insurance
  const handleTakeInsurance = async () => {
    if (userData === null || userData === undefined) {
      setMessage("User data not available.");
      return;
    }

    if (balance === null || balance === undefined) {
      setMessage("Balance not available.");
      return;
    }

    const insuranceAmount = player.bet / 2;

    if (balance < insuranceAmount) {
      setMessage("You don't have enough balance for insurance.");
      setIsInsuranceOffered(false);
      await checkForBlackjack();
      return;
    }

    try {
      // Deduct insurance amount from player's balance
      await decrementUserBalance(userData.id, insuranceAmount);

      setInsuranceBetAmount(insuranceAmount);
      setIsInsuranceOffered(false);

      // Proceed to check for blackjack
      await checkForBlackjack();
    } catch (error) {
      setMessage("An error occurred while placing insurance bet.");
      console.error(error);
    }
  };

  const handleDeclineInsurance = async () => {
    setInsuranceBetAmount(0);
    setIsInsuranceOffered(false);

    // Proceed to check for blackjack
    await checkForBlackjack();
  };

  // Add safety check for accessing playerHands and currentHandIndex
  const isCurrentHandValid = () => {
    return (
      playerHands.length > 0 &&
      currentHandIndex >= 0 &&
      currentHandIndex < playerHands.length
    );
  };

  const isSplittablePair = (hand: Card[]): boolean => {
    // Check if both cards have the same rank
    if (hand[0].rank === hand[1].rank) {
      return true;
    }

    // Check if both cards are in the 10-value group (10, J, Q, K)
    const tenValueRanks = ["10", "J", "Q", "K"];
    return (
      tenValueRanks.includes(hand[0].rank) &&
      tenValueRanks.includes(hand[1].rank)
    );
  };

  // Function to handle the player's "Hit" action
  const handleHit = () => {
    if (!isCurrentHandValid()) return;

    const currentHand = { ...playerHands[currentHandIndex] };
    currentHand.hand.push(deck.draw());

    const newPlayerHands = [...playerHands];
    newPlayerHands[currentHandIndex] = currentHand;
    setPlayerHands(newPlayerHands);

    if (calculateHandValue(currentHand.hand) >= 21) {
      moveToNextPlayerHand();
    }
  };

  // Function to handle the player's "Stand" action
  const handleStand = () => {
    if (!isCurrentHandValid()) return;
    moveToNextPlayerHand();
  };

  // Function to handle "Double Down"
  const handleDoubleDown = async () => {
    if (!isCurrentHandValid()) return;

    const currentHand = { ...playerHands[currentHandIndex] };

    if (currentHand.hand.length !== 2) {
      setMessage("You can only double down on your first two cards.");
      return;
    }

    if (
      balance === null ||
      balance === undefined ||
      userData === null ||
      userData === undefined
    ) {
      setMessage("User data not available.");
      return;
    }

    if (balance < currentHand.bet) {
      setMessage("You don't have enough balance to double down.");
      return;
    }

    try {
      // Deduct balance in Firestore
      await decrementUserBalance(userData.id, currentHand.bet);

      // Double the bet and proceed
      currentHand.bet *= 2;
      currentHand.hand.push(deck.draw());

      const newPlayerHands = [...playerHands];
      newPlayerHands[currentHandIndex] = currentHand;
      setPlayerHands(newPlayerHands);

      moveToNextPlayerHand();
    } catch (error) {
      setMessage("An error occurred while updating your balance.");
      console.error(error);
    }
  };

  // Function to handle "Split"
  const handleSplit = async () => {
    if (!isCurrentHandValid()) return;

    const currentHand = playerHands[currentHandIndex];

    if (currentHand.hand.length !== 2 || !isSplittablePair(currentHand.hand)) {
      setMessage("You can only split when you have a pair or a 10-value pair.");
      return;
    }

    if (
      balance === null ||
      balance === undefined ||
      userData === null ||
      userData === undefined
    ) {
      setMessage("User data not available.");
      return;
    }

    if (balance < currentHand.bet) {
      setMessage("You don't have enough balance to split.");
      return;
    }

    try {
      // Deduct balance in Firestore
      await decrementUserBalance(userData.id, currentHand.bet);

      const firstCard = currentHand.hand[0];
      const secondCard = currentHand.hand[1];

      const hand1: PlayerHand = {
        hand: [firstCard, deck.draw()],
        bet: currentHand.bet,
      };

      const hand2: PlayerHand = {
        hand: [secondCard, deck.draw()],
        bet: currentHand.bet,
      };

      const newPlayerHands = [...playerHands];
      newPlayerHands[currentHandIndex] = hand1;
      newPlayerHands.splice(currentHandIndex + 1, 0, hand2);

      setPlayerHands(newPlayerHands);
    } catch (error) {
      setMessage("An error occurred while updating your balance.");
      console.error(error);
    }
  };

  const moveToNextPlayerHand = () => {
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1);
    } else {
      playDealerHand();
    }
  };

  const playDealerHand = async () => {
    const newDealer = { ...dealer };

    // Reveal dealer's hole card
    setIsGameOver(true);

    while (calculateHandValue(newDealer.hand) < 17) {
      newDealer.hand.push(deck.draw());
    }

    setDealer(newDealer);
    await determineWinners(newDealer);
  };

  const determineWinners = async (dealer: Player) => {
    const dealerTotal = calculateHandValue(dealer.hand);
    const messageList: string[] = [];

    if (userData === null || userData === undefined) {
      setMessage("User data not available.");
      return;
    }

    const updatedPlayerHands = await Promise.all(
      playerHands.map(async (playerHand, index) => {
        const playerTotal = calculateHandValue(playerHand.hand);
        let handResult = "";

        if (playerTotal > 21) {
          handResult = `Hand ${index + 1}: Busted!`;
          playerHand.result = "loss";
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
          handResult = `Hand ${index + 1}: You win!`;
          await incrementUserBalance(userData.id, playerHand.bet * 2);
          playerHand.result = "win";
        } else if (playerTotal < dealerTotal) {
          handResult = `Hand ${index + 1}: Dealer wins!`;
          playerHand.result = "loss";
        } else {
          handResult = `Hand ${index + 1}: Push!`;
          await incrementUserBalance(userData.id, playerHand.bet);
          playerHand.result = "push";
        }

        messageList.push(handResult);
        return { ...playerHand };
      }),
    );

    setPlayerHands(updatedPlayerHands);
    setMessage(messageList.join("\n"));
    setIsGameOver(true);
  };

  // Helper functions to determine if actions are available
  const isGameInProgress = () =>
    !isGameOver && player.bet > 0 && !isInsuranceOffered;

  const isHandActive = (hand: PlayerHand) => calculateHandValue(hand.hand) < 21;

  const canHit = () =>
    isGameInProgress() &&
    isCurrentHandValid() &&
    isHandActive(playerHands[currentHandIndex]);

  const canStand = () => isGameInProgress() && isCurrentHandValid();

  const canDoubleDown = () => {
    if (!isCurrentHandValid()) return false;
    if (balance === null || balance === undefined) return false;
    const currentHand = playerHands[currentHandIndex];
    return (
      isGameInProgress() &&
      currentHand.hand.length === 2 &&
      balance >= currentHand.bet &&
      calculateHandValue(currentHand.hand) < 21
    );
  };

  const canSplit = () => {
    if (!isCurrentHandValid()) return false;
    if (balance === null || balance === undefined) return false;
    const currentHand = playerHands[currentHandIndex];
    return (
      isGameInProgress() &&
      currentHand.hand.length === 2 &&
      isSplittablePair(currentHand.hand) &&
      balance >= currentHand.bet
    );
  };

  const canPlaceBet = () =>
    (isGameOver || player.bet === 0) &&
    balance !== null &&
    balance !== undefined;

  // Main game screen
  return (
    <div className="flex w-full overflow-hidden rounded-lg bg-foreground/5 text-white">
      {/* Left side */}
      <div className="flex w-1/4 flex-col gap-4 p-4">
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
            className="w-full rounded-l bg-background p-2 text-foreground"
            min="1"
            max={
              balance !== null && balance !== undefined ? balance : undefined
            }
            disabled={!canPlaceBet()}
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
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="btn mr-2 w-full rounded-lg bg-primary px-4 py-2 text-white disabled:bg-foreground/10 disabled:opacity-50"
            onClick={handleHit}
            disabled={!canHit()}
          >
            Hit
          </button>
          <button
            className="btn mr-2 w-full rounded-lg bg-primary px-4 py-2 text-white disabled:bg-foreground/10 disabled:opacity-50"
            onClick={handleStand}
            disabled={!canStand()}
          >
            Stand
          </button>
          <button
            className="btn mr-2 w-full rounded-lg bg-primary px-4 py-2 text-white disabled:bg-foreground/10 disabled:opacity-50"
            onClick={handleDoubleDown}
            disabled={!canDoubleDown()}
          >
            Double
          </button>
          <button
            className="btn w-full rounded-lg bg-primary px-4 py-2 text-white disabled:bg-foreground/10 disabled:opacity-50"
            onClick={handleSplit}
            disabled={!canSplit()}
          >
            Split
          </button>
        </div>
        <button
          className="btn w-full rounded-lg bg-primary px-4 py-4 text-white disabled:bg-gray-500 disabled:opacity-50"
          onClick={handleStartGame}
          disabled={!canPlaceBet()}
        >
          Place Bet
        </button>

        {message && (
          <pre className="mt-4 whitespace-pre-wrap text-primary">{message}</pre>
        )}

        {/* Insurance offer */}
        {isInsuranceOffered && (
          <div className="insurance-offer mt-4 rounded-lg bg-foreground/5 p-4">
            <p className="mb-2 text-lg">
              Dealer&apos;s upcard is an Ace. Do you want to take insurance?
            </p>
            <div className="flex gap-2">
              <button
                className="btn w-full rounded-lg bg-primary px-4 py-2 text-white"
                onClick={handleTakeInsurance}
              >
                Yes
              </button>
              <button
                className="btn w-full rounded-lg bg-primary px-4 py-2 text-white"
                onClick={handleDeclineInsurance}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex min-h-[750px] w-3/4 flex-col items-center justify-center bg-background">
        <div className="mt-4 flex justify-center">
          <Hand cards={dealer.hand} hideFirstCard={!isGameOver} />
        </div>

        <div className="mt-8 flex flex-row justify-center gap-8">
          {playerHands.map((playerHand, index) => (
            <div
              key={index}
              className={`${
                index === currentHandIndex &&
                !isGameOver &&
                playerHands.length > 1
                  ? "scale-125"
                  : ""
              } transition-all duration-300 ease-in-out`}
            >
              <Hand cards={playerHand.hand} result={playerHand.result} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
