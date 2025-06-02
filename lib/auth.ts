import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";

// Extend NextAuth types to include custom properties
import { DefaultSession } from "next-auth";
import { getUserRestaurants } from "./restaurants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      restaurants: any[];
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    restaurants?: any[];
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
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: credentials.email },
        });

        if (!utilisateur) {
          throw new Error("Utilisateur non trouvé");
        }

        const passwordValid = await compare(
          credentials.password,
          utilisateur.mot_de_passe_hash
        );

        if (!passwordValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: utilisateur.id,
          email: utilisateur.email,
          name: `${utilisateur.prénom || ""} ${utilisateur.nom || ""}`.trim() || utilisateur.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;

        // Récupérer les restaurants et rôles de l'utilisateur
        const restaurants = await getUserRestaurants(user.id);
        token.restaurants = restaurants;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.restaurants = token.restaurants as any[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);