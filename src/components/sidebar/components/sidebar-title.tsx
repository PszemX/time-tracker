import { Timer } from "lucide-react";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

const SidebarTitle = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
	return (
		<>
			<div
				className={cn(
					"mb-1 flex w-full items-center justify-center transition-transform duration-300 ease-in-out",
					isSidebarOpen === false ? "translate-x-1" : "translate-x-0"
				)}
			>
				<Link href="/dashboard" className="flex items-center gap-2">
					<Timer className="mr-1 h-8 w-8" />
					<h1
						className={cn(
							"me-2 whitespace-nowrap text-2xl font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
							isSidebarOpen === false
								? "hidden -translate-x-96 opacity-0"
								: "translate-x-0 opacity-100"
						)}
					>
						Time Tracker
					</h1>
				</Link>
			</div>
		</>
	);
};

export default SidebarTitle;
