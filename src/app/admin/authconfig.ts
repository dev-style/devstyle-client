// export const authConfig = {
//   providers:[],
//   pages: {
//     signIn: "/admin/login",
//   },
//   callbacks: {
//     authorized({ auth, request }) {
//       const isLoggedIn = auth?.user;
//       const isOnDashboard = request.nextUrl.pathname.startsWith("/admin/dashboard");
//       if (isOnDashboard) {
//         if (isLoggedIn) return true;
//         return false;
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL("/admin/dashboard", request.nextUrl));
//       }
//       return true;
//     },
//   },
// };
