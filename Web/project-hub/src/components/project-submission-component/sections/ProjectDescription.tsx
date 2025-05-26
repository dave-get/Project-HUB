import { PenToolIcon, Upload, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ACCEPTED_DOC_TYPES } from "../constants";
import { useState, useCallback } from "react";

interface ProjectDescriptionProps {
  form: UseFormReturn<any>;
}

export const ProjectDescription = ({ form }: ProjectDescriptionProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (file) {
      form.setValue("codeAndDocumentation.documentation", {
        fileName: file.name,
        fileSize: file.size.toString(),
        file: file
      }, { shouldValidate: true });
    }
  };

  const handleRemoveFile = () => {
    form.setValue("codeAndDocumentation.documentation", {
      fileName: "",
      fileSize: "0",
      file: null
    }, { shouldValidate: true });
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && ACCEPTED_DOC_TYPES.includes(file.type)) {
      handleFileChange(file);
    }
  }, []);

  return (
    <>
      {/* Project Description Card */}
      <Card className="border-border">
        <CardHeader className="bg-muted/50 border-b border-border px-8 py-5">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
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
                <FormLabel className="text-base font-medium text-foreground">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of your project"
                    className="w-full border-input bg-background text-foreground focus:ring-ring min-h-[200px] mt-1.5"
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
        <CardHeader className="bg-muted/50 border-b border-border px-8 py-5">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <PenToolIcon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">Code and Documentation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <FormField
            control={form.control}
            name="codeAndDocumentation.repositoryLink"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel className="text-base font-medium text-foreground">Code Repository Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter GitHub or other repository link"
                    className="w-full border-input bg-background text-foreground focus:ring-ring mt-1.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="codeAndDocumentation.documentation"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-foreground">Project Documentation</FormLabel>
                <FormControl>
                  {value?.fileName && value.fileName !== "" ? (
                    <div className="mt-1.5">
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {value.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(value.fileSize)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="documentation-upload"
                      className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mt-1.5
                        ${isDragging 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'}`}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <PenToolIcon className="h-6 w-6 text-primary" />
                      </div>
                      <input
                        type="file"
                        accept={ACCEPTED_DOC_TYPES.join(',')}
                        className="hidden"
                        id="documentation-upload"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        {...field}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
                    </label>
                  )}
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