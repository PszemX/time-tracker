import { MenuIcon, PanelsTopLeft } from "lucide-react";
import Link from "next/link";

import { Menu } from "@/components/sidebar/components/sidebar-menu";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";

export function SheetMenu() {
	return (
		<Sheet>
			<SheetTrigger className="lg:hidden" asChild>
				<Button className="h-8" variant="outline" size="icon">
					<MenuIcon size={20} />
				</Button>
			</SheetTrigger>
			<SheetContent
				className="flex h-full flex-col overflow-y-scroll px-3 sm:w-72"
				side="left"
			>
				<SheetHeader>
					<Link
						href="/dashboard"
						className="flex items-center justify-center gap-1 pb-2 pt-2"
					>
						<PanelsTopLeft className="mr-1 h-7 w-7" />
						<h1 className="me-2 whitespace-nowrap text-2xl font-bold">
							Time Tracker
						</h1>
					</Link>
				</SheetHeader>
				<div className="mb-1 mt-1 h-px bg-zinc-200 dark:bg-white/10"></div>
				<Menu isOpen />
			</SheetContent>
		</Sheet>
	);
}
