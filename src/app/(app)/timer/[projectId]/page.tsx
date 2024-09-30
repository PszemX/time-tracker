"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import Timer from "@/components/timer/timer";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

interface Project {
	id: number;
	name: string;
}

const ProjectTimerPage = () => {
	const params = useParams();
	const projectId = parseInt(params.projectId as string, 10);
	const [project, setProject] = useState<Project | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const projects: Project[] = await apiClient(
					`/api/projects?page=1&perPage=100&sortField=id&sortOrder=asc`
				);
				const foundProject = projects.find((p) => p.id === projectId);
				if (foundProject) {
					setProject(foundProject);
				} else {
					setError("Project not found");
				}
			} catch (err) {
				console.error("Error fetching project:", err);
				setError("Error fetching project");
			}
		};

		fetchProject();
	}, [projectId]);

	const breadcrumbItems = [
		{ name: "Home", link: "/" },
		{ name: "Timer", link: "/projects" },
		{
			name: project ? project.name : "Loading...",
			link: `/timer/${projectId}`,
		},
	];

	return (
		<ContentLayout breadcrumbItems={breadcrumbItems}>
			{error && <div className="text-red-500">{error}</div>}
			{project ? (
				<Timer projectId={project.id} projectName={project.name} />
			) : (
				<div>Loading...</div>
			)}
		</ContentLayout>
	);
};

export default ProjectTimerPage;
