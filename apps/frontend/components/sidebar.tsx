"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils"
const menu = [
  { name: "Dashboard", href: "/" },
  { name: "Drug", href: "/drug" },
  { name: "Users", href: "/users" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r bg-white px-4 py-6 fixed left-0 top-0">
      <h1 className="text-xl font-bold mb-8">iProvidence</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
              pathname === item.href && "bg-gray-200 font-semibold"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}