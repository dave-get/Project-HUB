import FeedbackForm from "@/components/project-feedback-component/ProjectFeedback";

interface PageProps {
  params: {
    id: string;
  };
}

export default function SubmitFeedback({ params }: PageProps) {
  return (
    <main className="container mx-auto py-4">
      <FeedbackForm projectId={params.id} />
    </main>
  );
}
