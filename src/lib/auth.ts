import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getUserIdFromRequest(
	request: Request
): Promise<number | null> {
	const cookie = request.headers.get("cookie");
	const token = cookie
		?.split(";")
		.find((c) => c.trim().startsWith("token="))
		?.split("=")[1];

	if (!token) {
		return null;
	}

	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return typeof payload.userId === "number" ? payload.userId : null;
	} catch (error) {
		console.error("Token verification failed:", error);
		return null;
	}
}
