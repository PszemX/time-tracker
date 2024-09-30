import { AnimatePresence, motion } from "framer-motion";
import { HandCoins } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export default function PopupModalInfo({
	modalSize = "lg",
	title,
	description,
}: {
	modalSize?: "sm" | "lg";
	title: string;
	description: string;
}) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div>
			<AnimatePresence>
				{isOpen && (
					<div
						onClick={() => setIsOpen(false)}
						className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-y-scroll bg-slate-900/20 p-8 backdrop-blur"
					>
						<motion.div
							initial={{ scale: 0, rotate: "180deg" }}
							animate={{
								scale: 1,
								rotate: "0deg",
								transition: {
									type: "spring",
									bounce: 0.25,
								},
							}}
							exit={{ scale: 0, rotate: "180deg" }}
							onClick={(e) => e.stopPropagation()}
							className={cn(
								"relative w-full max-w-lg cursor-default overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 p-6 text-white shadow-2xl",
								{
									"max-w-sm": modalSize === "sm",
								}
							)}
						>
							<div className="flex flex-col gap-3">
								<HandCoins
									className="mx-auto text-white"
									size={48}
								/>
								<h3
									className={cn(
										"text-center text-3xl font-bold",
										{
											"text-2xl": modalSize === "sm",
										}
									)}
								>
									{title}
								</h3>
								<p className="mb-1 text-center">
									{description}
								</p>
								<div className="flex gap-2">
									<button
										onClick={() => setIsOpen(false)}
										className="w-full rounded bg-white py-2 font-semibold text-indigo-600 transition-opacity hover:opacity-80"
									>
										Thank you!
									</button>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
