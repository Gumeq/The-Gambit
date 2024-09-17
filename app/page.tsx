import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-row gap-8">
        <Link
          href={"/wheel"}
          className="h-64 w-full overflow-hidden rounded-xl bg-yellow-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl"
        >
          <div className="flex h-full w-full items-center">
            <h2 className="z-10 w-1/2 text-4xl font-bold">WHEEL OF FORTUNE</h2>
            <img
              src="/assets/images/roulette.png"
              alt=""
              className="opacity-80"
            />
          </div>
        </Link>
        <Link
          href={"/dice"}
          className="h-64 w-full overflow-hidden rounded-xl bg-red-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl"
        >
          <div className="flex h-full w-full items-center">
            <h2 className="z-10 w-1/2 text-4xl font-bold">DICE</h2>
            <img src="/assets/images/dice.png" alt="" className="opacity-80" />
          </div>
        </Link>
        <Link
          href={"/poker"}
          className="h-64 w-full overflow-hidden rounded-xl bg-green-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl"
        >
          <div className="flex h-full w-full items-center">
            <h2 className="z-10 w-1/2 text-4xl font-bold">POKER</h2>
            <img
              src="/assets/images/chip_stack.png"
              alt=""
              className="opacity-80"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default page;
