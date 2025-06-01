import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE_URL } from "@/config/api.config";
import SignupPage from "@/components/auth-component/signup";
import Navbar from "@/components/landing-page-component/navbar";

// This is the page component that will be rendered
export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center space-y-8">  
      <Navbar />
      <div className="max-w-4xl w-full space-y-8">
        <SignupPage />
      </div>
    </div>
  );
}

// // This handles the API POST request
// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const data = JSON.parse(formData.get("data") as string);
//     const profileImage = formData.get("profileImage") as File | null;

//     // Forward the request to the backend API
//     const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ...data,
//         profileImage: profileImage ? profileImage.name : null,
//       }),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: result.message || "Failed to register user" },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(result, { status: 201 });
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json(
//       { error: "Failed to register user" },
//       { status: 500 }
//     );
//   }
// }
