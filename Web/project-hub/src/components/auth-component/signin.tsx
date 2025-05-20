"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { useLoginMutation } from "@/features/auth/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (!error) return "";
  if ("status" in error) {
    const errorData = (error as FetchBaseQueryError).data as any;
    return errorData?.message || "An error occurred during login";
  }
  return error.message || "An error occurred during login";
};

const Login = () => {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      await login(data).unwrap();
      toast.success("Login successful!");
      router.push("/home");
    } catch (err) {
      toast.error(getErrorMessage(err as FetchBaseQueryError | SerializedError));
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Login to Project-HUB</h2>
        <div className="mt-2 h-1 w-12 bg-blue-600 mx-auto"></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          <div className="text-center text-sm">
            Not registered?{" "}
            <Link
              href="/api/auth/signup"
              className="text-blue-600 hover:text-blue-700"
            >
              Create an Account
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
