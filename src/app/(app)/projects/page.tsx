"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import ProjectList from "@/components/projects/projects-list";

const Items = [
	{ name: "Home", link: "/" },
	{ name: "Projects", link: "/projects" },
];

export default function ProjectsPage() {
	return (
		<ContentLayout breadcrumbItems={Items}>
			<ProjectList />
		</ContentLayout>
	);
}
