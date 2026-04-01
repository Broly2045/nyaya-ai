"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProp {
  name: string;
  email: string;
  image?: string;
  subscription: string;
}

export default function Sidebar({ user }: { user: UserProp }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/documents", label: "My Documents", icon: FileText },
    { href: "/pricing", label: "Pricing / Upgrade", icon: Sparkles },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#152142] flex flex-col h-full sticky top-0 bg-[#0B162E]">
      <div className="p-6 border-b border-[#152142] flex items-center space-x-2">
        <Sparkles className="w-6 h-6 text-[#E87213]" />
        <span className="text-xl font-bold font-serif text-[#F5EDD8]">NyayaAI</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-300 relative overflow-hidden group",
                isActive
                  ? "bg-[#152142] text-[#F5EDD8] shadow-[0_0_15px_rgba(232,114,19,0.05)]"
                  : "text-[#7A7E96] hover:bg-[#152142]/50 hover:text-[#C8BDA4]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E87213] shadow-[0_0_10px_#E87213]" />
              )}
              <Icon className={cn("w-5 h-5", isActive ? "text-[#E87213]" : "group-hover:text-[#E87213]/70 transition-colors")} />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#152142]">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#060F24]/80 border border-[#152142] hover:border-[#1C2D54] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#152142] flex items-center justify-center text-[#E87213] font-bold group-hover:bg-[#E87213]/10 transition-colors">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-[#F5EDD8] truncate">{user.name}</p>
            <p className="text-[0.65rem] text-[#7A7E96] uppercase font-mono tracking-widest">{user.subscription}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
