import type { LucideIcon } from "lucide-react";
import { LayoutGrid, List, Settings } from "lucide-react";

type Submenu = {
	href: string;
	label: string;
	active: boolean;
	disabled: boolean;
	disableReason: string;
};

type Menu = {
	href: string;
	label: string;
	active: boolean;
	disabled: boolean;
	disableReason: string;
	icon: LucideIcon;
	submenus: Submenu[];
};

type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: "",
			menus: [
				{
					href: "/dashboard",
					label: "Dashboard",
					active: pathname.includes("/dashboard"),
					disabled: false,
					disableReason: "",
					icon: LayoutGrid,
					submenus: [],
				},
				{
					href: "/projects",
					label: "Projects",
					active: pathname.includes("/projects"),
					disabled: false,
					disableReason: "",
					icon: List,
					submenus: [],
				},
			],
		},
		{
			groupLabel: "Config",
			menus: [
				{
					href: "/settings",
					label: "Settings",
					active: pathname.includes("/settings"),
					disabled: true,
					disableReason: "Comming soon",
					icon: Settings,
					submenus: [],
				},
			],
		},
	];
}
