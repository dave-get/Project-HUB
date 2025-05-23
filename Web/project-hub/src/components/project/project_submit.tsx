"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Plus, Save, Trash2, Upload } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ProjectSubmissionPage() {
  const [toolModalOpen, setToolModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">
            Projects <span className="text-gray-400 text-sm">/ Submit</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <Card className="bg-white border shadow-sm mb-6 p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-1">Insert your project title, make it sound cool!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Here is your project. Describe your project in one short sentence.
              </p>

              <div className="mb-6">
                <label className="block text-sm mb-2">Title</label>
                <Input placeholder="here" className="w-full" />
              </div>

              <div className="flex justify-center mt-8">
                <button className="px-4 py-1.5 text-xs text-green-500 border border-gray-300 border-dashed rounded-full hover:text-green-600 hover:bg-green-50 focus:outline-none">
                  UPLOAD YOUR COVER IMAGE
                </button>
              </div>
            </Card>

            <Card className="bg-white border shadow-sm mb-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <h3 className="font-medium">The Team</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <input
                        type="checkbox"
                        id="notAuthorCheckbox"
                        className="h-3 w-3"
                    />
                    <label htmlFor="notAuthorCheckbox" className="cursor-pointer">
                        I'm not this project's author
                    </label>
                    </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  D
                </div>
                <span>Davegpt</span>
              </div>

              <div className="flex justify-center">
                <Button variant="ghost" size="sm" className="text-blue-500 text-xs">
                  ADD A MEMBER
                </Button>
              </div>
            </Card>

            <Card className="bg-white border shadow-sm mb-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    2
                  </div>
                  <h3 className="font-medium">Tools and machines</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <input 
                        type="checkbox" 
                        id="noToolsUsed" 
                        className="h-3 w-3" 
                    />
                    <label htmlFor="noToolsUsed">
                        No tools used in this project
                    </label>
                    </div>
              </div>
              <div className="flex justify-center py-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8 w-8 p-0"
                  onClick={() => setToolModalOpen(true)}
                >
                  <Plus className="h-4 w-4 text-blue-500" />
                </Button>
              </div>
            </Card>

            <Card className="bg-white border shadow-sm mb-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <h3 className="font-medium">Apps and platforms</h3>
                </div>
              </div>

              <div className="flex justify-center py-6">
                <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0">
                  <Plus className="h-4 w-4 text-blue-500" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="w-full md:w-80 shrink-0">
            <Card className="bg-blue-50 border-0 shadow-sm p-4">
              <h3 className="font-medium text-gray-700 mb-2">Project checklist</h3>
              <p className="text-xs text-gray-600 mb-2">
                Add your content in these sections to correctly publish your project.
              </p>
              <a href="#" className="text-xs text-blue-500 mb-4 block">
                Check content guidelines
              </a>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Intro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">The team</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-500">Components and supplies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-500">Tools and machines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-500">Apps and platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Project description</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-500">Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Downloadable files</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-500">Documentation</span>
                </div>
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-6">GO TO PREVIEW</Button>
              <div className="flex items-center justify-between mt-4">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  SAVE CHANGES
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-red-500 flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  DELETE
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Tool Modal - Fixed with proper accessibility */}
      <Dialog open={toolModalOpen} onOpenChange={setToolModalOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-lg font-medium">Add New Tool</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {/* <div className="mb-4">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 text-sm rounded-md">TOOL</Button>
            </div> */}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tool Name</label>
              <Input placeholder="Enter tool name" className="w-full" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tool Description</label>
              <Textarea className="w-full h-24" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Tool Image</label>
              <div className="border border-gray-200 bg-gray-50 rounded p-8 text-center cursor-pointer">
                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded border border-gray-300">
                Submit Tool
              </button>
              <button
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded border border-gray-300"
                onClick={() => setToolModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}