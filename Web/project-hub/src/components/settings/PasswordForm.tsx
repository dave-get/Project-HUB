"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useUpdateUserMutation } from "@/features/profileApi/profileApi"
import { toast } from "sonner"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export function PasswordForm() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  })

  const [updateUser, { isLoading }] = useUpdateUserMutation()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const formData = new FormData()
      formData.append("currentPassword", data.currentPassword)
      formData.append("password", data.newPassword)
      
      const response = await updateUser(formData).unwrap()
      console.log('Password update response:', response)
      
      toast.success("Password changed successfully!")
      form.reset()
    } catch (error: any) {
      console.error('Password update error:', error)
      toast.error("Failed to change password", {
        description: error?.data?.message || "Please check your current password and try again.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter your current password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? "Hide" : "Show"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter your new password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? "Hide" : "Show"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Changing Password..." : "Change Password"}
        </Button>
      </form>
    </Form>
  )
} 