import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;
        if (!user.isActive) return null;

        // Agents must be approved before they can login
        if (user.role === "AGENT" && !user.isApproved) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          agentCode: user.agentCode,
          isApproved: user.isApproved,
          avatar: user.avatar,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role      = (user as any).role;
        token.id        = user.id;
        token.agentCode = (user as any).agentCode;
        token.isApproved= (user as any).isApproved;
        token.avatar    = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role       = token.role;
        (session.user as any).id         = token.id;
        (session.user as any).agentCode  = token.agentCode;
        (session.user as any).isApproved = token.isApproved;
        (session.user as any).avatar     = token.avatar;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
