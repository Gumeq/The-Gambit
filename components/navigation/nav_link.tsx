"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

interface NavLinkProps {
  href: string;
  iconOutline: React.ComponentType<{ className: string }>;
  iconFill: React.ComponentType<{ className: string }>;
  label: string;
}

const NavLink = ({
  href,
  iconOutline: IconOutline,
  iconFill: IconFill,
  label,
}: NavLinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full py-2">
      {isActive ? (
        <div className="relative flex flex-row items-center gap-4">
          <div className="absolute right-0 h-full w-1 bg-primary"></div>
          <IconFill className="h-6 w-6 text-primary" />
          <p className="text-sm font-semibold">{label}</p>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-4 opacity-50">
          <IconOutline className="h-6 w-6 text-foreground" />
          <p className="text-sm font-semibold">{label}</p>
        </div>
      )}
    </Link>
  );
};

export default NavLink;
