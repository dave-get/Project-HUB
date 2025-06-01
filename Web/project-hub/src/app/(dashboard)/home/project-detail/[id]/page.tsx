import React from "react";
import ProjectDetail from "@/components/project-detail-component/ProjectDetail";

interface PageProps {
  params: {
    id: string;
  };
}

const ProjectDetailPage = ({ params }: PageProps) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectDetail id={params.id} />
    </div>
  );
};

export default ProjectDetailPage;
