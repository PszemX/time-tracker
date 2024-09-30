"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import Dashboard from "@/components/dashboard/dashboard";

const breadcrumbItems = [
	{ name: "Home", link: "/" },
	{ name: "Dashboard", link: "/dashboard" },
];

export default function DashboardPage() {
	return (
		<ContentLayout breadcrumbItems={breadcrumbItems}>
			<Dashboard />
		</ContentLayout>
	);
}
