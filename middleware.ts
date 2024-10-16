import NextAuth from "next-auth";
import { authConfig } from "./src/app/admin/authconfig";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'],
};
