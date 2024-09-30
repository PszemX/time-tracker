import DashboardLayout from "@/components/layout/dashboard-layout";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<DashboardLayout>{children}</DashboardLayout>
		</ThemeProvider>
	);
}
