"use client";

import { cn } from "@/libs/utils";

export default function NavigationDock({ activeSection, onSectionChange }) {
    const items = [
        { id: "hello", label: "Hello", number: "01", bgColor: "#FF4400" },
        { id: "approach", label: "Approach", number: "02", bgColor: "#6600CC" },
        { id: "work", label: "Work", number: "03", bgColor: "#000000" },
        { id: "talent", label: "Talent", number: "04", bgColor: "#3333FF" },
        { id: "careers", label: "Careers", number: "05", bgColor: "#FF0066" },
        { id: "contact", label: "Contact", number: "06", bgColor: "#FFFF00" },
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '140px',
                minWidth: '140px',
                padding: '16px',
                height: '100%',
                overflowY: 'auto'
            }}
        >
            {/* Logo */}
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}
            >
                <h1 style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.02em' }}>IIIW</h1>
            </div>

            {/* Nav Items */}
            {items.map((item) => {
                const isActive = activeSection === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '12px',
                            borderRadius: '12px',
                            border: isActive ? 'none' : '1px solid rgba(0,0,0,0.05)',
                            backgroundColor: isActive ? item.bgColor : 'white',
                            color: isActive ? (item.id === 'contact' ? 'black' : 'white') : 'black',
                            height: isActive ? '140px' : '80px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                        }}
                    >
                        {/* Number & Indicator */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', opacity: 0.7 }}>
                                {item.number}
                            </span>
                            {isActive && (
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: item.id === 'contact' ? 'black' : 'white',
                                    borderRadius: '50%'
                                }} />
                            )}
                        </div>

                        {/* Label */}
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            marginTop: 'auto'
                        }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
