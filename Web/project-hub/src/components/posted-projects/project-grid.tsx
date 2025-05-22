import Link from "next/link";
import ProjectCard from "./project-card";

const projects = [
  {
    id: 1,
    title: "Project Management Dashboard",
    description:
      "A comprehensive project management solution with real-time tracking and team collaboration features.",
    likes: 234,
    comments: 89,
    users: 4,
  },
  {
    id: 2,
    title: "E-commerce Analytics Platform",
    description:
      "Advanced analytics and reporting platform for e-commerce businesses with predictive insights.",
    likes: 156,
    comments: 45,
    users: 2,
  },
  {
    id: 3,
    title: "Healthcare Management System",
    description:
      "Integrated healthcare management system for hospitals and clinics with patient record management.",
    likes: 312,
    comments: 67,
    users: 3,
  },
  {
    id: 4,
    title: "AI-Powered Learning Platform",
    description:
      "Personalized learning experience platform with AI-driven content recommendations and progress tracking.",
    likes: 189,
    comments: 92,
    users: 4,
  },
  {
    id: 5,
    title: "Financial Analytics Dashboard",
    description:
      "Real-time financial data analysis and visualization platform for investment professionals.",
    likes: 278,
    comments: 73,
    users: 4,
  },
  {
    id: 6,
    title: "Social Media Management Tool",
    description:
      "Comprehensive social media management and analytics platform for marketing teams.",
    likes: 198,
    comments: 58,
    users: 3,
  },
];

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link
          href={`/project-detail/${project.id}`}
          key={project.id}
          className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <ProjectCard project={project} />
        </Link>
      ))}
    </div>
  );
}
