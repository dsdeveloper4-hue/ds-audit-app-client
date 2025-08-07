import { NextResponse, type NextRequest } from "next/server";

// ✅ Your Node.js verification endpoint
const VERIFY_ENDPOINT = process.env.AUTH_VERIFY_URL!;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("Auth_Token")?.value;
  console.log(token);
  const pathname = req.nextUrl.pathname;

  if (!token && pathname === "/login") {
    return NextResponse.next();
  }

  if (!token) {
    return redirectToLogin(req);
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL(`/`, req.url));
  }

  try {
    const verifyRes = await fetch(VERIFY_ENDPOINT, {
      method: "GET",
      headers: {
        Cookie: `Auth_Token=${token}`,
      },
    });
    if (!verifyRes.ok) {
      // Invalid or expired token
      return redirectToLogin(req);
    }

    const data = await verifyRes.json();
    return NextResponse.next(data);
  } catch (error) {
    //  Error while verifying
    console.log(error);
    return redirectToLogin(req);
  }
}

// 🔁 Redirects to login page with `next` query param
function redirectToLogin(req: NextRequest) {
  return NextResponse.redirect(new URL(`/login`, req.url));
}

export const config = {
  matcher: [
    "/((?!register|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|css|js)).*)",
  ],
};
