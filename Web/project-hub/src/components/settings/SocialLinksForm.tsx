"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useGetUserQuery, useUpdateUserMutation } from "@/features/profileApi/profileApi"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import React from "react"

interface SocialLink {
  platform: string;
  url: string;
  _id?: string;
}

interface UserData {
  success: boolean;
  data: {
    socialLinks: SocialLink[];
    bio?: string;
    department?: string;
    email?: string;
    fullName?: string;
    imageUrl?: string;
    location?: string;
    phone?: string;
    role?: string;
    skills?: string[];
    _id?: string;
  };
}

const socialLinksSchema = z.object({
  socialLinks: z.object({
    linkedin: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
    github: z.string().url("Please enter a valid GitHub URL").optional().or(z.literal("")),
    twitter: z.string().url("Please enter a valid Twitter URL").optional().or(z.literal("")),
  }),
})

type SocialLinksFormValues = z.infer<typeof socialLinksSchema>

export function SocialLinksForm() {
  const { data: userData, isLoading } = useGetUserQuery()
  const [updateUser] = useUpdateUserMutation()

  // Helper function to get social link URL by platform
  const getSocialLinkUrl = (platform: string) => {
    const socialLinks = ((userData as unknown) as UserData)?.data?.socialLinks || [];
    const link = socialLinks.find((link: SocialLink) => link.platform === platform);
    return link?.url || "";
  };

  const form = useForm<SocialLinksFormValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      socialLinks: {
        linkedin: getSocialLinkUrl("linkedin"),
        github: getSocialLinkUrl("github"),
        twitter: getSocialLinkUrl("twitter"),
      },
    },
  })

  // Update form when user data changes
  React.useEffect(() => {
    if (((userData as unknown) as UserData)?.data?.socialLinks) {
      form.reset({
        socialLinks: {
          linkedin: getSocialLinkUrl("linkedin"),
          github: getSocialLinkUrl("github"),
          twitter: getSocialLinkUrl("twitter"),
        }
      });
    }
  }, [userData, form]);

  async function onSubmit(data: SocialLinksFormValues) {
    try {
      const formData = new FormData();
      const socialLinksArray = [
        { platform: "github", url: data.socialLinks.github },
        { platform: "linkedin", url: data.socialLinks.linkedin },
        { platform: "twitter", url: data.socialLinks.twitter }
      ].filter(link => link.url && link.url.trim() !== "");

      console.log('Sending these links:', JSON.stringify(socialLinksArray, null, 2));
      formData.append("socialLinks", JSON.stringify(socialLinksArray));

      const response = await updateUser(formData).unwrap();
      console.log('Server saved these links:', JSON.stringify(response.data.socialLinks, null, 2));
      
      toast.success("Social links updated successfully")
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Failed to update social links")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="socialLinks.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://linkedin.com/in/your-profile" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="socialLinks.github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Profile</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://github.com/your-username" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="socialLinks.twitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Profile</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://twitter.com/your-handle" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  )
}   