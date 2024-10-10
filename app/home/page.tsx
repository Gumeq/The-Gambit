import React from "react";
import CategorySelect from "./category_select";

const Page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      {/* Promotional Sections */}
      <div className="grid w-full grid-cols-2 gap-8">
        <div className="h-64 w-full overflow-hidden rounded-3xl bg-purple-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl">
          <div className="relative flex h-full w-full flex-grow flex-row">
            <img
              src="/assets/images/calendar.png"
              alt=""
              className="absolute -top-[50%] right-0 aspect-[1/1] h-[200%] w-auto"
            />
            <div className="z-10 flex w-1/2 flex-col gap-4">
              <div className="flex items-center gap-4 rounded-lg bg-black/20 p-2 font-bold">
                <img
                  src="/assets/icons/bolt.svg"
                  alt=""
                  className="rounded-md bg-black/20 p-2"
                />
                <p>DAILY</p>
              </div>
              <h2 className="text-4xl font-bold">COLLECT BONUS EVERYDAY</h2>
            </div>
          </div>
        </div>
        <div className="h-64 w-full overflow-hidden rounded-3xl bg-green-600 p-8 shadow-[inset_0_0_50px_10px_rgba(255,255,255,0.1)] drop-shadow-xl">
          <div className="relative flex h-full w-full flex-grow flex-row">
            <img
              src="/assets/images/money.png"
              alt=""
              className="absolute -top-[50%] right-0 aspect-[1/1] h-[200%] w-auto"
            />
            <div className="z-10 flex w-1/2 flex-col gap-4">
              <div className="flex items-center gap-4 rounded-lg bg-black/20 p-2 font-bold">
                <img
                  src="/assets/icons/dollar.svg"
                  alt=""
                  className="rounded-md bg-black/20 p-2"
                />
                <p>BONUS</p>
              </div>
              <h2 className="text-4xl font-bold">10000 WELCOME BONUS</h2>
            </div>
          </div>
        </div>
      </div>

      {/* CategorySelect component with selection logic */}
      <CategorySelect />
    </div>
  );
};

export default Page;
