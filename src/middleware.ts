import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TEMPORARILY DISABLED AUTHENTICATION
// This middleware allows all requests to pass through without authentication
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

// Uncomment below to re-enable authentication:
// import { withAuth } from "next-auth/middleware";
// export default withAuth(
//   function middleware(req) {
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );
// export const config = {
//   matcher: ["/protected/:path*"],
// };
