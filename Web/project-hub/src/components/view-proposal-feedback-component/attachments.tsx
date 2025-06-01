import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackAttachment } from "@/type/proposal"
import { FileText, Download } from "lucide-react"

export function Attachments({ attachments }: { attachments: FeedbackAttachment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {attachments.map((attachment, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{attachment.fileName}</p>
                <p className="text-xs text-gray-500">{attachment?.size}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
