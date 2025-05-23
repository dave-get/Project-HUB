'use client';

import { Upload } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useGetUserQuery } from "@/features/profileApi/profileApi";
import { useSubmitProposalMutation } from "@/features/proposalSubmitApi/proposalSubmitApi";
import { useGetTeachersQuery } from "@/features/usersApi/usersApi";
import { profileType } from "@/type/profile";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const proposalSchema = z.object({
  advisor: z.string().min(1, "Please select an advisor"),
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  document: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only PDF and DOC files are allowed"
    )
    .optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

const ProposalSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: currentUser } = useGetUserQuery();
  const { data: teachers = [] } = useGetTeachersQuery();
  const [submitProposal] = useSubmitProposalMutation();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      advisor: "",
      title: "",
    },
  });

  const onSubmit = async (data: ProposalFormValues) => {
    if (!currentUser?.data?._id || !data.document) {
      toast.error("Missing required information", {
        description: "Please make sure you're logged in and have selected a document.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await submitProposal({
        studentId: currentUser.data._id,
        teacherId: data.advisor,
        title: data.title,
        proposalFile: data.document,
      }).unwrap();
      
      toast.success("Proposal submitted successfully!", {
        description: "Your proposal has been sent for review.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit proposal", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("document", file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-baseline mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-100">
                  Submit Project Proposal
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Share your project idea with our team for review
                </p>
              </div>
              <FormField
                control={form.control}
                name="advisor"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Submit to:
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select advisor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        {teachers.map((teacher: profileType) => (
                          <SelectItem 
                            key={teacher._id} 
                            value={teacher._id}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {teacher.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Project Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter project title" 
                      {...field} 
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mb-8">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Proposal Document
              </h3>
              <FormField
                control={form.control}
                name="document"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex justify-center mb-2">
                          <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="document-upload"
                          onChange={handleFileChange}
                          {...field}
                        />
                        <label
                          htmlFor="document-upload"
                          className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Drop your file here, or{" "}
                          <span className="text-blue-600 dark:text-blue-400">click to browse</span>
                        </label>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          PDF, DOC up to 10MB
                        </p>
                        {value && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Selected file: {(value as File).name}
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </section>
        </form>
      </Form>
    </div>
  );
};

export default ProposalSubmission;
