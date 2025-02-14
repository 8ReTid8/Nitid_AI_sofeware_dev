import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
// import { compare } from "bcrypt";
import { verify } from "argon2";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  session:{
    strategy: "jwt",
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
          return null;
        }
        
        const existingUser = await prisma.user.findUnique({
          where: {
            user_email: credentials?.email
          }
        })
        
        if (!existingUser) {
          return null;
        }
        
        const passwordMatch = await verify(existingUser.user_password,credentials.password);
        
        if(!passwordMatch){
          return null;
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
    async jwt({token, user}) {
      if (user) {
        return {
          ...token,
          // id: user.id,
          // email: user.email,
          // name: user.name,
          role: user.role,
        }
      }
      return token;
    },
    async session({session, token}) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        }
      }
    },
  }
}

export const authSession = async () =>{
  return getServerSession(authOptions);
}