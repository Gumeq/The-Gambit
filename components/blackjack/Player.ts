// components/Player.ts
import { Card } from "./Card";

export class Player {
  public hand: Card[] = [];
  public bet: number = 0;
  public balance: number = 1000;

  public addCard(card: Card) {
    this.hand.push(card);
  }

  public calculateHandValue(): number {
    let total = 0;
    let aces = 0;

    for (const card of this.hand) {
      total += card.value;
      if (card.rank === "A") aces += 1;
    }

    // Adjust for Aces
    while (total > 21 && aces) {
      total -= 10;
      aces -= 1;
    }

    return total;
  }

  public resetHand() {
    this.hand = [];
  }

  // Add this clone method
  public clone(): Player {
    const cloned = new Player();
    cloned.hand = [...this.hand];
    cloned.bet = this.bet;
    cloned.balance = this.balance;
    return cloned;
  }
}
