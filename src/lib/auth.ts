import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "./prisma"
import * as bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isAdminLogin: { label: "Is Admin Login", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isValid) {
            return null
          }

          const isAdminAttempt = credentials.isAdminLogin === "true"
          if (isAdminAttempt && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company || "",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
})
export type Auth = typeof auth;
