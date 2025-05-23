"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Plus, X } from "lucide-react"

const skillsSchema = z.object({
  skills: z.array(z.string().min(1, "Skill cannot be empty")),
}) 

type SkillsFormValues = z.infer<typeof skillsSchema>;

export function SkillsForm() {
  const { data: userData, isLoading } = useGetUserQuery()
  const [updateUser] = useUpdateUserMutation()

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: (userData?.data.skills as string[]) || [],
    },
  })

  const { fields, append, remove } = useFieldArray<{ skills: string[] }, never, "id", { skills: string[] }>({
    control: form.control,
    name: "skills" as never
  });

  async function onSubmit(data: SkillsFormValues) {
    try {
      const formData = new FormData();
      formData.append('skills', JSON.stringify(data.skills));

      const result = await updateUser(formData).unwrap();
      console.log('Update result:', result);
      toast.success("Skills updated successfully");
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Failed to update skills");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`skills.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill {index + 1}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append("")}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  )
} 