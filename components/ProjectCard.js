import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ProjectCard Component - Clean, minimal pricing-card style
 */
export default function ProjectCard({ project, index = 0, defaultExpanded = false }) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    // Status based on phase
    const getStatus = () => {
        if (project.status) return project.status;
        if (project.phase === 'Post-Launch') return 'live';
        if (project.phase === 'GTM') return 'launching';
        return 'building';
    };

    const status = getStatus();
    const statusConfig = {
        live: { color: '#FFCC00', label: 'Live' },
        launching: { color: '#FFCC00', label: 'Launching' },
        building: { color: '#3333FF', label: 'Building' },
        paused: { color: '#9CA3AF', label: 'Paused' },
    };

    const currentStatus = statusConfig[status] || statusConfig.building;
    const formattedIndex = String(index + 1).padStart(2, '0');

    // Data with fallbacks
    const launchedDate = project.launched_date || '—';
    const audience = project.audience || '—';
    const model = project.model || '—';
    const mrr = project.mrr ?? '€0';
    const metric1Value = project.metric1_value || '—';
    const metric1Label = project.metric1_label || 'users';
    const metric2Value = project.metric2_value || '—';
    const metric2Label = project.metric2_label || 'visits/mo';
    const wantsNeeds = project.wants_needs || [];
    const blocker = project.blocker || null;
    const ownerName = project.owner_name || 'Tay';

    // Row component for clean layout
    const Row = ({ label, value, bold = false }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '12px 0',
            borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
            <span style={{ fontSize: '15px', color: '#666' }}>{label}</span>
            <span style={{
                fontSize: bold ? '18px' : '15px',
                fontWeight: bold ? '600' : '500',
                color: '#000'
            }}>
                {value}
            </span>
        </div>
    );

    return (
        <div
            style={{
                backgroundColor: '#FAF9F7',
                borderRadius: '20px',
                overflow: 'hidden',
            }}
        >
            {/* HEADER - Always Visible */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: '28px 32px',
                    cursor: 'pointer',
                }}
            >
                {/* Title Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{
                            fontSize: '28px',
                            fontWeight: '600',
                            margin: 0,
                            color: '#000',
                            letterSpacing: '-0.02em'
                        }}>
                            {project.title}
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#888',
                            margin: '6px 0 0 0',
                            maxWidth: '300px'
                        }}>
                            {project.description}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            borderRadius: '16px'
                        }}>
                            <span
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: currentStatus.color,
                                }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: '500', color: '#666' }}>
                                {currentStatus.label}
                            </span>
                        </div>
                        <ChevronDown
                            style={{
                                width: '18px',
                                height: '18px',
                                color: '#999',
                                transition: 'transform 0.2s ease',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    </div>
                </div>

                {/* Key Metrics - Always visible */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <Row label="MRR" value={mrr} bold />
                    <Row label={metric1Label} value={metric1Value} bold />
                    <Row label={metric2Label} value={metric2Value} bold />
                </div>
            </div>

            {/* EXPANDED CONTENT */}
            <div
                style={{
                    maxHeight: isExpanded ? '600px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                }}
            >
                <div style={{ padding: '0 32px 28px 32px' }}>

                    {/* Project Info Section */}
                    <p style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#999',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '8px',
                        marginTop: '8px'
                    }}>
                        Project Info
                    </p>

                    <Row label="Launched" value={launchedDate} />
                    <Row label="Audience" value={audience} />
                    <Row label="Model" value={model} />
                    <Row label="Owner" value={ownerName} />

                    {/* Wants & Needs */}
                    {wantsNeeds.length > 0 && (
                        <div style={{ paddingTop: '20px' }}>
                            <p style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#999',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '12px'
                            }}>
                                Wants & Needs
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {wantsNeeds.map((need, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: '8px 14px',
                                            backgroundColor: 'rgba(0,0,0,0.05)',
                                            borderRadius: '16px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: '#333'
                                        }}
                                    >
                                        {need}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blocker */}
                    {blocker && blocker !== '—' && (
                        <div style={{
                            marginTop: '20px',
                            padding: '16px',
                            backgroundColor: 'rgba(239,68,68,0.08)',
                            borderRadius: '12px'
                        }}>
                            <p style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#EF4444',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '4px'
                            }}>
                                Blocker
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{blocker}</p>
                        </div>
                    )}

                    {/* CTA */}
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'block',
                                marginTop: '24px',
                                padding: '14px 24px',
                                backgroundColor: '#000',
                                color: 'white',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}
                        >
                            Visit Project →
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
