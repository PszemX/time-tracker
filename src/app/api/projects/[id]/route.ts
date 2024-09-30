import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

interface TimeEntryResponse {
	id: number;
	description: string;
	duration: number;
	date: string;
	projectId: number;
	userId: number;
}

interface ProjectResponse {
	id: number;
	name: string;
	userId: number;
	timeEntries: TimeEntryResponse[];
}

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const projectId = parseInt(params.id, 10);
	if (isNaN(projectId)) {
		return NextResponse.json(
			{ message: "Invalid project identifier" },
			{ status: 400 }
		);
	}

	try {
		const project = await prisma.project.findUnique({
			where: { id: projectId },
			include: { timeEntries: true },
		});

		if (!project) {
			return NextResponse.json(
				{ message: "Project not found" },
				{ status: 404 }
			);
		}

		if (project.userId !== userId) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const sanitizedProject: ProjectResponse = {
			...project,
			timeEntries: project.timeEntries.map((entry) => ({
				...entry,
				date: entry.date.toISOString(),
			})),
		};

		return NextResponse.json(sanitizedProject, { status: 200 });
	} catch (error) {
		console.error("Error fetching project:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const projectId = parseInt(params.id, 10);
	if (isNaN(projectId)) {
		return NextResponse.json(
			{ message: "Invalid project ID" },
			{ status: 400 }
		);
	}

	try {
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

		await prisma.project.delete({
			where: { id: projectId },
		});

		return NextResponse.json(
			{ message: "Project deleted" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting project:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}
