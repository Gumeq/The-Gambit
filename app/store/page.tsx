import PicturesStore from "@/components/prof-pics-test";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-lg font-semibold">Profile Pictures</h3>
        <PicturesStore></PicturesStore>
      </div>
    </div>
  );
};

export default page;
