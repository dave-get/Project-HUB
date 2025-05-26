import { Laptop, Upload, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface App {
  title: string;
  description: string;
  logo: File;
}

interface AppsSectionProps {
  form: UseFormReturn<any>;
}

export const AppsSection = ({ form }: AppsSectionProps) => {
  const [showAppForm, setShowAppForm] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [newApp, setNewApp] = useState<App>({
    title: "",
    description: "",
    logo: null as unknown as File
  });

  const handleAddApp = () => {
    if (newApp.title && newApp.description && newApp.logo) {
      const appToAdd = {
        title: newApp.title,
        description: newApp.description,
        logo: newApp.logo
      };
      const updatedApps = [...apps, appToAdd];
      setApps(updatedApps);
      form.setValue("appsAndPlatforms", updatedApps, { shouldValidate: true });
      setNewApp({ title: "", description: "", logo: null as unknown as File });
      setShowAppForm(false);
    }
  };

  const handleRemoveApp = (index: number) => {
    const updatedApps = apps.filter((_, i) => i !== index);
    setApps(updatedApps);
    form.setValue("appsAndPlatforms", updatedApps);
  };

  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Laptop className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">Apps and Platforms</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <p className="text-sm text-muted-foreground mb-6">Add software, apps, or platforms used in your project</p>

        <div className="space-y-6">
          {apps.map((app, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {app.logo && (
                    <div className="h-10 w-10 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(app.logo)}
                        alt={app.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-foreground">{app.title}</h4>
                    <p className="text-sm text-muted-foreground">{app.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveApp(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {showAppForm ? (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    App/Platform Title
                  </label>
                  <Input
                    placeholder="Enter app or platform name"
                    value={newApp.title}
                    onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe how this app/platform was used in your project"
                    value={newApp.description}
                    onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Logo
                  </label>
                  <label
                    htmlFor="app-logo-upload"
                    className="block border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="app-logo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewApp({ ...newApp, logo: file });
                        }
                      }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    {newApp.logo && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected file: {newApp.logo.name}
                      </p>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddApp}
                  disabled={!newApp.title || !newApp.description || !newApp.logo}
                  className="flex-1"
                >
                  Add App/Platform
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAppForm(false);
                    setNewApp({ title: "", description: "", logo: null as unknown as File });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAppForm(true)}
              variant="outline"
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New App/Platform
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 