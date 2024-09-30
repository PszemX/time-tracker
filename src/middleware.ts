import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const protectedRoutes = [
		"/dashboard",
		"/projects",
		"/timer",
		"/api/projects",
		"/api/time-entries",
	];

	const isProtected = protectedRoutes.some((route) => {
		if (route.includes(":path*")) {
			const baseRoute = route.split("/:path*")[0];
			return pathname.startsWith(baseRoute);
		}
		return pathname === route || pathname.startsWith(`${route}/`);
	});

	if (isProtected) {
		const token = request.cookies.get("token")?.value;

		if (!token) {
			console.log("No token, redirecting to /login");
			if (pathname.startsWith("/api/")) {
				return NextResponse.json(
					{ message: "No authorization" },
					{ status: 401 }
				);
			} else {
				return NextResponse.redirect(new URL("/login", request.url));
			}
		}

		try {
			await jwtVerify(token, JWT_SECRET);
			console.log("Token valid, allowing access");
			return NextResponse.next();
		} catch (error) {
			console.error("Token verification failed:", error);
			if (pathname.startsWith("/api/")) {
				return NextResponse.json(
					{ message: "No authorization" },
					{ status: 401 }
				);
			} else {
				return NextResponse.redirect(new URL("/login", request.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/projects/:path*",
		"/timer/:path*",
		"/api/projects/:path*",
		"/api/time-entires/:path*",
	],
};
