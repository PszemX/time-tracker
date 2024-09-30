/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Plus, Trash2, Timer } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import React from "react";

interface Project {
	id: number;
	name: string;
	timeEntries: TimeEntry[];
}

interface TimeEntry {
	id: number;
	description: string;
	duration: number;
	date: string;
}

interface SortButtonProps {
	children: React.ReactNode;
	isActive: boolean;
	direction: "asc" | "desc";
	onClick: () => void;
}

const SortButton = ({
	children,
	isActive,
	direction,
	onClick,
}: SortButtonProps) => (
	<Button
		variant="ghost"
		onClick={onClick}
		className="w-full justify-center flex items-center space-x-2"
	>
		<span>{children}</span>
		<span className="inline-flex items-center min-w-[16px]">
			{isActive &&
				(direction === "asc" ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				))}
		</span>
	</Button>
);

export default function ProjectsList() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [expandedProject, setExpandedProject] = useState<number | null>(null);
	const [sortField, setSortField] = useState<"id" | "name" | "totalTime">(
		"id"
	);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [newProjectName, setNewProjectName] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const projectsPerPage = 5;
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response: Project[] = await apiClient(
					`/api/projects?page=${currentPage}&perPage=${projectsPerPage}&sortField=${sortField}&sortOrder=${sortDirection}`
				);
				setProjects(response);
			} catch (err: any) {
				console.error("Error fetching projects:", err);
				setError("Failed to fetch projects.");
			}
		};

		fetchProjects();
	}, [currentPage, sortField, sortDirection]);

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}g ${minutes}m`;
	};

	const sortedProjects = [...projects].sort((a, b) => {
		if (sortField === "id") {
			return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
		} else if (sortField === "name") {
			return sortDirection === "asc"
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name);
		} else {
			const aTotalTime = a.timeEntries.reduce(
				(sum, entry) => sum + entry.duration,
				0
			);
			const bTotalTime = b.timeEntries.reduce(
				(sum, entry) => sum + entry.duration,
				0
			);
			return sortDirection === "asc"
				? aTotalTime - bTotalTime
				: bTotalTime - aTotalTime;
		}
	});

	const paginatedProjects = sortedProjects.slice(
		(currentPage - 1) * projectsPerPage,
		currentPage * projectsPerPage
	);

	const toggleSort = (field: "id" | "name" | "totalTime") => {
		if (field === sortField) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const handleAddProject = async () => {
		if (newProjectName.trim()) {
			try {
				const newProject: Project = await apiClient("/api/projects", {
					method: "POST",
					body: JSON.stringify({ name: newProjectName }),
				});
				setProjects([newProject, ...projects]);
				setNewProjectName("");
				setIsDialogOpen(false);
			} catch (err: any) {
				console.error("Error creating project:", err);
				setError("Failed to create project.");
			}
		}
	};

	const handleRemoveProject = async (projectId: number) => {
		try {
			await apiClient(`/api/projects/${projectId}`, {
				method: "DELETE",
			});
			setProjects(projects.filter((project) => project.id !== projectId));
		} catch (err: any) {
			console.error("Error deleting project:", err);
			setError("Failed to delete project.");
		}
	};

	const handleRemoveTask = async (taskId: number) => {
		try {
			await apiClient(`/api/time-entries/${taskId}`, {
				method: "DELETE",
			});
			setProjects(
				projects.map((project) => ({
					...project,
					timeEntries: project.timeEntries.filter(
						(entry) => entry.id !== taskId
					),
				}))
			);
			console.log("Task was successfully deleted");
		} catch (err: any) {
			console.error("Error deleting task:", err);
			setError("Failed to delete task.");
		}
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Lista projektów</CardTitle>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create new project
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create new project</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Input
									id="name"
									value={newProjectName}
									onChange={(e) =>
										setNewProjectName(e.target.value)
									}
									className="col-span-3"
									placeholder="Project name"
								/>
								<Button onClick={handleAddProject}>
									Create
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				{error && <p className="text-red-500">{error}</p>}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">
								<SortButton
									isActive={sortField === "id"}
									direction={sortDirection}
									onClick={() => toggleSort("id")}
								>
									ID
								</SortButton>
							</TableHead>
							<TableHead className="w-[200px]">
								<SortButton
									isActive={sortField === "name"}
									direction={sortDirection}
									onClick={() => toggleSort("name")}
								>
									Name
								</SortButton>
							</TableHead>
							<TableHead className="w-[150px]">
								<SortButton
									isActive={sortField === "totalTime"}
									direction={sortDirection}
									onClick={() => toggleSort("totalTime")}
								>
									Total time
								</SortButton>
							</TableHead>
							<TableHead className="justify-center flex items-center space-x-2">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedProjects.map((project) => (
							<React.Fragment key={project.id}>
								<TableRow>
									<TableCell className="w-[100px] pr-10 text-center align-middle">
										{project.id}
									</TableCell>
									<TableCell className="w-[200px] pr-10 text-center align-middle">
										{project.name}
									</TableCell>
									<TableCell className="w-[150px] pr-10 text-center align-middle">
										{formatDuration(
											project.timeEntries.reduce(
												(sum, entry) =>
													sum + entry.duration,
												0
											)
										)}
									</TableCell>
									<TableCell className="w-[100px] text-center align-middle">
										<div className="flex justify-center space-x-2">
											<Button
												variant="ghost"
												onClick={() =>
													setExpandedProject(
														expandedProject ===
															project.id
															? null
															: project.id
													)
												}
											>
												Details
											</Button>
											<Button
												variant="ghost"
												onClick={() =>
													handleRemoveProject(
														project.id
													)
												}
											>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
											<Link href={`/timer/${project.id}`}>
												<Button variant="ghost">
													<Timer className="h-4 w-4" />
												</Button>
											</Link>
										</div>
									</TableCell>
								</TableRow>
								{expandedProject === project.id && (
									<TableRow>
										<TableCell colSpan={4}>
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead className="w-[100px] text-center">
															Data
														</TableHead>
														<TableHead className="w-[100px] text-center">
															Description
														</TableHead>
														<TableHead className="w-[100px] text-center">
															Time
														</TableHead>
														<TableHead className="w-[100px] text-center">
															Actions
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{project.timeEntries.map(
														(entry) => (
															<TableRow
																key={entry.id}
															>
																<TableCell className="w-[100px] text-center align-middle">
																	{entry.date}
																</TableCell>
																<TableCell className="text-center align-middle">
																	{
																		entry.description
																	}
																</TableCell>
																<TableCell className="w-[100px] text-center align-middle">
																	{formatDuration(
																		entry.duration
																	)}
																</TableCell>
																<TableCell className="w-[100px] text-center align-middle">
																	<Button
																		variant="ghost"
																		onClick={() =>
																			handleRemoveTask(
																				entry.id
																			)
																		}
																	>
																		<Trash2 className="h-4 w-4 text-red-500" />
																	</Button>
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
				<div className="flex justify-between mt-4">
					<Button
						onClick={() => setCurrentPage(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<Button
						onClick={() => setCurrentPage(currentPage + 1)}
						disabled={
							currentPage * projectsPerPage >= projects.length
						}
					>
						Next
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
