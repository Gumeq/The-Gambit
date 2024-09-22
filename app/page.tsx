import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="grid w-full grid-cols-3 gap-8">
        <div className="h-64 w-full overflow-hidden rounded-3xl bg-purple-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl">
          <div className="flex h-full w-full flex-grow flex-row items-center justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-lg bg-black/20 p-2 font-bold">
                <img
                  src="/assets/icons/bolt.svg"
                  alt=""
                  className="rounded-md bg-black/20 p-2"
                />
                <p>DAILY</p>
              </div>
              <h2 className="z-10 w-1/2 text-4xl font-bold">
                COLLECT BONUS EVERYDAY
              </h2>
            </div>
            <img
              src="/assets/images/calendar.png"
              alt=""
              className="h-[200%]"
            />
          </div>
        </div>
        <div className="h-64 w-full overflow-hidden rounded-3xl bg-green-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl">
          <div className="flex h-full w-full flex-grow flex-row items-center justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-lg bg-black/20 p-2 font-bold">
                <img
                  src="/assets/icons/dollar.svg"
                  alt=""
                  className="rounded-md bg-black/20 p-2"
                />
                <p>BONUS</p>
              </div>
              <h2 className="z-10 w-1/2 text-4xl font-bold">
                10.000 WELCOME BONUS
              </h2>
            </div>
            <img src="/assets/images/money.png" alt="" className="h-[200%]" />
          </div>
        </div>
        <div className="h-64 w-full overflow-hidden rounded-3xl bg-blue-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl">
          <div className="flex h-full w-full flex-grow flex-row items-center justify-between">
            <div className="flex flex-col gap-4">
              <h2 className="z-10 w-1/2 text-4xl font-bold">
                HIGHER RANKS GAIN MORE
              </h2>
            </div>
            <img src="/assets/images/arrows.png" alt="" className="h-[150%]" />
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-foreground/80">
        Gambit Originals
      </h2>
      <div className="grid w-full grid-cols-6 gap-4">
        <Link
          href={"/wheel"}
          className="relative flex h-64 w-full overflow-hidden rounded-2xl border-2 border-foreground/10 bg-foreground/5 p-4"
        >
          <h2 className="z-10 w-1/2 text-4xl font-bold">WHEEL</h2>
          <img
            src="/assets/images/wheel.png"
            alt=""
            className="absolute -bottom-16 -right-16 h-64 w-64 scale-125"
          />
        </Link>
        <Link
          href={"/dice"}
          className="relative flex h-64 w-full overflow-hidden rounded-2xl border-2 border-foreground/10 bg-foreground/5 p-4"
        >
          <h2 className="z-10 w-1/2 text-4xl font-bold">DICE</h2>
          <img
            src="/assets/images/dice.png"
            alt=""
            className="absolute -bottom-16 -right-16 h-64 w-64 scale-125"
          />
        </Link>
        <Link
          href={"/poker"}
          className="relative flex h-64 w-full overflow-hidden rounded-2xl border-2 border-foreground/10 bg-foreground/5 p-4"
        >
          <h2 className="z-10 w-1/2 text-4xl font-bold">POKER</h2>
          <img
            src="/assets/images/chip_stack.png"
            alt=""
            className="absolute -bottom-16 -right-16 h-64 w-64 scale-125"
          />
        </Link>
        <Link
          href={"/blackjack"}
          className="relative flex h-64 w-full overflow-hidden rounded-2xl border-2 border-foreground/10 bg-foreground/5 p-4"
        >
          <h2 className="z-10 w-1/2 text-4xl font-bold">BLACKJACK</h2>
          <img
            src="/assets/images/cards.png"
            alt=""
            className="absolute -bottom-16 -right-16 h-64 w-64 scale-125"
          />
        </Link>
        <Link
          href={"/mines"}
          className="relative flex h-64 w-full overflow-hidden rounded-2xl border-2 border-foreground/10 bg-foreground/5 p-4"
        >
          <h2 className="z-10 w-1/2 text-4xl font-bold">MINES</h2>
          <img
            src="/assets/images/bomb.png"
            alt=""
            className="absolute -bottom-16 -right-16 h-64 w-64 scale-125"
          />
        </Link>
        <Link
          href={"/tower"}
          className="relative flex h-64 w-full overflow-hidden rounded-2xl border-2 border-foreground/10 bg-foreground/5 p-4"
        >
          <h2 className="z-10 w-1/2 text-4xl font-bold">TOWER</h2>
          <img
            src="/assets/images/tower.png"
            alt=""
            className="absolute -bottom-16 -right-16 h-64 w-64 scale-125"
          />
        </Link>
      </div>
    </div>
  );
};

export default page;
