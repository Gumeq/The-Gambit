import Game from "@/components/mines/Game";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <Game></Game>
      <div className="w-full rounded-lg bg-background p-4">
        <p>
          Join in on the excitement with one of our most popular and cherished
          games! Inspired by the classic Minesweeper, SpinVibe&apos;s Mines game
          invites you to reveal gems while steering clear of the bombs to
          increase your payout multiplier.
        </p>

        <p>
          Mines is a grid-based gambling game of chance developed by SpinVibe,
          where players navigate the grid to uncover gems while avoiding bombs.
          The game takes place on a 5x5 grid where players can flip tiles,
          revealing either a gem or a bomb.
        </p>

        <p>
          Finding gems boosts your payout multiplier, allowing players to
          continue by selecting more tiles, picking a random tile, or cashing
          out. However, revealing a bomb will end the round and result in a lost
          wager.
        </p>

        <p>
          With the ability to adjust the number of mines, use autobet, and cash
          out anytime, the experience that SpinVibe Mines delivers is unmatched
          by any online casino!
        </p>

        <h3 className="text-lg font-semibold">Mines Gameplay</h3>

        <p>
          Players begin by setting their bet amount and the number of mines they
          want on the field, which can range between 1 and 24. There are 25
          tiles, randomly distributed with either gems or mines.
        </p>

        <p>
          The gameplay mirrors the classic Minesweeper, with random placements
          of mines and gems, but with betting mechanics.
        </p>

        <h3 className="text-lg font-semibold">Adjusting the Number of Mines</h3>

        <p>
          The number of mines chosen influences the payout multiplier and the
          volatility of the game. More mines increase the chances of the round
          ending, but also make the gameplay more thrilling with bigger
          potential payouts.
        </p>

        <p>
          The number of mines reflects the player&apos;s risk appetite and
          willingness to endure volatility in exchange for bigger rewards. After
          setting the bet and number of mines, players click any number of tiles
          to reveal their contents. Finding a mine ends the round, but
          collecting more gems allows them to keep playing.
        </p>

        <h3 className="text-lg font-semibold">Cash Out or Keep Playing</h3>

        <p>
          As players collect gems and avoid mines, the betting interface
          updates, showing the &quot;Total Profit&quot; for the current round.
          This information helps players assess the risk and decide whether to
          cash out or continue mining for more profits!
        </p>
      </div>
    </div>
  );
};

export default page;
