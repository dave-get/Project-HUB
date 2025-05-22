import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProposalFeedbackPage() {
  return (
    <div className="min-h-screen bg-zinc-900 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header with title */}
        <Card className="mb-6 bg-white p-6">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                Proposal <span className="text-gray-400">/ Feedback</span>
              </h1>
            </div>
          </div>

          {/* Project title and info */}
          <div>
            <h2 className="text-xl font-medium text-gray-800">
              Machine Learning in Healthcare: Early Disease Detection
            </h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span>Submitted: 2023-05-10</span>
              <Badge className="bg-green-100 text-green-700">Approved</Badge>
            </div>
          </div>
        </Card>

        {/* Main content with feedback and quick actions */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Feedback sections */}
          <Card className="flex-1 bg-white p-6">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user text-gray-400"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Dr. Sadie Chen</p>
                  <p className="text-xs text-gray-500">Committee Member #3</p>
                </div>
              </div>
            </div>

            <div className="mb-10 grid gap-10">
              <FeedbackSection
                title="Research Methodology"
                rating={4}
                strengths="Strong data collection approach and experimental design."
                areasForImprovement="Consider including more diverse patient groups."
                concerns="The methodology is well structured but needs more detail on statistical methods."
              />

              <FeedbackSection
                title="Literature Review"
                rating={5}
                strengths="Comprehensive coverage of recent developments."
                areasForImprovement="Consider including more interdisciplinary works."
                concerns="Excellent breadth of current state-of-the-art techniques."
              />

              <FeedbackSection
                title="Technical Implementation"
                rating={4}
                strengths="Clear technical plan and technology stack."
                areasForImprovement="More detail on scalability and deployment."
                concerns="Consider adding more detail on validation approaches."
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button className="bg-slate-700 text-white hover:bg-slate-800" size="lg">
                Submit Project
              </Button>
            </div>
          </Card>

          {/* Quick Actions panel */}
          <div className="w-full md:w-64">
            <Card className="bg-white p-4">
              <h3 className="mb-3 font-medium text-gray-700">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  View Original Proposal
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  Download All Requirements
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeedbackSectionProps {
  title: string
  rating: number
  strengths: string
  areasForImprovement: string
  concerns: string
}

function FeedbackSection({ title, rating, strengths, areasForImprovement, concerns }: FeedbackSectionProps) {
  return (
    <div>
      <h3 className="mb-3 text-base font-medium text-gray-800">{title}</h3>
      <div className="mb-3 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`mr-1 ${i < rating ? "text-amber-500" : "text-gray-300"}`}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-gray-700">Strengths:</p>
          <p className="text-gray-600">{strengths}</p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Areas for Improvement:</p>
          <p className="text-gray-600">{areasForImprovement}</p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Comments:</p>
          <p className="text-gray-600">{concerns}</p>
        </div>
      </div>
    </div>
  )
}
