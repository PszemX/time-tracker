import { Menu } from "@/components/sidebar/components/sidebar-menu";
import { SidebarToggle } from "@/components/sidebar/components/sidebar-toggle";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import { Card } from "../ui/card";
import SidebarTitle from "./components/sidebar-title";

export function Sidebar() {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	if (!sidebar) return null;

	return (
		<>
			<div
				className={cn(
					"fixed left-0 top-0 z-20 h-screen -translate-x-full bg-secondary transition-[width] duration-300 ease-in-out dark:bg-zinc-900 lg:translate-x-0",
					sidebar?.isOpen === false ? "w-[90px]" : "w-72"
				)}
			>
				<Card
					className={`invisible m-3 ml-3 h-[96.5vh] w-full overflow-hidden !rounded-lg border-border bg-secondary dark:bg-zinc-900 sm:my-4 sm:mr-4 md:m-5 md:mr-[-50px] lg:visible`}
				>
					<SidebarToggle
						isOpen={sidebar?.isOpen}
						setIsOpen={sidebar?.setIsOpen}
					/>

					<div className="shadow-m relative flex h-full flex-col overflow-y-visible bg-secondary px-3 py-4 pb-9 dark:bg-zinc-900">
						<SidebarTitle isSidebarOpen={sidebar?.isOpen} />
						<div className="mb-8 mt-8 h-px bg-zinc-200 dark:bg-white/10"></div>
						<Menu isOpen={sidebar?.isOpen} />
					</div>
				</Card>
			</div>
		</>
	);
}
