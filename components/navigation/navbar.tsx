"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { ReactNode } from "react";
import { ModeToggle } from "../theme/ThemeSwitchButton";
import { useAuth } from "../providers/auth-provider";
import UserBalance from "../user/user-balance";
import Link from "next/link";
import { getLevelAndProgress, getLevelColor } from "@/utils/constants";

interface NavbarProps {
  children: ReactNode;
}
function hexToRgba(hex: string, opacity: number) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const Navbar = ({ children }: NavbarProps) => {
  const { userData: user } = useAuth();
  const { level, progressPercent } = getLevelAndProgress(user?.exp);
  const levelColor = getLevelColor(level);
  const tailwindLevelColor = `border-[levelColor] `;
  const backgroundColorWithOpacity = hexToRgba(levelColor, 0.5);
  return (
    <nav className="z-50">
      <div
        className={`fixed top-0 z-10 hidden h-20 w-screen items-center justify-center bg-background drop-shadow-lg lg:flex`}
      >
        <div className="flex h-full w-full flex-row items-center justify-between overflow-hidden bg-foreground/5 p-4">
          <Link
            href={"/"}
            className="relative flex h-full items-center justify-center"
          >
            <h1 className="mx-8 text-xl font-bold">THE GAMBIT</h1>
            {/* <div className="gradient-line absolute bottom-0 h-1 w-full opacity-80"></div> */}
          </Link>
          {user ? (
            <div className="flex h-full flex-row items-center gap-4">
              <div className="flex h-full flex-row items-center gap-2 rounded-xl bg-foreground/10 p-1 font-bold drop-shadow-md">
                <img
                  src="/assets/images/chip.png"
                  className="ml-2 h-4 w-4"
                  alt=""
                />
                <UserBalance></UserBalance>
                <div className="h-full w-4"></div>
                <div className="flex h-full items-center rounded-lg bg-primary px-4">
                  Cashier
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="h-full">
                  <div className="flex h-full flex-row items-center gap-4 rounded-xl bg-foreground/10 p-1 drop-shadow-md">
                    <img
                      src={user.photoURL}
                      alt=""
                      className={`aspect-[1/1] h-full rounded-lg`}
                    />
                    <div className="flex h-full flex-row items-center justify-center gap-2">
                      <div
                        className="flex rounded-md border px-2 py-1 text-xs"
                        style={{
                          borderColor: levelColor,
                          backgroundColor: backgroundColorWithOpacity,
                        }}
                      >
                        {level} LVL
                      </div>
                      <p className="font-semibold">{user?.displayName}</p>
                    </div>

                    <div className="z-10 aspect-[1/1] h-full rounded-lg bg-foreground/5 drop-shadow-lg"></div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Deposit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ModeToggle></ModeToggle>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="z-10 aspect-[1/1] h-full rounded-xl bg-foreground/5 drop-shadow-lg"></div>
              <div className="z-10 aspect-[1/1] h-full rounded-xl bg-foreground/5 drop-shadow-lg"></div>
            </div>
          ) : (
            <Link href={"/auth/signin"}>No user</Link>
          )}
        </div>
      </div>
      <div className="relative hidden flex-row lg:flex lg:h-svh lg:w-screen">
        <div className="mt-16 min-w-[300px] bg-background">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-foreground/5 opacity-50">
            <h2 className="text-4xl font-bold">GAMES</h2>
            <h3>(coming soon)</h3>
          </div>
        </div>
        <div className="no-scrollbar mt-20 w-full overflow-y-auto overflow-x-hidden p-8">
          {children}
        </div>
        <div className="mt-20 min-w-[300px] bg-background">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-foreground/5 opacity-50">
            <h2 className="text-4xl font-bold">CHAT</h2>
            <h3>(coming soon)</h3>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
