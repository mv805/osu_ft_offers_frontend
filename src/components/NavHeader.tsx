"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavHeader = () => {
  const pathname = usePathname();

  return (
    <header className="bg-slate-800 p-6 flex justify-end shadow-xl">
      <Link
        href={`/view-data`}
        className={`m-3 ${
          pathname === "/view-data" ? "text-inherit" : "text-slate-600"
        }`}
      >
        View Data
      </Link>
      <Link
        href={`/add-data`}
        className={`m-3 ${
          pathname === "/add-data" ? "text-inherit" : "text-slate-600"
        }`}
      >
        Add Data
      </Link>
      <Link
        href={`/`}
        className={`m-3 ${
          pathname === "/" ? "text-inherit" : "text-slate-600"
        }`}
      >
        Home
      </Link>
    </header>
  );
};
