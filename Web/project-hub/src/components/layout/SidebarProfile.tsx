'use client';
import { Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const SidebarProfile = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-500">Project-HUB</span>
        </div>
      </div>

      <div className="">
        <Link
          className="flex items-center gap-3 rounded-lg bg-accent p-3"
          href="/profile"
        >
          <Avatar className="h-10 w-10 border-2 border-green-500">
            <AvatarImage src="/" alt="Dawit Getachew" />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sidebar-foreground">Dawit Getachew</span>
            <span className="text-sm text-secondary-foreground">student</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SidebarProfile;
