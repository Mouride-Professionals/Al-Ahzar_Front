import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { keycloakProvider, strapiProvider } from 'src/lib//authProviders';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider(keycloakProvider),
    CredentialsProvider(strapiProvider),
  ],
  pages: {
    signIn: '/user/auth',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.accessToken = user.token;
        token.schoolYear = user.schoolYear || null; // Store schoolYear in token

      }
      return token;
    },
    async session({ session, token }) {
      // add user to session
      session.user = {
        id: token.id,
        username: token.username,
        firstName: token.firstName,
        lastName: token.lastName,
        email: token.email,
        accessToken: token.accessToken,
      };
      session.schoolYear = token.schoolYear || null; // Attach schoolYear to session

      return session;
    },

  },
};

export default NextAuth(authOptions);
