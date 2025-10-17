import NextAuth from "next-auth";
import "next-auth/jwt";

import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider: string;
      email: string;
      name: string;
      type: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.login,
          email: profile.email,
        };
      },
    }),
  ],
  basePath: "/auth",
  callbacks: {
    jwt({ token, trigger, session, account }) {
      if (account) {
        token.id = account.providerAccountId;
        token.provider = account.provider;
        token.type = account.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.type = token.type as string;
      }

      return session;
    },
  },
});
