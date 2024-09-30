import { Navbar } from "@/components/navbar/navbar";

interface ContentLayoutProps {
	breadcrumbItems: { name: string; link: string }[];
	children: React.ReactNode;
}

export function ContentLayout({
	breadcrumbItems,
	children,
}: ContentLayoutProps) {
	return (
		<main className="px-4 pb-8 sm:px-8">
			<Navbar breadcrumbItems={breadcrumbItems} />
			<div className="md:pt-4 lg:pt-8">{children}</div>
		</main>
	);
}
