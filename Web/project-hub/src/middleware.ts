import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/signup', '/api/auth/login', '/api/auth/signup'];

// Define routes that are restricted to specific roles
const restrictedRoutes = {
  '/home': [ 'admin', 'teacher', 'student' ],
  '/profile': ['student', 'admin', 'teacher'],
  '/project': ['student', 'admin', 'teacher'],
  '/student': ['admin', 'teacher'],
  '/setting': ['student', 'admin', 'teacher'],
  '/proposal': ['student', 'admin', 'teacher'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token');

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Parse the JWT token to get user role
    const tokenData = JSON.parse(atob(token.value.split('.')[1]));
    const userRole = tokenData.role;

    // Check if the current path is restricted
    const isRestrictedRoute = Object.keys(restrictedRoutes).some(route => 
      pathname.startsWith(route)
    );

    if (isRestrictedRoute) {
      // Check if user's role has access to this route
      const hasAccess = Object.entries(restrictedRoutes).some(([route, allowedRoles]) => 
        pathname.startsWith(route) && allowedRoles.includes(userRole)
      );

      if (!hasAccess) {
        // Redirect community users to the landing page
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/home/:path*',
    '/profile/:path*',
    '/project/:path*',
    '/student/:path*',
    '/setting/:path*',
    '/proposal/:path*',
  ]
};
