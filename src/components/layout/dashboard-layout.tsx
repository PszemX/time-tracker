"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import PopupModalInfo from "../modal/popup-modal-info";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	if (!sidebar) return null;

	return (
		<>
			<PopupModalInfo
				title="Welcome!"
				description="Feel introduced to our latest time tracker!"
			/>
			<Sidebar />
			<main
				className={cn(
					"min-h-[100vh] bg-secondary transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
					sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
				)}
			>
				{children}
			</main>
		</>
	);
}
