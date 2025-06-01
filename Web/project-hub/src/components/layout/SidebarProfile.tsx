"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useGetUserQuery } from "@/features/profileApi/profileApi";

const SidebarProfile = () => {
  const { data: user, isLoading } = useGetUserQuery();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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

            <span className="text-xl font-bold text-blue-500">Project-HUB</span>
          </Link>
        </div>
      </div>

      <div className="">
        <Link
          className="flex items-center gap-3 rounded-lg bg-accent p-3"
          href="/profile"
        >
          <Avatar className="h-10 w-10 border-2 border-green-500">
            <AvatarImage src={user?.data?.imageUrl} alt="Dawit Getachew" />
            <AvatarFallback>{user?.data?.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sidebar-foreground">
              {user?.data?.fullName}
            </span>
            <span className="text-sm text-secondary-foreground">{user?.data?.role}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SidebarProfile;
