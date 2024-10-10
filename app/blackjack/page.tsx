import Game from "@/components/blackjack/Game";
// import BlackjackStrategyCard from "@/components/blackjack/strategy-card";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <Game></Game>
      {/* <BlackjackStrategyCard></BlackjackStrategyCard> */}
      <div className="w-full rounded-lg bg-background p-4">
        <h1 className="text-2xl font-bold">What is Blackjack?</h1>
        <p className="text-base font-medium">
          Blackjack is one of the most popular online casino games offered at
          SpinVibe.com. The objective of Blackjack is to get a hand as close to
          21 as possible, beating the dealer in the process. Winning with a
          standard hand pays 1:1, while winning with a Blackjack (an Ace plus a
          10 or face card) pays 3:2.
        </p>
        <p className="text-base font-medium">
          At SpinVibe, we offer a variety of Blackjack games, with our original
          version being one of the top choices among players!
        </p>

        <h2 className="mt-4 text-xl font-bold">
          How to Play Blackjack Online at SpinVibe
        </h2>
        <p className="text-base font-medium">
          Playing Blackjack and other table games at SpinVibe.com is simple.
          Start by creating an account and depositing your preferred currency or
          cryptocurrency.
        </p>
        <p className="text-base font-medium">
          Once seated at a Blackjack table, you&apos;ll place your bets and
          decide whether to &quot;stand&quot; (keep your current cards) or
          &quot;hit&quot; (receive another card). You can stand with any hand
          valued at 21 or less, but the key is balancing risk—hit too often, and
          you may bust, exceeding 21.
        </p>
        <p className="text-base font-medium">
          Knowing when to hit or stand is essential for your Blackjack strategy
          and can help you win more often against the dealer.
        </p>

        <h2 className="mt-4 text-xl font-bold">Basic Rules of Blackjack</h2>
        <p className="text-base font-medium">
          While Blackjack revolves around aiming for 21, there are a few
          additional rules to keep in mind:
        </p>
        <ul className="ml-6 list-disc text-base font-medium">
          <li>
            <strong>Hit or Stand:</strong> With each hand, you must choose
            whether to hit or stand.
          </li>
          <li>
            <strong>Split:</strong> If your first two cards form a pair (e.g.,
            two 5s), you can choose to split them into two separate hands. To
            split, you must place an additional bet equal to your original
            wager.
          </li>
          <li>
            <strong>Double Down:</strong> This option allows you to double your
            bet in exchange for just one more card. Though risky, it can
            increase your potential payout if you&apos;re confident about your
            hand.
          </li>
          <li>
            <strong>Insurance:</strong> If the dealer&apos;s face-up card is an
            Ace, you can place an insurance bet, betting that the dealer will
            hit Blackjack. If correct, you win 2:1 on your insurance bet.
          </li>
        </ul>

        <h2 className="mt-4 text-xl font-bold">
          Blackjack Betting Options & Bet Sizes
        </h2>
        <p className="text-base font-medium">
          After adding funds to your SpinVibe account, you can select your
          desired bet size for each hand. Since standard Blackjack hands pay out
          1:1, your stake determines the amount you can win.
        </p>

        <h2 className="mt-4 text-xl font-bold">
          Blackjack Payouts & House Edge
        </h2>
        <p className="text-base font-medium">
          Our Blackjack games feature one of the industry&apos;s lowest house
          edges at 0.57%, meaning the theoretical return to player (RTP) is
          99.43%. For payouts, standard hands that beat the dealer pay 1:1,
          while Blackjack pays 3:2. Insurance bets pay out 2:1.
        </p>

        <h2 className="mt-4 text-xl font-bold">Blackjack Strategies & Tips</h2>
        <p className="text-base font-medium">
          While luck influences every hand, having a basic strategy is key to
          playing Blackjack effectively. Here are some helpful tips:
        </p>
        <ul className="ml-6 list-disc text-base font-medium">
          <li>
            It&apos;s smart to stand on a hand of 17 or higher, as going bust
            will guarantee a loss.
          </li>
          <li>
            Always evaluate the dealer&apos;s visible card before deciding your
            next move. If the dealer shows a card between 7 and Ace, they likely
            have a strong hand, which should influence your play.
          </li>
          <li>
            Aces and 8s are good pairs to split since they increase your chances
            of drawing a 10 on the next card.
          </li>
          <li>
            After doubling down, you&apos;re only dealt one more card, so make
            sure it&apos;s a good situation to use this option.
          </li>
        </ul>

        <p className="mt-4 text-base font-medium">
          For more detailed help, check out our guides on how to play Blackjack
          at SpinVibe, as well as our online casino and table game guides,
          designed to assist new players in mastering Blackjack.
        </p>
      </div>
    </div>
  );
};
export default page;
