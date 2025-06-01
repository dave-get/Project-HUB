"use client";
import Link from "next/link";
import ProjectCard from "./project-card";
import { useGetAllProjectsQuery } from "@/features/getProjectsApi/getProjectsApi";
import { Project, Projects } from "@/type/project";

export default function ProjectGrid() {
  const { data } = useGetAllProjectsQuery();

  const projectsData = (data?.projects as Project[]) || [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectsData?.map((project) => (
          <ProjectCard key={project?._id} project={project} />
      ))}
    </div>
  );
}
