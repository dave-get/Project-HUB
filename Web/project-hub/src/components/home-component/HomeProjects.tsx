"use client";
import React from "react";
import Link from "next/link";
import ProjectCard from "@/components/posted-projects/project-card";
import { useGetAllProjectsQuery } from "@/features/getProjectsApi/getProjectsApi";
import { Project } from "@/type/project";

export default function HomeProjects() {
  const { data } = useGetAllProjectsQuery();

  console.log("*******************", data);
  const projectsData = (data?.projects as Project[]) || [];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">
          Dashboard Projects
        </h1>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-grid"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-list"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3" y1="6" y2="6" />
              <line x1="3" x2="3" y1="12" y2="12" />
              <line x1="3" x2="3" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData?.map((project) => (
          <Link
            href={`/home/project-detail/${project?._id}`}
            key={project?._id}
            className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
}
