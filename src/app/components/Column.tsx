// Column.tsx
import Link from "next/link";
import { ComponentType } from "react";
import OrangeArrow from "./icons/OrangeArrow";

interface ColumnProps {
  title: string;
  icon: ComponentType<any>;
  links: { href: string; label: string }[];
  isFirst?: boolean;
  activeSubmenuPath?: string | null;
  showSeparator?: boolean;
}

export default function Column({
  title,
  icon: Icon,
  links,
  isFirst = false,
  activeSubmenuPath = null,
  showSeparator = false,
}: ColumnProps) {
  return (
    <div
      className={`w-full md:max-w-2xl ${showSeparator ? "md:border-r md:border-gray-300 md:pr-12" : ""
        } ${isFirst ? "" : "md:pl-12"}`}
    >
      <p className="text-sm sm:text-base font-semibold mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Icon />
        {title}
      </p>

      <ul className="space-y-2 sm:space-y-3">
        {links.map(({ href, label }) => {
          const isActive = activeSubmenuPath === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm sm:text-base ${isActive
                  ? "text-orange font-semibold"
                  : "text-noir hover:text-orange"
                  } transition-colors group flex items-center`}
              >
                <OrangeArrow className={isActive ? "opacity-100" : ""} />
                <span className={`transition-all duration-300 ease-in-out ${isActive ? "translate-x-1" : ""
                  }`}>
                  {label}
                </span>
                {isActive && (
                  <span className="ml-2 w-1.5 h-1.5 rounded-full bg-orange"></span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
