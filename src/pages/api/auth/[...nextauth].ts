import { NextAuthOptions, RequestInternal } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { api } from '@/api';
/**
 * 🔹 User étendu uniquement pour CE fichier
 */
interface ExtendedUser {
  id: string;
  name?: string;
  email?: string;
  isApproved?: boolean;
  access_token: string;
  refresh_token: string;
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        usernameOrEmail: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
authorize: async (credentials) => {
  try {
    console.log("LOGIN INPUT:", credentials);

    const data = await api.auth.signIn({
      usernameOrEmail: credentials!.usernameOrEmail,
      password: credentials!.password,
    });

    console.log("BACKEND RESPONSE:", data);

    return {
      id: data.user.id,
      name: data.user.username,
      email: data.user.email,
      isApproved: data.user.isApproved,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    } as any;

  } catch (err: any) {
    console.log("BACKEND ERROR:", err.response?.data);
    throw new Error(err.response?.data?.message || "Login failed");
  }
}
    })
  ],

 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      const extendedUser = user as any;

      token.access_token = extendedUser.access_token;
      token.refresh_token = extendedUser.refresh_token;
      token.isApproved = extendedUser.isApproved;
    }

    return token;
  },


  async session({ session, token }) {
    if (session.user) {
      (session.user as any).isApproved = token.isApproved;
      (session as any).access_token = token.access_token;
      (session as any).refresh_token = token.refresh_token;
    }
    return session;
  }
},
  
  pages: {
    signIn: '/auth'
  },

  session: {
    strategy: 'jwt'
  },

  secret: process.env.NEXTAUTH_SECRET as string
};

export default NextAuth(authOptions);