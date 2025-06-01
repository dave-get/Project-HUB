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

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

export function PersonalInfoForm() {
  const { data: userData, isLoading, refetch } = useGetUserQuery()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: userData?.data?.fullName || "",
      email: userData?.data?.email || "",
      phone: userData?.data?.phone || "",
      location: userData?.data?.location || "",
    },
  })

  // // Update form when user data changes
  React.useEffect(() => {
    if (userData?.data) {
      form.reset({
        fullName: userData.data.fullName || "",
        email: userData.data.email || "",
        phone: userData.data.phone || "",
        location: userData.data.location || "",
      });
    }
  }, [userData, form]);

  async function onSubmit(data: PersonalInfoFormValues) {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.location) formData.append("location", data.location);
      const result = await updateUser(formData).unwrap();
      console.log("Update result:", result);
      
      // Refetch the user data
      await refetch();
      
      toast.success("Personal information updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update personal information");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  )
} 