import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.phone || !credentials?.password) return null
  
          const existingUser = await db.user.findFirst({
            where: { number: credentials.phone },
          })
  
          if (existingUser) {
            const passwordValidation = await bcrypt.compare(
              credentials.password,
              existingUser.password
            )
            if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name ?? "",
                email: existingUser.number, // ⚡ number stored in email field
              }
            }
            return null
          }
  
          // if user doesn’t exist → create
          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const user = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
            },
          })
  
          return {
            id: user.id.toString(),
            name: user.name ?? "",
            email: user.number,
          }
        },
      }),
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async signIn({ user, account }) {
          // Example: allow Google & GitHub sign in only
          if (account?.provider === "google" || account?.provider === "github") {
            if (user.email) {
              return true
            }
          }
      
          // If it's credentials provider, always allow (since you validated in authorize)
          if (account?.provider === "credentials") {
            return true
          }
      
          return false
        },
        async session({ session, token }) {
          if (token?.sub && session.user) {
            (session.user as any).id = token.sub
          }
          return session
        },
      }
  }
  
  