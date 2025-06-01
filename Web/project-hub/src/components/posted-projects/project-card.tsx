"use client";
import { Project } from "@/type/project";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetUsersQuery } from "@/features/usersApi/usersApi";
import { profileType } from "@/type/profile";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { useLikeProjectMutation } from "@/features/getProjectsApi/getProjectsApi";
import Link from "next/link";
import { useGetUserQuery } from "@/features/profileApi/profileApi";
import { usePathname } from "next/navigation";

export default function ProjectCard({ project }: { project: Project }) {
  const { data: user } = useGetUsersQuery();
  const { data: profile } = useGetUserQuery();
  const [likeProject] = useLikeProjectMutation();
  const userData = user as profileType[];
  const teamMembers = project?.teamMembers;
  const pathname = usePathname();
  const isDetailHome = pathname.includes("/home");

  const isLiked = project?.likes?.includes(profile?.data?._id || "");

  const handleLike = () => {
    if (project?._id && profile?.data?._id) {
      likeProject({
        projectId: project._id,
        userId: profile.data._id,
      });
    }
  };

  const getTeamMemberData = (memberId: string) => {
    if (!Array.isArray(userData)) return null;
    return userData?.find((user) => user._id === memberId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border dark:border-gray-700">
      <Link
        href={`/${isDetailHome ? "home/project-detail" : "project-detail"}/${
          project?._id
        }`}
        className=""
      >
        <div className="bg-gray-200 dark:bg-gray-700 h-[200px] flex items-center justify-center relative overflow-hidden">
          <Image
            src={project?.coverImage || "/placeholder-project.jpg"}
            alt={project?.title || "Project cover"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 dark:text-gray-100 truncate">
          {project?.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 truncate">
          {project?.elevatorPitch}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                className="transition-colors hover:scale-110"
              >
                <ThumbsUp
                  className={`h-4 w-4 ${
                    isLiked
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {project?.likes?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {project?.comments.length}
              </span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {teamMembers?.map((member) => {
              const memberData = getTeamMemberData(member.id);
              return (
                <div
                  key={member.id}
                  className="relative w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
                >
                  {" "}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={memberData?.imageUrl}
                          alt={member.name}
                        />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="text-white bg-slate-500 w-fit px-2 py-1">
                      <div>{member.name}</div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
