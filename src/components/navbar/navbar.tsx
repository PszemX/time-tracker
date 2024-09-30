import { ToggleTheme } from "@/components/theme/toogle-theme";

import NavbarBreadcrumbs from "./components/navbar-breadcrumbs";
import { SheetMenu } from "./components/sheet-menu";
import { UserNav } from "./components/user-nav";

interface NavbarProps {
  breadcrumbItems: { name: string; link: string }[];
}

export function Navbar({ breadcrumbItems }: NavbarProps) {
  const title = breadcrumbItems.at(-1)?.name || "";
  return (
    <header className="sticky right-3 top-3 z-10 w-full rounded-lg bg-transparent py-2 backdrop-blur transition-all md:right-[30px] md:top-4 md:p-2 xl:top-[20px]">
      <div className="flex h-14 items-center">
        <SheetMenu />
        <div className="ml-4 flex flex-col lg:ml-2 lg:space-x-0">
          <NavbarBreadcrumbs items={breadcrumbItems} />
          <h1 className="text-md shrink rounded-none font-bold capitalize md:text-3xl">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="center flex justify-center gap-2">
            <ToggleTheme />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
