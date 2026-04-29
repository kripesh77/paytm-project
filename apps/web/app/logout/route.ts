import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/signin", process.env.NEXT_PUBLIC_APP_URL),
  );

  res.cookies.set("auth_token", "", {
    httpOnly: true,
    maxAge: 0, // deletes cookie
    path: "/",
  });

  return res;
}
