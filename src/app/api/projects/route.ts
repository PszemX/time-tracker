import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

interface TimeEntryResponse {
	id: string;
	date: string;
	duration: number;
	description: string;
}

interface ProjectResponse {
	id: number;
	name: string;
	timeEntries: TimeEntryResponse[];
}

interface ProjectCreateRequest {
	name: string;
}

export async function GET(request: Request) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const perPage = parseInt(searchParams.get("perPage") || "5", 10);
	const sortField = searchParams.get("sortField") || "id";
	const sortOrder =
		searchParams.get("sortOrder")?.toLowerCase() === "desc"
			? "desc"
			: "asc";

	const allowedSortFields = ["id", "name", "createdAt"];
	if (!allowedSortFields.includes(sortField)) {
		return NextResponse.json(
			{ message: "Invalid sort field" },
			{ status: 400 }
		);
	}

	const allowedSortOrders = ["asc", "desc"];
	if (!allowedSortOrders.includes(sortOrder)) {
		return NextResponse.json(
			{ message: "Invalid sort order" },
			{ status: 400 }
		);
	}

	try {
		const projects = await prisma.project.findMany({
			where: { userId },
			skip: (page - 1) * perPage,
			take: perPage,
			orderBy: { [sortField]: sortOrder },
			include: {
				timeEntries: {
					select: {
						id: true,
						description: true,
						duration: true,
						date: true,
					},
				},
			},
		});

		const serializedProjects: ProjectResponse[] = projects.map(
			(project) => ({
				id: project.id,
				name: project.name,
				timeEntries: project.timeEntries.map((entry) => ({
					id: entry.id.toString(),
					description: entry.description,
					duration: entry.duration,
					date: entry.date.toISOString().split("T")[0],
				})),
			})
		);

		return NextResponse.json(serializedProjects, { status: 200 });
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const userId = await getUserIdFromRequest(request);
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { name } = (await request.json()) as ProjectCreateRequest;

		if (!name || typeof name !== "string" || name.trim() === "") {
			return NextResponse.json(
				{ message: "Invalid project name" },
				{ status: 400 }
			);
		}

		const newProject = await prisma.project.create({
			data: {
				name: name.trim(),
				userId,
			},
			include: {
				timeEntries: true,
			},
		});

		const serializedProject: ProjectResponse = {
			id: newProject.id,
			name: newProject.name,
			timeEntries: newProject.timeEntries.map((entry) => ({
				id: entry.id.toString(),
				description: entry.description,
				duration: entry.duration,
				date: entry.date.toISOString().split("T")[0],
			})),
		};

		return NextResponse.json(serializedProject, { status: 201 });
	} catch (error) {
		console.error("Error creating project:", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}
