"use client";

import React, { useState } from "react";
import CategoryButton from "./category_button";
import LobbyIconFill from "@/public/assets/icons/grid_fill.svg";
import LobbyIconOutline from "@/public/assets/icons/grid_outline.svg";
import OriginalIconFill from "@/public/assets/icons/original_fill.svg";
import OriginalIconOutline from "@/public/assets/icons/original_outline.svg";
import SlotsIconFill from "@/public/assets/icons/fruit_fill.svg";
import SlotsIconOutline from "@/public/assets/icons/fruit_outline.svg";
import FavIconFill from "@/public/assets/icons/heart_fill.svg";
import FavIconOutline from "@/public/assets/icons/heart_outline.svg";

const CategorySelect = () => {
  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState("Lobby");

  // Render content based on selected category
  const renderContent = () => {
    switch (selectedCategory) {
      case "Lobby":
        return (
          <div className="h-[2000px] w-full bg-red-400">Lobby Content</div>
        );
      case "Gambit Originals":
        return (
          <div className="h-64 w-full bg-green-400">
            Gambit Originals Content
          </div>
        );
      case "Slots":
        return <div className="h-64 w-full bg-blue-400">Slots Content</div>;
      case "Favorites":
        return (
          <div className="h-64 w-full bg-yellow-400">Favorites Content</div>
        );
      default:
        return <div className="h-64 w-full bg-gray-400">Default Content</div>;
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Category Selection */}
      <div className="relative z-10 flex w-full flex-row gap-4 overflow-x-auto">
        <CategoryButton
          selected={selectedCategory === "Lobby"}
          iconFill={LobbyIconFill}
          iconOutline={LobbyIconOutline}
          label="Lobby"
          onClick={() => setSelectedCategory("Lobby")}
        />
        <CategoryButton
          selected={selectedCategory === "Gambit Originals"}
          iconFill={OriginalIconFill}
          iconOutline={OriginalIconOutline}
          label="Gambit Originals"
          onClick={() => setSelectedCategory("Gambit Originals")}
        />
        <CategoryButton
          selected={selectedCategory === "Slots"}
          iconFill={SlotsIconFill}
          iconOutline={SlotsIconOutline}
          label="Slots"
          onClick={() => setSelectedCategory("Slots")}
        />
        <CategoryButton
          selected={selectedCategory === "Favorites"}
          iconFill={FavIconFill}
          iconOutline={FavIconOutline}
          label="Favorites"
          onClick={() => setSelectedCategory("Favorites")}
        />
      </div>

      {/* Render content based on selected category */}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default CategorySelect;
