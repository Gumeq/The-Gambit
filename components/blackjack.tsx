"use client";
import { createDeck } from "@/utils/constants";
import React, { useState, useEffect } from "react";
import CardDisplay from "./card";
import CardDisplayFaceDown from "./card-face-down";

export type Card = {
  name: string;
  value: number;
  suit: string;
};

type PlayerHand = {
  cards: Card[];
  isStand: boolean;
  isBusted: boolean;
  isDoubleDown: boolean;
  result?: string; // 'Win', 'Lose', 'Draw'
};

const calculateHandValue = (hand: Card[]) => {
  let value = hand.reduce((acc, card) => acc + card.value, 0);
  let aces = hand.filter((card) => card.name === "A").length;

  // Handle Aces (can be 1 or 11)
  while (value > 21 && aces) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

const BlackjackGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHands, setPlayerHands] = useState<PlayerHand[]>([]); // Multiple hands
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isInsuranceOffered, setIsInsuranceOffered] = useState(false); // Insurance flag
  const [insuranceBet, setInsuranceBet] = useState(false); // Whether the player took insurance
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null); // Overall winner message

  useEffect(() => {
    startGame();
  }, []);

  // Function to draw a card and update the deck state
  const drawCard = (): Card | null => {
    if (deck.length === 0) {
      console.error("Deck is empty!");
      return null;
    }
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);
    return card;
  };

  const startGame = () => {
    const newDeck = createDeck();
    shuffleDeck(newDeck);

    const initialPlayerHand = [newDeck.pop()!, newDeck.pop()!];
    const initialDealerHand = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHands([
      {
        cards: initialPlayerHand,
        isStand: false,
        isBusted: false,
        isDoubleDown: false,
      },
    ]);
    setDealerHand(initialDealerHand);
    setGameOver(false);
    setIsInsuranceOffered(false);
    setInsuranceBet(false); // Reset insurance bet
    setWinnerMessage(null);

    const playerTotal = calculateHandValue(initialPlayerHand);
    const dealerTotal = calculateHandValue(initialDealerHand);

    // Check for Blackjack on both sides
    if (playerTotal === 21) {
      if (dealerTotal === 21) {
        // Both have Blackjack, it's a draw
        setGameOver(true);
        setWinnerMessage("It's a Draw! Both have Blackjack.");
      } else {
        // Player wins with Blackjack
        setGameOver(true);
        setWinnerMessage("Player wins with Blackjack!");
      }
    } else if (initialDealerHand[0].name === "A") {
      // Offer insurance if the dealer's face-up card is an Ace
      setIsInsuranceOffered(true);
    } else if (dealerTotal === 21) {
      // Dealer wins with Blackjack
      setGameOver(true);
      setWinnerMessage("Dealer wins with Blackjack!");
    }
  };

  // Shuffle deck function
  const shuffleDeck = (deck: Card[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  };

  // Player actions
  const playerHit = (handIndex: number) => {
    if (!gameOver) {
      const newCard = drawCard();
      if (newCard) {
        setPlayerHands((prevHands) => {
          const hands = [...prevHands];
          const hand = { ...hands[handIndex] };
          if (!hand.isStand && !hand.isBusted) {
            hand.cards = [...hand.cards, newCard];
            const handTotal = calculateHandValue(hand.cards);
            if (handTotal > 21) {
              hand.isBusted = true;
            }
            hands[handIndex] = hand;
          }
          // Check if all hands are done
          if (hands.every((h) => h.isStand || h.isBusted)) {
            dealerTurn(hands);
          }
          return hands;
        });
      }
    }
  };

  const playerStand = (handIndex: number) => {
    setPlayerHands((prevHands) => {
      const hands = [...prevHands];
      hands[handIndex] = { ...hands[handIndex], isStand: true };

      // Check if all hands are done
      if (hands.every((h) => h.isStand || h.isBusted)) {
        dealerTurn(hands);
      }
      return hands;
    });
  };

  const playerDoubleDown = (handIndex: number) => {
    setPlayerHands((prevHands) => {
      const hands = [...prevHands];
      const hand = { ...hands[handIndex] };
      if (!hand.isDoubleDown && hand.cards.length === 2) {
        hand.isDoubleDown = true;
        const newCard = drawCard();
        if (newCard) {
          hand.cards = [...hand.cards, newCard];
          const handTotal = calculateHandValue(hand.cards);
          if (handTotal > 21) {
            hand.isBusted = true;
          }
          hand.isStand = true;
          hands[handIndex] = hand;
        }
        // Check if all hands are done
        if (hands.every((h) => h.isStand || h.isBusted)) {
          dealerTurn(hands);
        }
      }
      return hands;
    });
  };

  const playerSplit = (handIndex: number) => {
    setPlayerHands((prevHands) => {
      const hands = [...prevHands];
      const hand = hands[handIndex];
      if (
        hand.cards.length === 2 &&
        hand.cards[0].value === hand.cards[1].value
      ) {
        // Remove the current hand
        hands.splice(handIndex, 1);

        // Create two new hands
        const firstCard = hand.cards[0];
        const secondCard = hand.cards[1];

        const firstNewCard = drawCard();
        const secondNewCard = drawCard();

        if (firstNewCard && secondNewCard) {
          const newFirstHand: PlayerHand = {
            cards: [firstCard, firstNewCard],
            isStand: false,
            isBusted: false,
            isDoubleDown: false,
          };
          const newSecondHand: PlayerHand = {
            cards: [secondCard, secondNewCard],
            isStand: false,
            isBusted: false,
            isDoubleDown: false,
          };

          // Insert the two new hands at the same index
          hands.splice(handIndex, 0, newSecondHand);
          hands.splice(handIndex, 0, newFirstHand);
        }
      }
      return hands;
    });
  };

  // Dealer's turn
  const dealerTurn = (playerHands: PlayerHand[]) => {
    let dealerTotal = calculateHandValue(dealerHand);
    let newDealerHand = [...dealerHand];
    const newDeck = [...deck];

    while (dealerTotal < 17) {
      const newCard = newDeck.pop();
      if (newCard) {
        newDealerHand = [...newDealerHand, newCard];
        dealerTotal = calculateHandValue(newDealerHand);
      }
    }

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    checkWinners(playerHands, newDealerHand);
  };

  // Check winners for all hands
  const checkWinners = (playerHands: PlayerHand[], dealerHand: Card[]) => {
    const dealerTotal = calculateHandValue(dealerHand);
    const updatedHands = playerHands.map((hand) => {
      const playerTotal = calculateHandValue(hand.cards);
      let result = "";
      if (hand.isBusted) {
        result = "Lose";
      } else if (dealerTotal > 21) {
        result = "Win";
      } else if (playerTotal > dealerTotal) {
        result = "Win";
      } else if (playerTotal < dealerTotal) {
        result = "Lose";
      } else {
        result = "Draw";
      }
      return { ...hand, result };
    });
    setPlayerHands(updatedHands);
    setGameOver(true);
  };

  // Handle Insurance
  const takeInsurance = () => {
    if (!gameOver && isInsuranceOffered) {
      setInsuranceBet(true);

      // Check if dealer has Blackjack
      const dealerTotal = calculateHandValue(dealerHand);
      if (dealerTotal === 21) {
        // Dealer has Blackjack, it's a draw (player wins insurance, loses original bet)
        setGameOver(true);
        setWinnerMessage("Draw with Insurance! Dealer has Blackjack.");
      } else {
        // Dealer does not have Blackjack
        setIsInsuranceOffered(false);
      }
    }
  };

  // Continue game logic when insurance is declined
  const declineInsurance = () => {
    if (!gameOver && isInsuranceOffered) {
      const dealerTotal = calculateHandValue(dealerHand);
      if (dealerTotal === 21) {
        // Dealer has Blackjack, player loses
        setGameOver(true);
        setWinnerMessage("Dealer wins with Blackjack!");
      } else {
        // Dealer doesn't have Blackjack, continue the game normally
        setIsInsuranceOffered(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-5 text-3xl font-bold">Blackjack</h1>

      {/* Dealer's Hand */}
      <div className="mb-4">
        <h2 className="text-xl">Dealer Hand</h2>
        <div className="flex space-x-2">
          {dealerHand.map((card, index) => {
            if (index === 1 && !gameOver && !isInsuranceOffered) {
              return <CardDisplayFaceDown key={index} />;
            }
            return <CardDisplay card={card} key={index} />;
          })}
        </div>
        <p>Total: {gameOver ? calculateHandValue(dealerHand) : `??`}</p>
      </div>

      {/* Offer Insurance */}
      {isInsuranceOffered && !insuranceBet && !gameOver && (
        <div className="mb-4">
          <h2 className="text-xl">Dealer shows an Ace. Insurance?</h2>
          <button
            onClick={takeInsurance}
            className="rounded bg-orange-500 px-4 py-2 text-white"
          >
            Take Insurance
          </button>
          <button
            onClick={declineInsurance}
            className="rounded bg-gray-500 px-4 py-2 text-white"
          >
            Decline Insurance
          </button>
        </div>
      )}

      {/* Player's Hands */}
      <div className="player-hands flex space-x-4">
        {playerHands.map((hand, index) => (
          <div key={index} className="player-hand flex flex-col items-center">
            <h2 className="text-xl">Hand {index + 1}</h2>
            <div className="flex space-x-2">
              {hand.cards.map((card, cardIndex) => (
                <CardDisplay card={card} key={cardIndex} />
              ))}
            </div>
            <p>Total: {calculateHandValue(hand.cards)}</p>

            {/* Hand Controls */}
            {!gameOver &&
              !hand.isStand &&
              !hand.isBusted &&
              !isInsuranceOffered && (
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => playerHit(index)}
                    className="rounded bg-green-500 px-4 py-2 text-white"
                  >
                    Hit
                  </button>
                  <button
                    onClick={() => playerStand(index)}
                    className="rounded bg-blue-500 px-4 py-2 text-white"
                  >
                    Stand
                  </button>
                  {/* Show Split and Double Down Buttons */}
                  {hand.cards.length === 2 && (
                    <>
                      {!hand.isDoubleDown && (
                        <button
                          onClick={() => playerDoubleDown(index)}
                          className="rounded bg-yellow-500 px-4 py-2 text-white"
                        >
                          Double Down
                        </button>
                      )}
                      {hand.cards[0].value === hand.cards[1].value && (
                        <button
                          onClick={() => playerSplit(index)}
                          className="rounded bg-purple-500 px-4 py-2 text-white"
                        >
                          Split
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

            {/* Hand Status */}
            {hand.isBusted && <p className="mt-2 text-red-500">Busted!</p>}
            {hand.isStand && <p className="mt-2">Stand</p>}
            {hand.result && (
              <p className="mt-2">
                Result:{" "}
                <span
                  className={
                    hand.result === "Win"
                      ? "text-green-500"
                      : hand.result === "Lose"
                        ? "text-red-500"
                        : ""
                  }
                >
                  {hand.result}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Game Over Controls */}
      {gameOver && (
        <button
          onClick={startGame}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
        >
          Restart
        </button>
      )}

      {/* Winner Message */}
      {gameOver && winnerMessage && (
        <div className="mt-5">
          <h2 className="text-2xl">{winnerMessage}</h2>
        </div>
      )}
    </div>
  );
};

export default BlackjackGame;
