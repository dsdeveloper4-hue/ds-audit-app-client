import { NextResponse, type NextRequest } from "next/server";

// ✅ Your Node.js verification endpoint
const VERIFY_ENDPOINT = process.env.AUTH_VERIFY_URL!;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("Auth_Token")?.value;

if (!token) {
  return redirectToLogin(req);
}

try {
  const verifyRes = await fetch(VERIFY_ENDPOINT, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!verifyRes.ok) {
    // ❌ Invalid or expired token
    return redirectToLogin(req);
  }

  const data = await verifyRes.json();
  // ✅ Verified – allow the request to continue
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", data.user?.id || "");
  requestHeaders.set("x-user-role", data.user?.role || "");

  return NextResponse.next({ request: { headers: requestHeaders } });
} catch (error) {
  // ❌ Error while verifying
  return redirectToLogin(req);
}
}

// 🔁 Redirects to login page with `next` query param
function redirectToLogin(req: NextRequest) {
  return NextResponse.redirect(new URL(`/login`, req.url));
}

// 🔍 Routes to protect
export const config = {
  matcher: [
    // Protect everything except these paths
    "/((?!_next/|api/auth|login|register|public).*)",
  ],
};
