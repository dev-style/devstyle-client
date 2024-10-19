// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { User } from "next-auth";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       id: "credentials",
//       credentials: {
//         email: {
//           label: "email",
//           type: "email",
//         },
//         password: {
//           label: "password",
//           type: "password",
//         },
//       },
//       async authorize(credentials, request): Promise<User | null> {
//         if (
//           credentials?.email === "sado@gmail.com" &&
//           credentials?.password === "sado"
//         ) {
//           return { id: "1", name: "Admin" };
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/admin/login",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };



import { authOptions } from '@/app/admin/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }