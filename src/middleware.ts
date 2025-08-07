import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("Auth_Token")?.value;
  const pathname = req.nextUrl.pathname;

  // Let unauthenticated users access the login page
  if (!token && pathname === "/login") {
    return NextResponse.next();
  }

  // Redirect to login if no token is found
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Skip re-authentication if already logged in
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const verifyRes = await fetch(process.env.AUTH_VERIFY_URL as string, {
      method: "GET",
      headers: {
        Cookie: `Auth_Token=${token}`,
      },
    });

    if (!verifyRes.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    // Protect all routes except static files and login/register
    "/((?!_next|api/auth/login|api/auth/register|favicon.ico).*)",
  ],
};