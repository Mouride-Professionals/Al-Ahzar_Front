import { keycloakProvider, strapiProvider } from '@osnmarket/session-providers';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider(keycloakProvider),
    CredentialsProvider(strapiProvider),
  ],
};

export default NextAuth(authOptions);
