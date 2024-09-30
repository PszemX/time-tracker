import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

interface TimeEntryResponse {
	id: string;
	date: string;
	duration: number;
	description: string;
	projectId: number;
	projectName: string;
}

interface TimeEntryCreateRequest {
	description: string;
	duration: number;
	projectId: number;
}

export async function GET(request: Request) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const timeEntries = await prisma.timeEntry.findMany({
			where: { userId },
			include: {
				project: {
					select: { name: true },
				},
			},
		});

		const serializedTimeEntries: TimeEntryResponse[] = timeEntries.map(
			(entry) => ({
				id: entry.id.toString(),
				date: entry.date.toISOString().split("T")[0],
				duration: entry.duration,
				description: entry.description,
				projectId: entry.projectId,
				projectName: entry.project.name,
			})
		);

		return NextResponse.json(serializedTimeEntries, { status: 200 });
	} catch (error) {
		console.error("Error fetching time entries:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { description, duration, projectId } =
			(await request.json()) as TimeEntryCreateRequest;

		if (!description || typeof description !== "string") {
			return NextResponse.json(
				{ message: "Invalid description" },
				{ status: 400 }
			);
		}

		if (typeof duration !== "number" || duration <= 0) {
			return NextResponse.json(
				{ message: "Invalid duration" },
				{ status: 400 }
			);
		}

		if (typeof projectId !== "number") {
			return NextResponse.json(
				{ message: "Invalid project ID" },
				{ status: 400 }
			);
		}

		const project = await prisma.project.findUnique({
			where: { id: projectId },
		});

		if (!project || project.userId !== userId) {
			return NextResponse.json(
				{
					message:
						"Project does not exist or does not belong to user",
				},
				{ status: 400 }
			);
		}

		const timeEntry = await prisma.timeEntry.create({
			data: {
				description,
				duration,
				projectId,
				userId,
			},
		});

		const serializedTimeEntry: TimeEntryResponse = {
			id: timeEntry.id.toString(),
			date: timeEntry.date.toISOString().split("T")[0],
			duration: timeEntry.duration,
			description: timeEntry.description,
			projectId: timeEntry.projectId,
			projectName: project.name,
		};

		return NextResponse.json(serializedTimeEntry, { status: 201 });
	} catch (error) {
		console.error("Error creating time entry:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id } = (await request.json()) as { id: string };

		if (!id) {
			return NextResponse.json(
				{ message: "Invalid time entry ID" },
				{ status: 400 }
			);
		}

		const timeEntry = await prisma.timeEntry.findUnique({
			where: { id: parseInt(id, 10) },
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
			where: { id: parseInt(id, 10) },
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
