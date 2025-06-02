import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/signup",
];

// Define routes that are restricted to specific roles
const restrictedRoutes = {
  "/home": ["admin", "teacher", "student"],
  "/profile": ["student", "admin", "teacher"],
  "/project": ["student", "admin", "teacher"],
  "/project/submit": ["student"],
  "/project/submitfeedback": ["teacher"],
  "/student": ["admin", "teacher"],
  "/setting": ["student", "admin", "teacher"],
  "/proposal": ["student", "admin", "teacher"],
  "/proposal/submit": ["student"],
  "/proposal/submitfeedback": ["teacher"],
};

// Define specific routes that should be strictly restricted
const strictRoutes = {
  "/proposal/submitfeedback": ["teacher"],
  "/project/submitfeedback": ["teacher"],
  "/proposal/submit": ["student"],
  "/project/submit": ["student"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token");

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Parse the JWT token to get user role
    const tokenData = JSON.parse(atob(token.value.split(".")[1]));
    const userRole = tokenData.role;

    // First check if the path matches any strict routes
    const strictMatch = Object.entries(strictRoutes).find(([route]) =>
      pathname.startsWith(route)
    );

    if (strictMatch) {
      const [route, allowedRoles] = strictMatch;
      if (!allowedRoles.includes(userRole)) {
        console.log(
          `Access denied: User with role ${userRole} attempted to access ${pathname}`
        );
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    // If no strict match, check regular restricted routes
    const matchingRoute = Object.entries(restrictedRoutes).find(([route]) =>
      pathname.startsWith(route)
    );

    if (matchingRoute) {
      const [route, allowedRoles] = matchingRoute;
      if (!allowedRoles.includes(userRole)) {
        console.log(
          `Access denied: User with role ${userRole} attempted to access ${pathname}`
        );
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/project/:path*",
    "/student/:path*",
    "/setting/:path*",
    "/proposal/:path*",
  ],
};
