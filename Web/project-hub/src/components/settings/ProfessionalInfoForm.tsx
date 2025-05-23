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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const professionalInfoSchema = z.object({
  department: z.string().min(2, "Department must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must not exceed 500 characters"),
})

type ProfessionalInfoFormValues = z.infer<typeof professionalInfoSchema>

export function ProfessionalInfoForm() {
  const { data: userData, isLoading } = useGetUserQuery()
  const [updateUser] = useUpdateUserMutation()

  const form = useForm<ProfessionalInfoFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      department: userData?.data.department || "",
      bio: userData?.data.bio || "",
    },
  })

  async function onSubmit(data: ProfessionalInfoFormValues) {
    try {
      const formData = new FormData();
      formData.append("department", data.department);
      formData.append("bio", data.bio);

      await updateUser(formData).unwrap()
      toast.success("Professional information updated successfully")
    } catch (error) {
      toast.error("Failed to update professional information")
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Enter your department" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself" 
                  className="min-h-[100px]"
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