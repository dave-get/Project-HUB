import { PenToolIcon, Upload, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect, DragEvent } from "react";
import { Tool } from "@/type/project";

interface ToolsSectionProps {
  form: UseFormReturn<any>;
  noToolsUsed: boolean;
  setNoToolsUsed: (value: boolean) => void;
}

export const ToolsSection = ({ form, noToolsUsed, setNoToolsUsed }: ToolsSectionProps) => {
  const [showToolForm, setShowToolForm] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [newTool, setNewTool] = useState<Tool>({
    name: "",
    description: "",
    image: ""
  });
  const [isDragging, setIsDragging] = useState(false);

  // Update tools state when noToolsUsed changes
  useEffect(() => {
    if (noToolsUsed) {
      setTools([]);
      form.setValue("toolsAndMachines", {
        noToolsUsed: true,
        tools: []
      }, { shouldValidate: true });
    } else if (tools.length === 0) {
      // Only update form when tools array is empty to prevent infinite loop
      form.setValue("toolsAndMachines", {
        noToolsUsed: false,
        tools: []
      }, { shouldValidate: true });
    }
  }, [noToolsUsed, form]);

  // Initialize tools from form values
  useEffect(() => {
    const initializeTools = () => {
      const toolsAndMachines = form.getValues("toolsAndMachines");
      if (toolsAndMachines) {
        setNoToolsUsed(toolsAndMachines.noToolsUsed);
        if (!toolsAndMachines.noToolsUsed && toolsAndMachines.tools) {
          setTools(toolsAndMachines.tools);
        }
      }
    };
    initializeTools();
  }, []); // Only run once on mount

  const handleAddTool = () => {
    if (newTool.name && newTool.description && newTool.image) {
      const toolToAdd = {
        name: newTool.name,
        description: newTool.description,
        image: newTool.image
      };
      const updatedTools = [...tools, toolToAdd];
      setTools(updatedTools);
      form.setValue("toolsAndMachines", {
        noToolsUsed: false,
        tools: updatedTools
      }, { shouldValidate: true });
      setNewTool({ name: "", description: "", image: "" });
      setShowToolForm(false);
    }
  };

  const handleRemoveTool = (index: number) => {
    const updatedTools = tools.filter((_, i) => i !== index);
    setTools(updatedTools);
    form.setValue("toolsAndMachines", {
      noToolsUsed: false,
      tools: updatedTools
    }, { shouldValidate: true });
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setNewTool({ ...newTool, image: URL.createObjectURL(file) });
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <PenToolIcon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">Tools and Machines</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">Add tools and machines used in your project</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              id="noToolsUsed"
              className="h-4 w-4 rounded text-primary focus:ring-primary border-input bg-background"
              checked={noToolsUsed}
              onChange={(e) => {
                const checked = e.target.checked;
                setNoToolsUsed(checked);
                if (checked) {
                  setTools([]);
                  form.setValue("toolsAndMachines", {
                    noToolsUsed: true,
                    tools: []
                  }, { shouldValidate: true });
                } else {
                  form.setValue("toolsAndMachines", {
                    noToolsUsed: false,
                    tools: tools
                  }, { shouldValidate: true });
                }
              }}
            />
            <label htmlFor="noToolsUsed">No tools used</label>
          </div>
        </div>

        {!noToolsUsed && (
          <div className="space-y-6">
            {tools.map((tool, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {tool.image && (
                      <div className="h-10 w-10 rounded-lg overflow-hidden">
                        <img
                          src={tool.image}
                          alt={tool.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-foreground">{tool.name}</h4>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveTool(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {showToolForm ? (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Tool Name
                    </label>
                    <Input
                      placeholder="Enter tool name"
                      value={newTool.name}
                      onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe how this tool was used in your project"
                      value={newTool.description}
                      onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Tool Image
                    </label>
                    <label
                      htmlFor="tool-image-upload"
                      className={`block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        isDragging 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:bg-muted'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${
                        isDragging ? 'bg-primary/20' : 'bg-primary/10'
                      }`}>
                        <Upload className={`h-6 w-6 ${isDragging ? 'text-primary animate-bounce' : 'text-primary'}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      {newTool.image && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected file: {newTool.image.split('/').pop()}
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="tool-image-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewTool({ ...newTool, image: URL.createObjectURL(file) });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddTool}
                    disabled={!newTool.name || !newTool.description || !newTool.image}
                    className="flex-1"
                  >
                    Add Tool
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowToolForm(false);
                      setNewTool({ name: "", description: "", image: "" });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowToolForm(true)}
                variant="outline"
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Tool
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 