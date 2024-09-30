"use client";

import { LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function UserNav() {
	const router = useRouter();
	const [userEmail, setUserEmail] = useState<string>("");

	useEffect(() => {
		const fetchUserEmail = async (): Promise<void> => {
			try {
				const response = await fetch("/api/user");
				if (response.ok) {
					const data = await response.json();
					setUserEmail(data.email);
				} else {
					throw new Error("Cannot fetch user email");
				}
			} catch (error) {
				console.error("Cannot fetch user email:", error);
				setUserEmail("Cannot fetch user email");
			}
		};

		fetchUserEmail();
	}, []);

	const handleSignOut = async (): Promise<void> => {
		try {
			const response = await fetch("/api/logout", { method: "POST" });
			if (response.ok) {
				router.push("/login");
			} else {
				throw new Error("Cannot sign out");
			}
		} catch (error) {
			console.error("Cannot sign out:", error);
		}
	};
	return (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="relative h-10 w-10 rounded-full font-bold"
							>
								<Avatar className="">
									<AvatarImage src="#" alt="Avatar" />
									<AvatarFallback className="bg-transparent">
										{userEmail.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">Profile</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{userEmail.split("@")[0]}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{userEmail}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link href="/dashboard" className="flex items-center">
							<LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />
							Dashboard
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="hover:cursor-pointer"
					onClick={handleSignOut}
				>
					<LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
