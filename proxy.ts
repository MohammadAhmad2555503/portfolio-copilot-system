import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "copilot_access";

function isValidKey(key: string | null) {
  const expected = process.env.COPILOT_ACCESS_KEY;
  return Boolean(expected && key && key === expected);
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const key = searchParams.get("key");

  if (pathname.startsWith("/copilot") && key) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("key");

    if (!isValidKey(key)) {
      redirectUrl.searchParams.set("invalid", "1");
      return NextResponse.redirect(redirectUrl);
    }

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    return response;
  }

  if (pathname.startsWith("/api/applications")) {
    const apiKey = request.headers.get("x-copilot-key") ?? key;
    const hasCopilotCookie = request.cookies.get(COOKIE_NAME)?.value === "1";
    if (!isValidKey(apiKey) && !hasCopilotCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/copilot/:path*", "/api/applications/:path*"]
};

