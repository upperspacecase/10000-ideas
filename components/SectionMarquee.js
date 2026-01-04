"use client";

// import Marquee from "react-fast-marquee";

export default function SectionMarquee({ text, bgColor = "bg-transparent", textColor = "text-white" }) {
    return (
        <div className={`w-full py-2 overflow-hidden border-b border-white/20 ${bgColor} ${textColor}`}>
            <div className="flex w-max animate-marquee">
                <div className="flex gap-8 px-4 font-mono text-xs uppercase tracking-widest whitespace-nowrap">
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex gap-8 px-4 font-mono text-xs uppercase tracking-widest whitespace-nowrap" aria-hidden="true">
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                    <span>{text}</span> <span>•</span>
                </div>
            </div>
        </div>
    );
}
