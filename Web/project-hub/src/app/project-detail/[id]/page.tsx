import React from "react";
import ProjectDetail from "@/components/project-detail-component/ProjectDetail";
import Navbar from "@/components/landing-page-component/navbar";
import Footer from "@/components/landing-page-component/footer";

interface PageProps {
  params: {
    id: string;
  };
}

const ProjectDetailPage = ({ params }: PageProps) => {
  // Find the project data based on the ID
  console.log("Project Detail Page - params:", params);
  if (!params.id) {
    console.error("No ID provided in params");
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProjectDetail id={params.id} />
      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
