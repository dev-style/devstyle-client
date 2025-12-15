import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { connectToDB } from "./lib/utils";
import bcrypt from "bcrypt";
import UserModel from "./models/user";

const login = async (credentials:{username:string,password:string}) => {
  try {
    connectToDB();
    const user = await UserModel.findOne({ username: credentials.username });
    // console.log("user in login function", user);
    if (!user || user.role!="admin") throw new Error("Wrong credentials!");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Wrong credentials!");

    return user;
  } catch (err) {
    // console.log(err);
    throw new Error("Failed to login!");
  }
};

export const authOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials as { username: string; password: string });
          // console.log("user after login", user);
          return {
            
          };
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  
  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.username = user.username;
        token.avatar = user.avatar?.url;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token) {
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
};

export const { signIn, signOut, auth } = NextAuth(authOptions);
