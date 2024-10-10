import DailyBonus from "@/components/bonus/daily-bonus";
import WeeklyBonus from "@/components/bonus/weekly-bonus";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <DailyBonus></DailyBonus>
      <WeeklyBonus></WeeklyBonus>
    </div>
  );
};

export default page;
