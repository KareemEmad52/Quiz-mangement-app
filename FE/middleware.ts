import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);
const protectedRoutes = ["/home", "/ar/admin", "/home/students"];
const adminRoutes = ["/home/students","/home/generate-quiz"];

interface userType {
  token: string;
  role: string;
}

export default async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Remove the locale prefix (en/ or ar/) for route matching
  const pathWithoutLocale = path.replace(/^\/(?:en|ar)/, "");
  const locale = path.match(/^\/(?:en|ar)/)?.[0].replace("/", "") || "en";

  // Redirect to the home page if the path is empty
  if (pathWithoutLocale === "") {
    return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
  }

  // Check if it's a protected route using the path without locale
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale === `${route}/`
    // pathWithoutLocale === "" // This catches /ar or /en
  );

  const isAdminRoute = adminRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale === `${route}/`
  );

  const cookies = req.cookies;
  const userCookie = cookies.get("user");

  if (isProtectedRoute) {
    if (!userCookie) {
      // Get the current locale or default to 'en'
      const locale = path.match(/^\/(?:en|ar)/)?.[0].replace("/", "") || "en";
      const loginUrl = new URL(`/${locale}/login`, req.url);
      // redirect to the login page
      return NextResponse.redirect(loginUrl);
    }

    const user: userType = JSON.parse(userCookie.value);

    if (isAdminRoute) {
      try {
        if (user.role !== "admin") {
          return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
        }
      } catch (error) {
        const loginUrl = new URL(`/${locale}/login`, req.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|static|.*\\..*$).*)", "/(ar|en)/:path*"],
};
