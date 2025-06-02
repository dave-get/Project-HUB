"use client";
import ViewProjectFeedback from "@/components/view-project-feedback-component/viewProjectFeedback";

interface PageProps {
  params: {
    id: string;
  };
}

function Page({ params }: PageProps) {
  return (
    <div>
      <ViewProjectFeedback projectId={params.id} />
    </div>
  );
}

export default Page;
