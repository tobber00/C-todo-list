import NextAuth from "next-auth";

import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  providers: [GitHub],
  basePath: "/auth",
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
});
