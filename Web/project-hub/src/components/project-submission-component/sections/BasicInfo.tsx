import { Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetTeachersQuery } from "@/features/usersApi/usersApi";
import { profileType } from "@/type/profile";
import { Badge } from "@/components/ui/badge";

interface BasicInfoProps {
  form: UseFormReturn<any>;
}

export const BasicInfo = ({ form }: BasicInfoProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const { data: teachers = [] } = useGetTeachersQuery();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Update form value with the actual file
      form.setValue("coverImage", file, { shouldValidate: true });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()], { shouldValidate: true });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag: string) => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <Card className="border-border">
      <CardContent className="p-8">
        <h2 className="text-xl font-bold text-foreground mb-2">Project Title</h2>
        <p className="text-muted-foreground text-sm mb-6">Make it catchy! A good title helps your project stand out.</p>
        
        <FormField
          control={form.control}
          name="reviewedByTeacherId"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 mb-6">
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
          name="tags"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel className="text-foreground">Tags</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="Add tags (press Enter to add)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full border-input bg-background text-foreground focus:ring-ring"
                  />
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
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
                  {previewUrl ? (
                    <div className="relative w-full h-48 mb-4">
                      <img
                        src={previewUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        onClick={(e) => {
                          e.preventDefault();
                          setPreviewUrl(null);
                          form.setValue("coverImage", null);
                        }}
                      >
                        <Upload className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  ) : (
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="cover-image-upload"
                    onChange={handleImageChange}
                    {...field}
                  />
                  <span className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  {value && !previewUrl && (
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