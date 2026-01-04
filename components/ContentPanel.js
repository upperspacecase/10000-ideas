"use client";

export default function ContentPanel({ activeSection, children }) {
    // Sections that show solid color with big typography
    const colorSections = {
        hello: { bg: "#FF4400", text: "white" },
        approach: { bg: "#6600CC", text: "white" },
        talent: { bg: "#3333FF", text: "white" },
        careers: { bg: "#FF0066", text: "white" },
        contact: { bg: "#FFFF00", text: "black" },
    };

    // Work section gets beige background with black cards
    const isWorkSection = activeSection === "work";
    const sectionColors = colorSections[activeSection];

    const sectionLabels = {
        hello: "Hello",
        approach: "Approach",
        work: "Work",
        talent: "Talent",
        careers: "Careers",
        contact: "Contact"
    };

    const sectionNumbers = {
        hello: "01",
        approach: "02",
        work: "03",
        talent: "04",
        careers: "05",
        contact: "06"
    };

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>
            {/* Marquee Banner */}
            <div style={{
                backgroundColor: sectionColors?.bg || '#FF4400',
                color: sectionColors?.text || 'white',
                padding: '8px 16px',
                fontSize: '12px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: '24px',
                margin: '8px',
                display: isWorkSection ? 'none' : 'block'
            }}>
                You are now entering ( {sectionLabels[activeSection]} ) section
            </div>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                backgroundColor: isWorkSection ? '#F5F2EB' : (sectionColors?.bg || '#F5F2EB'),
                borderRadius: '32px',
                margin: '8px',
                padding: isWorkSection ? '24px' : '48px',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* For color sections: show big typography */}
                {sectionColors && !isWorkSection && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        color: sectionColors.text
                    }}>
                        <span style={{
                            fontSize: '48px',
                            fontWeight: '300',
                            fontFamily: 'system-ui'
                        }}>
                            {sectionNumbers[activeSection]}
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(80px, 15vw, 200px)',
                            fontWeight: '300',
                            lineHeight: '0.9',
                            marginBottom: '0'
                        }}>
                            {sectionLabels[activeSection]}
                        </h1>
                    </div>
                )}

                {/* For work section: show children (project cards) */}
                {isWorkSection && children}
            </div>
        </div>
    );
}
