"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Login from "../auth-component/signin";
import { ThemeToggle } from "../layout/theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useGetUserQuery } from "@/features/profileApi/profileApi";
import Cookies from "js-cookie";
import { userAgentFromString } from "next/server";

export default function Navbar() {
  const router = useRouter();
  const { data: user, isLoading } = useGetUserQuery();
  const [logout] = useLogoutMutation();
  const token = Cookies.get("access_token");
  console.log(user);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      Cookies.remove("access_token");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-blue-600 text-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-boxes"
              >
                <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
                <path d="m7 16.5-4.74-2.85" />
                <path d="m7 16.5 5-3" />
                <path d="M7 16.5v5.17" />
                <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
                <path d="m17 16.5-5-3" />
                <path d="m17 16.5 4.74-2.85" />
                <path d="M17 16.5v5.17" />
                <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
                <path d="M12 8 7.26 5.15" />
                <path d="m12 8 4.74-2.85" />
                <path d="M12 13.5V8" />
              </svg>
              Project-HUB
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Projects
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <ThemeToggle />
            {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      {!isLoading && (
                        <>
                          <AvatarImage
                            src={user?.data?.imageUrl || ""}
                            alt={user?.data?.fullName || ""}
                          />
                          <AvatarFallback>
                            {user?.data?.fullName?.[0] || ""}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user?.data?.fullName || "Loading..."}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.data?.email || "Loading..."}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/home">
                    <DropdownMenuItem className="text-foreground cursor-pointer">
                      Home
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="text-foreground cursor-pointer"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
                    Login
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <Login />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
