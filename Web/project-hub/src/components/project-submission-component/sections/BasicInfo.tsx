import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "../constants";

interface BasicInfoProps {
  form: UseFormReturn<any>;
}

export const BasicInfo = ({ form }: BasicInfoProps) => {
  return (
    <Card className="border-border">
      <CardContent className="p-8">
        <h2 className="text-xl font-bold text-foreground mb-2">Project Title</h2>
        <p className="text-muted-foreground text-sm mb-6">Make it catchy! A good title helps your project stand out.</p>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your project title"
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
          name="elevatorPitch"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel className="text-foreground">Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project in one short sentence"
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
          name="coverImage"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem className="mt-8">
              <FormLabel className="text-foreground">Cover Image</FormLabel>
              <FormControl>
                <label
                  htmlFor="cover-image-upload"
                  className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted transition-colors"
                >
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="cover-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                        form.setValue("coverImage", file, { shouldValidate: true });
                      }
                    }}
                    {...field}
                  />
                  <span className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
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
  );
}; 