import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE_URL } from "@/config/api.config";
import SignupPage from "@/components/auth-component/signup";

// This is the page component that will be rendered
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <SignupPage />
      </div>
    </div>
  );
}
