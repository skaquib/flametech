import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const path = req.nextUrl.pathname

  if (path.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin-login", req.url))
    }
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}

