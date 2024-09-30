import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

type NavbarBreadcrumbItem = { name: string; link: string };

interface NavbarBreadcrumbsProps {
  items: NavbarBreadcrumbItem[];
}

const NavbarBreadcrumbs: React.FC<NavbarBreadcrumbsProps> = ({ items }) => {
  return (
    <div className="hidden h-6 md:mb-2 md:inline md:pt-1">
      <Breadcrumb>
        <BreadcrumbList>
          {items.slice(0, -1).map((item: NavbarBreadcrumbItem, index: number) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={item.link} className="hidden text-xs md:inline">
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}
          <BreadcrumbItem key="title">
            <BreadcrumbPage className="hidden text-xs md:inline">{items.slice(-1)[0].name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default NavbarBreadcrumbs;
