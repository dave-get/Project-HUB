import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import Image from "next/image";

interface ProjectProps {
  project: {
    id: number;
    title: string;
    description: string;
    likes: number;
    comments: number;
    users: number;
  };
}

export default function ProjectCard({ project }: ProjectProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border dark:border-gray-700">
      <div className="bg-gray-200 dark:bg-gray-700 h-[200px] flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-500 text-2xl">
          438 × 200
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {project.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-green-500 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {project.likes}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {project.comments}
              </span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {Array.from({ length: project.users }).map((_, i) => (
              <div
                key={i}
                className="relative w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
              >
                <Image src="" alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
