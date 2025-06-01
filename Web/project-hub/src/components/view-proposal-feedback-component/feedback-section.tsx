import { Star } from "lucide-react";

interface FeedbackSectionProps {
  title: string;
  rating: number;
  strengths: string;
  areasForImprovement: string;
  comments: string;
}

export function FeedbackSection({
  title,
  rating,
  strengths,
  areasForImprovement,
  comments,
}: FeedbackSectionProps) {
  return (
    <div className="space-y-4 feedback-card p-4 rounded-lg border transition-colors duration-200">
      <h3 className="text-lg font-semibold feedback-text">{title}</h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating
                ? "feedback-star-filled"
                : "feedback-star-empty"
            }`}
          />
        ))}
      </div>

      {/* Feedback Details */}
      <div className="space-y-3">
        <div>
          <h4 className="font-medium feedback-text mb-1">Strengths:</h4>
          <p className="feedback-text-muted text-sm">{strengths}</p>
        </div>

        <div>
          <h4 className="font-medium feedback-text mb-1">
            Areas for Improvement:
          </h4>
          <p className="feedback-text-muted text-sm">{areasForImprovement}</p>
        </div>

        <div>
          <h4 className="font-medium feedback-text mb-1">Comments:</h4>
          <p className="feedback-text-muted text-sm">{comments}</p>
        </div>
      </div>
    </div>
  );
}
