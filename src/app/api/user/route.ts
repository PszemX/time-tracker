import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
	const token = request.cookies.get("token")?.value;

	if (!token) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(JWT_SECRET)
		);
		const userId = payload.userId as number;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ email: user.email });
	} catch (error) {
		console.error("Error verifying token:", error);
		return NextResponse.json({ message: "Invalid token" }, { status: 401 });
	}
}
