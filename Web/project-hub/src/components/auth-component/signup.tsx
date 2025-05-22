"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignupMutation } from "@/features/auth/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
    role: z.literal("community")
});

type SignupFormValues = z.infer<typeof signupSchema>;

const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (!error) return "";
  if ("status" in error) {
    const errorData = (error as FetchBaseQueryError).data as any;
    return errorData?.message || "Failed to create account";
  }
  return error.message || "Failed to create account";
};

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading, error }] = useSignupMutation();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "community"
    },
  });

  async function onSubmit(data: SignupFormValues) {
    try {
      const result = await signup(data).unwrap();
      console.log("Signup successful:", result);
      
      toast.success("Account created successfully!");
      router.replace("/");
        
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(getErrorMessage(err as FetchBaseQueryError | SerializedError));
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Create Account</h2>
        <div className="mt-2 h-1 w-12 bg-blue-600 mx-auto"></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-sm text-red-600 text-center">
              {getErrorMessage(error)}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

