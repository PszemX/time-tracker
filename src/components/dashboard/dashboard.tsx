"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	Legend,
} from "recharts";
import apiClient from "@/lib/apiClient";

interface TimeEntry {
	id: string;
	date: string;
	duration: number;
	projectName: string;
}

interface Project {
	id: number;
	name: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
	const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedProjects: Project[] = await apiClient(
					`/api/projects?page=1&perPage=100&sortField=id&sortOrder=asc`
				);

				const fetchedTimeEntries: TimeEntry[] = await apiClient(
					"/api/time-entries"
				);

				setProjects(fetchedProjects);
				setTimeEntries(fetchedTimeEntries);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Failed to fetch data.");
			}
		};

		fetchData();
	}, []);

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	const handleProjectSelection = (projectName: string) => {
		setSelectedProjects((prev) =>
			prev.includes(projectName)
				? prev.filter((p) => p !== projectName)
				: [...prev, projectName]
		);
	};

	const filteredTimeEntries = timeEntries.filter(
		(entry) =>
			selectedProjects.length === 0 ||
			selectedProjects.includes(entry.projectName)
	);

	const aggregatedData = filteredTimeEntries.reduce((acc, entry) => {
		const existingEntry = acc.find((item) => item.date === entry.date);
		if (existingEntry) {
			existingEntry.duration += entry.duration;
		} else {
			acc.push({ date: entry.date, duration: entry.duration });
		}
		return acc;
	}, [] as { date: string; duration: number }[]);

	const projectData = projects.map((project) => ({
		name: project.name,
		value: filteredTimeEntries
			.filter((entry) => entry.projectName === project.name)
			.reduce((sum, entry) => sum + entry.duration, 0),
	}));

	const totalHours = formatDuration(
		filteredTimeEntries.reduce((sum, entry) => sum + entry.duration, 0)
	);

	return (
		<>
			<div className="space-y-4">
				<Card className="w-full">
					<CardContent>
						<div className="pt-6 flex items-center justify-between">
							<div className="text-2xl font-bold">
								Total recorded time: {totalHours}
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										Choose projects
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel>
										Projects
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{projects.map((project) => (
										<DropdownMenuCheckboxItem
											key={project.id}
											checked={selectedProjects.includes(
												project.name
											)}
											onCheckedChange={() =>
												handleProjectSelection(
													project.name
												)
											}
										>
											{project.name}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader>
						<CardTitle>Recorded time during a week</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={aggregatedData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis tickFormatter={formatDuration} />
								<Tooltip
									formatter={(value: number) =>
										formatDuration(value)
									}
								/>
								<Bar dataKey="duration" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader>
						<CardTitle>Recorded time for each project</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={projectData}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{projectData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									formatter={(value: number) =>
										formatDuration(value)
									}
								/>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader>
						<CardTitle>Recorded time trend</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={aggregatedData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis tickFormatter={formatDuration} />
								<Tooltip
									formatter={(value: number) =>
										formatDuration(value)
									}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="duration"
									stroke="#8884d8"
									activeDot={{ r: 8 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
			{error && <p className="text-red-500">{error}</p>}
		</>
	);
}
