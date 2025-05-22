import React from "react";
import ProjectDetail from "@/components/project-detail-component/ProjectDetail";
import Navbar from "@/components/landing-page-component/navbar";
import Footer from "@/components/landing-page-component/footer";
import { projectDetails } from "@/lib/api";

interface PageProps {
  params: {
    id: string;
  };
}

const ProjectDetailPage = ({ params }: PageProps) => {
  // Find the project data based on the ID
  const projectData = projectDetails.find(
    (project) => project.id === params.id
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProjectDetail id={params.id} data={projectData} />
      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
