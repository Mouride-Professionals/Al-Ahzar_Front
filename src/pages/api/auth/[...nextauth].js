import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { keycloakProvider, strapiProvider } from 'src/lib//authProviders';
;

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider(keycloakProvider),
    CredentialsProvider(strapiProvider),
  ],
  pages: {
    signIn: '/user/auth', // Page personnalisée de connexion (optionnel)
  },
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter le token JWT de l'utilisateur après l'authentification
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajouter les informations utilisateur à la session
      session.user = {
        id: token.id,
        username: token.username,
        firstName: token.firstName,
        lastName: token.lastName,
        email: token.email,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
