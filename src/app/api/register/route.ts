import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
	const { email, password } = await request.json();

	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		return NextResponse.json(
			{ message: "User already exists" },
			{ status: 400 }
		);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			isEmailConfirmed: false,
		},
	});

	const confirmLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm-email?token=${user.id}`;

	return NextResponse.json(
		{ message: "User registered", confirmLink },
		{ status: 201 }
	);
}
