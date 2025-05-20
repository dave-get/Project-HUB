"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Camera,
} from "lucide-react";
import { z } from "zod";
import { useForm, ControllerRenderProps, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  fieldOfStudy: z.string().min(2, "Field of study is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "teacher"]),
  location: z.string().min(2, "Location is required"),
  socialLinks: z.array(socialLinkSchema).default([]),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      fullName: "",
      fieldOfStudy: "",
      bio: "",
      role: "student",
      phone: "",
      email: "",
      location: "",
      socialLinks: [
        { platform: "github", url: "" },
        { platform: "linkedin", url: "" },
        { platform: "twitter", url: "" },
      ],
      skills: [],
      password: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSkillsChange = (value: string) => {
    const skillsArray = value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    form.setValue("skills", skillsArray);
  };

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      console.log("Form data:", data);
      console.log("Profile image:", profileImage);
      router.push("/signup/success");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Your Profile
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-xs">Upload Photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<SignupFormValues, "fullName">;
                  }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dawit Getachew" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      SignupFormValues,
                      "fieldOfStudy"
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Computer Science"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<SignupFormValues, "bio">;
                }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe yourself professionally..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<SignupFormValues, "phone">;
                }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<SignupFormValues, "email">;
                }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., your.name@university.edu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<SignupFormValues, "location">;
                }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Social Profiles */}
          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.getValues("socialLinks").map((link, index) => (
                <FormField
                  key={link.platform}
                  control={form.control}
                  name={`socialLinks.${index}.url`}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      SignupFormValues,
                      `socialLinks.${number}.url`
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {link.platform === "github" && (
                          <Github className="h-4 w-4 text-blue-500" />
                        )}
                        {link.platform === "linkedin" && (
                          <Linkedin className="h-4 w-4 text-blue-500" />
                        )}
                        {link.platform === "twitter" && (
                          <Twitter className="h-4 w-4 text-blue-500" />
                        )}
                        {link.platform.charAt(0).toUpperCase() +
                          link.platform.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`e.g., ${link.platform}.com/username`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="skills"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<SignupFormValues, "skills">;
                }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Add skills separated by commas"
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        value={field.value.join(", ")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<SignupFormValues, "password">;
                }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a secure password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" className="px-8">
              Create Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
