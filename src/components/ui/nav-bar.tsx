import { Button } from "@/components/ui/button";
import Link from "next/link";

const destinations = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/profile",
    label: "Profile",
  },
  {
    href: "/weather-history",
    label: "Weather History",
  },
  {
    href: "/weather-forecast",
    label: "Weather Forecast",
  },
];

export const NavBar = () => {
  return (
    <nav className="flex justify-center gap-4 p-4 border-b bg-gray-100">
      {destinations.map((dest) => (
        <Button key={dest.href} size="sm">
          <Link href={dest.href}>{dest.label}</Link>
        </Button>
      ))}
    </nav>
  );
};
