"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "./theme-toggler";
import { Notifications } from "./notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger className="-ml-1" />

      <div className="flex items-center gap-4">
        <Notifications />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src="/" alt="dawit getachew" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  Dawit Getachew
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  dawitgetachew@gmail.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="text-foreground">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="text-foreground">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
