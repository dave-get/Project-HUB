import { Upload, X, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState, useRef, useEffect, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetTeachersQuery } from "@/features/usersApi/usersApi";
import { profileType } from "@/type/profile";
import { Badge } from "@/components/ui/badge";

const PREDEFINED_TAGS = [
  "Web Development",
  "Mobile Development",
  "IoT",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Cloud Computing",
  "Cybersecurity",
  "Blockchain",
  "Game Development",
  "UI/UX Design",
  "DevOps",
  "Database",
  "Networking",
  "Embedded Systems",
  "Robotics",
  "Computer Vision",
  "Natural Language Processing",
  "Augmented Reality",
  "Virtual Reality",
  "Full Stack",
  "Frontend",
  "Backend",
  "API Development",
  "System Design",
  "Software Testing",
  "Quality Assurance",
  "Project Management",
  "Agile Development",
  "Microservices"
];

interface BasicInfoProps {
  form: UseFormReturn<any>;
}

export const BasicInfo = ({ form }: BasicInfoProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [showTagList, setShowTagList] = useState(false);
  const [filteredTags, setFilteredTags] = useState(PREDEFINED_TAGS);
  const [isDragging, setIsDragging] = useState(false);
  const tagListRef = useRef<HTMLDivElement>(null);
  const { data: teachers = [] } = useGetTeachersQuery();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagListRef.current && !tagListRef.current.contains(event.target as Node)) {
        setShowTagList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (file: File) => {
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Update form value with the actual file
      form.setValue("coverImage", file, { shouldValidate: true });
    }
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
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file);
    }
  }, []);

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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setFilteredTags(PREDEFINED_TAGS.filter(tag => tag.toLowerCase().includes(value.toLowerCase())));
  };

  const handleTagSelect = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tag)) {
      form.setValue("tags", [...currentTags, tag], { shouldValidate: true });
    }
    setTagInput("");
    setShowTagList(false);
  };

  return (
    <Card className="border-border">
      <CardContent className="p-8">
        <div className="flex justify-end mb-8">
          <FormField
            control={form.control}
            name="reviewedByTeacherId"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Submit to:
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[220px] bg-background">
                      <SelectValue placeholder="Select advisor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teachers.map((teacher: profileType) => (
                      <SelectItem 
                        key={teacher._id} 
                        value={teacher._id}
                      >
                        {teacher.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="border-b border-border pb-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Project Title</h2>
          <p className="text-sm text-muted-foreground mt-2">Make it catchy! A good title helps your project stand out.</p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-foreground">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your project title"
                  className="w-full border-input bg-background text-foreground focus:ring-ring mt-1.5"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="elevatorPitch"
          render={({ field }) => (
            <FormItem className="mt-8">
              <FormLabel className="text-base font-medium text-foreground">Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project in one short sentence"
                  className="w-full border-input bg-background text-foreground focus:ring-ring mt-1.5 min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="mt-8">
              <FormLabel className="text-base font-medium text-foreground">Tags</FormLabel>
              <FormControl>
                <div className="space-y-3 mt-1.5">
                  <div className="relative" ref={tagListRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search and select tags..."
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onFocus={() => setShowTagList(true)}
                        className="w-full pl-9 border-input bg-background text-foreground focus:ring-ring"
                      />
                    </div>
                    {showTagList && (
                      <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredTags.length > 0 ? (
                          filteredTags.map((tag) => (
                            <div
                              key={tag}
                              className="px-4 py-2 hover:bg-muted cursor-pointer"
                              onClick={() => handleTagSelect(tag)}
                            >
                              {tag}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            No tags found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
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
              <FormMessage className="text-xs mt-1" />
            </FormItem>
          )}
        />
      
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem className="mt-8">
              <FormLabel className="text-base font-medium text-foreground">Cover Image</FormLabel>
              <FormControl>
                <label
                  htmlFor="cover-image-upload"
                  className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mt-1.5
                    ${isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
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
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
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
                    onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
                    {...field}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  {value && !previewUrl && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected file: {(value as File).name}
                    </p>
                  )}
                </label>
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}; 