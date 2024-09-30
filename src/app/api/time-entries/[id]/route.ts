import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const timeEntryId = parseInt(params.id, 10);
	if (isNaN(timeEntryId)) {
		return NextResponse.json(
			{ message: "Invalid time entry ID" },
			{ status: 400 }
		);
	}

	try {
		const timeEntry = await prisma.timeEntry.findUnique({
			where: { id: timeEntryId },
		});

		if (!timeEntry || timeEntry.userId !== userId) {
			return NextResponse.json(
				{
					message:
						"Time entry does not exist or does not belong to user",
				},
				{ status: 400 }
			);
		}

		await prisma.timeEntry.delete({
			where: { id: timeEntryId },
		});

		return NextResponse.json(
			{ message: "Time entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting time entry:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}
