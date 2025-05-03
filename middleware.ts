import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Define routes configuration
const publicRoutes = ["/", "/login", "/register", "/aboutus", "/contact"];
const catalogRoutes = ["/catalog"];
const adminRoutes = ["/admin"];
const protectedRoutes = ["/cart", "/checkout"];

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const path = request.nextUrl.pathname;

    // Allow public routes and catalog routes
    if (
      publicRoutes.some((route) => path.startsWith(route)) ||
      catalogRoutes.some((route) => path.startsWith(route))
    ) {
      return NextResponse.next();
    }

    // Check authentication for protected routes
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // Admin routes protection
    if (adminRoutes.some((route) => path.startsWith(route))) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
