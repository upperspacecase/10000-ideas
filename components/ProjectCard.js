import React, { useState } from 'react';
import { ChevronDown, Calendar, Users, DollarSign, AlertCircle } from 'lucide-react';

/**
 * ProjectCard Component - Accordion with Infographic Layout
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

    return (
        <div
            style={{
                backgroundColor: '#000000',
                borderRadius: '28px',
                overflow: 'hidden',
                color: 'white',
            }}
        >
            {/* COLLAPSED HEADER - Always Visible */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: '24px 32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.2s ease',
                }}
            >
                {/* Left: Index + Title + Description */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: 0 }}>
                    <span style={{
                        fontSize: '14px',
                        opacity: 0.3,
                        fontFamily: 'monospace',
                        fontWeight: '500'
                    }}>
                        {formattedIndex}
                    </span>
                    <div style={{ minWidth: 0 }}>
                        <h3 style={{
                            fontSize: '22px',
                            fontWeight: '500',
                            margin: 0,
                            letterSpacing: '-0.01em'
                        }}>
                            {project.title}
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            opacity: 0.5,
                            margin: '4px 0 0 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '400px'
                        }}>
                            {project.description}
                        </p>
                    </div>
                </div>

                {/* Right: Status + Chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(255,204,0,0.12)',
                        padding: '6px 14px',
                        borderRadius: '20px'
                    }}>
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: currentStatus.color,
                                animation: status === 'live' ? 'pulse 1.5s infinite' : 'none',
                            }}
                        />
                        <span style={{
                            fontSize: '12px',
                            color: currentStatus.color,
                            fontWeight: '600'
                        }}>
                            {currentStatus.label}
                        </span>
                    </div>

                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#FFCC00',
                                color: 'black',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            Visit →
                        </a>
                    )}

                    <ChevronDown
                        style={{
                            width: '20px',
                            height: '20px',
                            opacity: 0.5,
                            transition: 'transform 0.3s ease',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    />
                </div>
            </div>

            {/* EXPANDED CONTENT */}
            <div
                style={{
                    maxHeight: isExpanded ? '800px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease',
                }}
            >
                <div style={{ padding: '0 32px 36px 32px' }}>

                    {/* Divider */}
                    <div style={{
                        height: '1px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        marginBottom: '32px'
                    }} />

                    {/* METRICS GRID - Visual Hero */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                        marginBottom: '32px'
                    }}>
                        {/* MRR */}
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            borderRadius: '20px',
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '32px',
                                fontWeight: '300',
                                margin: 0,
                                letterSpacing: '-0.02em',
                                color: '#FFCC00'
                            }}>
                                {mrr}
                            </p>
                            <p style={{
                                fontSize: '11px',
                                opacity: 0.4,
                                margin: '8px 0 0 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                MRR
                            </p>
                        </div>

                        {/* Metric 2 */}
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            borderRadius: '20px',
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '32px',
                                fontWeight: '300',
                                margin: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                {metric1Value}
                            </p>
                            <p style={{
                                fontSize: '11px',
                                opacity: 0.4,
                                margin: '8px 0 0 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                {metric1Label}
                            </p>
                        </div>

                        {/* Metric 3 */}
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            borderRadius: '20px',
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '32px',
                                fontWeight: '300',
                                margin: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                {metric2Value}
                            </p>
                            <p style={{
                                fontSize: '11px',
                                opacity: 0.4,
                                margin: '8px 0 0 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                {metric2Label}
                            </p>
                        </div>
                    </div>

                    {/* CONTEXT BAR - Horizontal Pills */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '28px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            fontSize: '13px'
                        }}>
                            <Calendar style={{ width: '14px', height: '14px', opacity: 0.5 }} />
                            <span style={{ opacity: 0.5 }}>Launched</span>
                            <span style={{ fontWeight: '500' }}>{launchedDate}</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            fontSize: '13px'
                        }}>
                            <Users style={{ width: '14px', height: '14px', opacity: 0.5 }} />
                            <span style={{ opacity: 0.5 }}>Audience</span>
                            <span style={{ fontWeight: '500' }}>{audience}</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            fontSize: '13px'
                        }}>
                            <DollarSign style={{ width: '14px', height: '14px', opacity: 0.5 }} />
                            <span style={{ opacity: 0.5 }}>Model</span>
                            <span style={{ fontWeight: '500' }}>{model}</span>
                        </div>
                    </div>

                    {/* WANTS & NEEDS */}
                    {wantsNeeds.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <p style={{
                                fontSize: '11px',
                                opacity: 0.35,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px'
                            }}>
                                Wants & Needs
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {wantsNeeds.map((need, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: 'rgba(255,204,0,0.1)',
                                            border: '1px solid rgba(255,204,0,0.2)',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: '#FFCC00'
                                        }}
                                    >
                                        {need}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BLOCKER - Warning Style */}
                    {blocker && blocker !== '—' && (
                        <div style={{
                            backgroundColor: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                        }}>
                            <AlertCircle style={{
                                width: '18px',
                                height: '18px',
                                color: '#EF4444',
                                flexShrink: 0,
                                marginTop: '2px'
                            }} />
                            <div>
                                <p style={{
                                    fontSize: '11px',
                                    color: '#EF4444',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '4px',
                                    fontWeight: '600'
                                }}>
                                    Blocker
                                </p>
                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{blocker}</p>
                            </div>
                        </div>
                    )}

                    {/* FOOTER - Owner */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingTop: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: '2px solid rgba(255,255,255,0.1)'
                        }} />
                        <span style={{ fontSize: '14px', opacity: 0.5 }}>{ownerName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
