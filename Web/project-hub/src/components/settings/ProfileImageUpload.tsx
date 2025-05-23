"use client"

import { useRef, useState } from "react"
import { useGetUserQuery, useUpdateUserMutation } from "@/features/profileApi/profileApi"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"
import * as z from "zod"

// Define the image validation schema
const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only JPG, PNG and GIF files are allowed"
    ),
})

export function ProfileImageUpload() {
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Validate file
      imageSchema.parse({ file })

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Invalid image file", {
          description: error.errors[0].message,
        })
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast.error("Missing required information", {
        description: "Please select an image file to upload.",
      })
      return
    }

    try {
      // Validate file again before upload
      imageSchema.parse({ file })

      // Create FormData and append the file
      const formData = new FormData()
      formData.append('file', file)
      
      // Update the profile with the file
      await updateUser(formData).unwrap()
      
      toast.success("Profile image updated successfully!", {
        description: "Your profile image has been updated.",
      })
      
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
      if (error instanceof z.ZodError) {
        toast.error("Invalid image file", {
          description: error.errors[0].message,
        })
      } else {
        toast.error("Failed to update profile image", {
          description: "Please try again later.",
        })
      }
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={previewUrl || user?.data.imageUrl || undefined}
            alt={user?.data.fullName || "Profile"}
            onError={(e) => {
              // Hide the image on error and show the fallback
              e.currentTarget.style.display = 'none'
            }}
          />
          <AvatarFallback className="text-2xl">
            {user?.data.fullName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        {previewUrl && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoadingUser || isUpdating}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
        {previewUrl && (
          <Button
            onClick={handleUpload}
            disabled={isLoadingUser || isUpdating}
            className="w-full"
          >
            {isUpdating ? "Uploading..." : "Save Changes"}
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Upload a profile image (max 5MB). Supported formats: JPG, PNG, GIF
      </p>
    </div>
  )
} 