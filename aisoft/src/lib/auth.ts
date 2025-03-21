import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
// import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";
import { verify } from "argon2";

declare module "next-auth" {
  interface User {
    role: string;
    id: string;
  }
  interface Session {
    user: {
      role: string;
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role: string;
  }
}
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  pages: {
    signIn: "/login", // Displays signin form at /login
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            user_email: credentials?.email
          }
        })

        if (!existingUser) {
          throw new Error("email_not_found");
        }

        const passwordMatch = await verify(existingUser.user_password, credentials.password);

        if (!passwordMatch) {
          throw new Error("password_incorrect");
        }

        return {
          id: `${existingUser.user_id}`,
          email: existingUser.user_email,
          name: existingUser.user_name,
          role: existingUser.user_role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // return {
        //   ...token,
        //   // id: user.id,
        //   // email: user.email,
        //   // name: user.name,
        //   role: user.role,
        // }
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // return {
      //   ...session,
      //   user: {
      //     ...session.user,
      //     role: token.role,
      //   }
      // }
      session.user.id = token.id ?? "";
      session.user.role = token.role;
      return session;
    },
  }
}

export const authSession = async () => {
  return getServerSession(authOptions);
}