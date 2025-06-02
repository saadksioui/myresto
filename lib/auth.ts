import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    utilisateur: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      restaurants?: any[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    restaurants?: any[];
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const utilisateur = await prisma.utilisateurs.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!utilisateur) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          utilisateur.mot_de_passe_hash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: utilisateur.id,
          email: utilisateur.email
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.utilisateur) {
        session.utilisateur.id = token.id as string;
        session.utilisateur.restaurants = token.restaurants as any[];
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.restaurants = (user as any).restaurants;
      }
      return token;
    }
  },
};

export async function getServerSession() {
  return await import("next-auth").then((mod) =>
    mod.getServerSession(authOptions)
  );
}