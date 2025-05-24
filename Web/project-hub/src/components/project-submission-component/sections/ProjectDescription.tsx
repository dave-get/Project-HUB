import { PenToolIcon, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ACCEPTED_DOC_TYPES } from "../constants";

interface ProjectDescriptionProps {
  form: UseFormReturn<any>;
}

export const ProjectDescription = ({ form }: ProjectDescriptionProps) => {
  return (
    <>
      {/* Project Description Card */}
      <Card className="border-border">
        <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <PenToolIcon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">Project Description</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <FormField
            control={form.control}
            name="projectDescription"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of your project"
                    className="w-full border-input bg-background text-foreground focus:ring-ring min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Code and Documentation Card */}
      <Card className="border-border mt-8">
        <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <PenToolIcon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">Code and Documentation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <FormField
            control={form.control}
            name="codeLink"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="text-foreground">Code Repository Link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter GitHub or other repository link"
                    className="w-full border-input bg-background text-foreground focus:ring-ring"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentation"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="text-foreground">Project Documentation</FormLabel>
                <FormControl>
                  <label
                    htmlFor="documentation-upload"
                    className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <PenToolIcon className="h-6 w-6 text-primary" />
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="documentation-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          form.setValue("documentation", file, { shouldValidate: true });
                        }
                      }}
                      {...field}
                    />
                    <span className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
                    {value && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected file: {(value as File).name}
                      </p>
                    )}
                  </label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}; 