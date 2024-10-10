"use client";
import React, { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "../theme/ThemeSwitchButton";
import { useAuth } from "../providers/auth-provider";
import UserBalance from "../user/user-balance";
import Link from "next/link";
import ChatIconOutline from "@/public/assets/icons/chat_outline.svg";
import ChatIconFill from "@/public/assets/icons/chat_fill.svg";
import WheelIconFill from "@/public/assets/icons/wheel_fill.svg";
import WheelIconOutline from "@/public/assets/icons/wheel_outline.svg";
import DiceIconFill from "@/public/assets/icons/dice_fill.svg";
import DiceIconOutline from "@/public/assets/icons/dice_outline.svg";
import PokerIconFill from "@/public/assets/icons/poker_chip_fill.svg";
import PokerIconOutline from "@/public/assets/icons/poker_chip_outline.svg";
import BlackjackIconFill from "@/public/assets/icons/cards_fill.svg";
import BlackjackIconOutline from "@/public/assets/icons/cards_outline.svg";
import MinesIconFill from "@/public/assets/icons/bomb_fill.svg";
import MinesIconOutline from "@/public/assets/icons/bomb_outline.svg";
import TowerIconFill from "@/public/assets/icons/tower_fill.svg";
import TowerIconOutline from "@/public/assets/icons/tower_outline.svg";
import DailyIconFill from "@/public/assets/icons/calendar_today_fill.svg";
import DailyIconOutline from "@/public/assets/icons/calendar_today_outline.svg";
import WeeklyIconFill from "@/public/assets/icons/calendar_month_fill.svg";
import WeeklyIconOutline from "@/public/assets/icons/calendar_month_outline.svg";
import LevelIconFill from "@/public/assets/icons/medal_fill.svg";
import LevelIconOutline from "@/public/assets/icons/medal_outline.svg";
import PromoIconFill from "@/public/assets/icons/gift_fill.svg";
import PromoIconOutline from "@/public/assets/icons/gift_outline.svg";
import HomeIconFill from "@/public/assets/icons/home_fill.svg";
import HomeIconOutline from "@/public/assets/icons/home_outline.svg";
import CalculateIconFill from "@/public/assets/icons/calculate_fill.svg";
import CalculateIconOutline from "@/public/assets/icons/calculate_outline.svg";
import HelpIconFill from "@/public/assets/icons/help_fill.svg";
import HelpIconOutline from "@/public/assets/icons/help_outline.svg";
import ShieldIconFill from "@/public/assets/icons/shield_fill.svg";
import ShieldIconOutline from "@/public/assets/icons/shield_outline.svg";
import StatsIconFill from "@/public/assets/icons/analytics_fill.svg";
import StatsIconOutline from "@/public/assets/icons/analytics_outline.svg";
import SendIconFill from "@/public/assets/icons/send_fill.svg";
// import SendIconOutline from "@/public/assets/icons/send_outline.svg";
import TelegramIcon from "@/public/assets/icons/telegram.svg";
import RulesIcon from "@/public/assets/icons/rules_fill.svg";
import PeopleIcon from "@/public/assets/icons/group_fill.svg";
import NavLink from "./nav_link";
import LevelBadge from "../level-badge";
import { incrementUserBalance } from "@/utils/firebase/user-data";

interface NavbarProps {
  children: ReactNode;
}
const Navbar = ({ children }: NavbarProps) => {
  const { userData: user } = useAuth();

  // State to manage chat visibility
  const [isChatVisible, setIsChatVisible] = useState(true);

  // Toggle function for chat visibility
  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
  };

  const handleIncrement = async () => {
    try {
      if (user) {
        await incrementUserBalance(user.id, 100); // Example: Increment by 100, adjust the amount accordingly
      }
    } catch (err) {
      console.error("Error incrementing balance:", err);
    }
  };

  return (
    <nav className="z-50">
      <div className="relative hidden flex-row lg:flex lg:h-svh lg:w-screen">
        <div className="no-scrollbar flex min-w-[250px] flex-col justify-between gap-8 overflow-y-auto border-r-2 bg-background pl-8 pt-8">
          <div className="flex flex-col gap-8">
            <div className="flex w-full flex-col gap-2">
              <h2 className="text-sm text-foreground/50">Main</h2>
              <div className="flex flex-col">
                <NavLink
                  href="/home"
                  iconOutline={HomeIconOutline}
                  iconFill={HomeIconFill}
                  label="Home"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h2 className="text-sm text-foreground/50">Games</h2>
              <div className="flex flex-col">
                <NavLink
                  href="/wheel"
                  iconOutline={WheelIconOutline}
                  iconFill={WheelIconFill}
                  label="Wheel"
                />
                <NavLink
                  href="/dice"
                  iconOutline={DiceIconOutline}
                  iconFill={DiceIconFill}
                  label="Dice"
                />
                <NavLink
                  href="/poker"
                  iconOutline={PokerIconOutline}
                  iconFill={PokerIconFill}
                  label="Poker"
                />
                <NavLink
                  href="/blackjack"
                  iconOutline={BlackjackIconOutline}
                  iconFill={BlackjackIconFill}
                  label="Blackjack"
                />
                <NavLink
                  href="/mines"
                  iconOutline={MinesIconOutline}
                  iconFill={MinesIconFill}
                  label="Mines"
                />
                <NavLink
                  href="/tower"
                  iconOutline={TowerIconOutline}
                  iconFill={TowerIconFill}
                  label="Tower"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h2 className="text-sm text-foreground/50">Bonuses</h2>
              <div className="flex flex-col">
                <NavLink
                  href="/bonus"
                  iconOutline={DailyIconOutline}
                  iconFill={DailyIconFill}
                  label="Daily Bonus"
                />
                <NavLink
                  href="/bonus"
                  iconOutline={WeeklyIconOutline}
                  iconFill={WeeklyIconFill}
                  label="Weekly Bonus"
                />
                <NavLink
                  href="/bonus"
                  iconOutline={LevelIconOutline}
                  iconFill={LevelIconFill}
                  label="Level Bonus"
                />
                <NavLink
                  href="/bonus"
                  iconOutline={PromoIconOutline}
                  iconFill={PromoIconFill}
                  label="Promocode"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h2 className="text-sm text-foreground/50">Other</h2>
              <div className="flex flex-col">
                <NavLink
                  href="/stats"
                  iconOutline={StatsIconOutline}
                  iconFill={StatsIconFill}
                  label="Statistics"
                />
                <NavLink
                  href="/provably-fair"
                  iconOutline={ShieldIconOutline}
                  iconFill={ShieldIconFill}
                  label="Provably Fair"
                />
                <NavLink
                  href="/level-calculator"
                  iconOutline={CalculateIconOutline}
                  iconFill={CalculateIconFill}
                  label="Level Calculator"
                />
                <NavLink
                  href="/support"
                  iconOutline={HelpIconOutline}
                  iconFill={HelpIconFill}
                  label="Support"
                />
              </div>
            </div>
          </div>
          <div className="mb-8 w-full pr-8">
            <div className="flex w-full items-center justify-center rounded-lg bg-foreground/10 py-2">
              <div className="relative flex flex-row items-center gap-4 opacity-50">
                <TelegramIcon className="h-6 w-6 text-foreground" />
                <p className="text-sm font-semibold">Telegram</p>
              </div>
            </div>
          </div>
        </div>
        <div className="no-scrollbar w-full overflow-y-auto bg-foreground/5">
          <div className="mb-8 h-20 w-full bg-background">
            <div className="h-full w-full border-b-2 bg-foreground/5">
              <div className="mx-auto flex h-full w-full max-w-7xl flex-row justify-between py-4">
                <Link
                  href={"/"}
                  className="relative flex h-full items-center justify-center"
                >
                  <h1 className="text-xl font-bold">SPINVIBE</h1>
                </Link>
                {user ? (
                  <div className="flex h-full flex-row items-center gap-2 rounded-xl bg-foreground/10 font-bold">
                    <img
                      src="/assets/images/chip.png"
                      className="ml-4 h-4 w-4"
                      alt=""
                    />
                    <div className="min-w-12">
                      <UserBalance />
                    </div>
                    <div className="h-full w-4"></div>
                    <div
                      className="flex h-full cursor-pointer items-center rounded-lg bg-primary px-4"
                      onClick={handleIncrement}
                    >
                      Cashier
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
                {user ? (
                  <div className="flex h-full flex-row items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-full">
                        <div className="flex h-full flex-row items-center gap-4 overflow-hidden rounded-lg bg-foreground/10 drop-shadow-md">
                          <img
                            src={user.photoURL}
                            alt=""
                            className="aspect-[1/1] h-full"
                          />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={"/profile"}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Deposit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ModeToggle />
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <LevelBadge exp={user.exp}></LevelBadge>
                    <div
                      className="z-10 flex aspect-[1/1] h-full cursor-pointer items-center justify-center rounded-lg bg-primary/30 drop-shadow-lg"
                      onClick={toggleChat} // Toggle chat on click
                    >
                      {isChatVisible ? (
                        <ChatIconFill className="h-6 w-6 text-primary" />
                      ) : (
                        <ChatIconOutline className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </div>
                ) : (
                  <Link href={"/auth/signin"}>No user</Link>
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto min-h-screen w-full max-w-7xl overflow-x-hidden">
            {children}
          </div>
          <footer className="mt-20 border-t-2 py-8 text-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-between md:flex-row">
                {/* Left side: Links */}
                <div className="mb-4 md:mb-0">
                  <Link
                    href="/terms"
                    className="mx-2 text-gray-400 hover:text-white"
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/privacy"
                    className="mx-2 text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/about"
                    className="mx-2 text-gray-400 hover:text-white"
                  >
                    About Us
                  </Link>
                </div>

                {/* Right side: Social Media */}
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    className="text-gray-400 hover:text-white"
                  ></a>
                  <a
                    href="https://twitter.com"
                    className="text-gray-400 hover:text-white"
                  ></a>
                  <a
                    href="https://instagram.com"
                    className="text-gray-400 hover:text-white"
                  ></a>
                </div>
              </div>

              <div className="mt-6 text-center text-gray-400">
                © 2024 Gumeq. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
        {isChatVisible && (
          <div className="flex max-h-screen min-w-[350px] flex-col border-l-2 bg-background">
            <div className="flex min-h-20 w-full flex-col border-b-2 p-4">
              <div className="flex h-full w-full flex-row gap-8">
                <Link
                  href={"/chat-rules"}
                  className="flex h-full w-min flex-row items-center gap-4 rounded-lg bg-foreground/5 p-2 pr-4"
                >
                  <RulesIcon className="h-6 w-6 text-foreground/50" />
                  <p className="text-sm font-semibold">Rules</p>
                </Link>
                <div className="flex h-full w-min flex-row items-center gap-2">
                  <PeopleIcon className="h-6 w-6 text-primary" />
                  <p className="text-sm">420</p>
                </div>
              </div>
            </div>
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <h3 className="text-lg font-semibold">Chat</h3>
              <h3 className="opacity-50">(Coming soon)</h3>
            </div>
            <div className="flex min-h-20 w-full flex-row items-center justify-between border-t-2 p-4">
              <div></div>
              <div className="flex aspect-[1/1] h-full items-center justify-center rounded-lg bg-foreground/5">
                <SendIconFill className="-rotate-45"></SendIconFill>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
