import { User, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { useState, useRef } from "react";
import { students } from "../constants";
import { TeamMember } from "../types";

interface TeamSectionProps {
  form: UseFormReturn<any>;
}

export const TeamSection = ({ form }: TeamSectionProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const handleStudentSelect = (student: { id: number; name: string }) => {
    setSelectedStudent(student);
    setOpen(false);
    setIsRoleModalOpen(true);
  };

  const handleRoleConfirm = () => {
    if (selectedStudent && roleInput.trim()) {
      const newMember: TeamMember = {
        name: selectedStudent.name,
        role: roleInput.trim()
      };
      
      const currentMembers = form.getValues("teamMembers");
      if (!currentMembers.some((member: TeamMember) => member.name === newMember.name)) {
        form.setValue("teamMembers", [...currentMembers, newMember]);
      }
      
      setRoleInput("");
      setSelectedStudent(null);
      setIsRoleModalOpen(false);
    }
  };

  const handleRemoveMember = (memberToRemove: TeamMember) => {
    const currentMembers = form.getValues("teamMembers");
    form.setValue(
      "teamMembers",
      currentMembers.filter((member: TeamMember) => member.name !== memberToRemove.name)
    );
  };

  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <User className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">The Team</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <p className="text-sm text-muted-foreground mb-6">Add team members who contributed to this project</p>

        <div className="space-y-4 mb-6">
          {form.getValues("teamMembers").map((member: TeamMember) => (
            <div key={member.name} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
              <Avatar className="h-10 w-10 bg-primary">
                <AvatarFallback className="text-primary-foreground">{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveMember(member)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative w-full" ref={searchRef}>
            <Input
              type="text"
              placeholder="Search team member..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setOpen(true)}
            />
            {open && (
              <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                <div className="max-h-60 overflow-auto">
                  {students
                    .filter(student => 
                      student.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((student) => (
                      <div
                        key={student.id}
                        className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          handleStudentSelect(student);
                          setSearchQuery("");
                        }}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{student.name}</span>
                      </div>
                    ))}
                  {students.filter(student => 
                    student.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No students found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Role Selection Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role for {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter team member's role"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRoleModalOpen(false);
                setSelectedStudent(null);
                setRoleInput("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleConfirm}
              disabled={!roleInput.trim()}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}; 