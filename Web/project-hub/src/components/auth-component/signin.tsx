import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Login to Project-HUB</h2>
        <div className="mt-2 h-1 w-12 bg-blue-600 mx-auto"></div>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="text-sm">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700"
          >
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Log In
        </Button>
        <div className="text-center text-sm">
          Not registered?{" "}
          <Link href="/api/auth/signup" className="text-blue-600 hover:text-blue-700">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
