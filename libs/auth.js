export const { handlers, auth, signIn, signOut } = NextAuth({

  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET || "temp_dev_secret_123",

  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Email Provider removed for now as it requires database adapter
  ],

  // Database persistence disabled for now (Session only)
  // adapter: SupabaseAdapter(...) // TODO: Enable later


  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
}); 