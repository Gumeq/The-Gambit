// components/Deck.ts

import { Card } from "./Card";
import { RANKS, SUITS } from "./utils/constants";

export class Deck {
  private cards: Card[] = [];

  constructor(numDecks: number = 1) {
    this.initializeDeck(numDecks);
    this.shuffle();
  }

  private initializeDeck(numDecks: number) {
    for (let i = 0; i < numDecks; i++) {
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          const value = this.getCardValue(rank);
          this.cards.push({ suit, rank, value });
        }
      }
    }
  }

  private getCardValue(rank: string): number {
    if (rank === "A") return 11;
    if (["J", "Q", "K"].includes(rank)) return 10;
    return parseInt(rank);
  }

  public shuffle() {
    // Implementing Fisher-Yates Shuffle Algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  public draw(): Card {
    return this.cards.pop()!;
  }
}
