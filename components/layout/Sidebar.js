"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, AlertTriangle, LayoutGrid, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Backlog", href: "/#backlog", icon: LayoutGrid },
        { name: "Submit Idea", href: "/submit", icon: PlusCircle },
        { name: "Report Problem", href: "/submit-problem", icon: AlertTriangle },
    ];

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden border-2 border-black/5"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#F5F2EB] border-r-2 border-black/5 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:block
      `}>
                <div className="p-8">
                    <Link href="/" className="block mb-12" onClick={closeMenu}>
                        <div className="bg-primary text-white font-black text-2xl p-2 inline-block -rotate-2">
                            10K
                        </div>
                        <span className="font-bold text-xl ml-2 tracking-tight">IDEAS</span>
                    </Link>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
                    ${isActive
                                            ? "bg-white text-black shadow-sm border-2 border-black/5"
                                            : "text-gray-500 hover:text-black hover:bg-white/50"}
                  `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-8 left-0 w-full px-8">
                    <div className="p-4 bg-white rounded-xl border-2 border-black/5">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Phase</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-bold text-sm">Building Publicly</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
