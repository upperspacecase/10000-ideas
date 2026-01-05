import React from 'react';

/**
 * ProjectCard Component
 * 
 * Expected project shape (current fields + future fields):
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   url: string,
 *   phase: string,
 *   // Future fields (using defaults for now):
 *   index: number,
 *   status: 'live' | 'building' | 'paused',
 *   launched_date: string,
 *   audience: string,
 *   model: string,
 *   mrr: number,
 *   metric1_value: string,
 *   metric1_label: string,
 *   metric2_value: string,
 *   metric2_label: string,
 *   wants_needs: string[],
 *   blocker: string,
 *   owner_name: string,
 *   owner_avatar: string,
 *   color: string,
 * }
 */

// Color palette for cards
const CARD_COLORS = [
    '#7C3AED', // Purple
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
];

export default function ProjectCard({ project, index = 0 }) {
    // Derive color from index or use provided color
    const cardColor = project.color || CARD_COLORS[index % CARD_COLORS.length];

    // Status mapping based on phase
    const getStatus = () => {
        if (project.status) return project.status;
        if (project.phase === 'Post-Launch') return 'live';
        if (project.phase === 'GTM') return 'launching';
        return 'building';
    };

    const status = getStatus();
    const statusConfig = {
        live: { color: '#4ADE80', label: 'Live' },
        launching: { color: '#FACC15', label: 'Launching' },
        building: { color: '#60A5FA', label: 'Building' },
        paused: { color: '#9CA3AF', label: 'Paused' },
    };

    const currentStatus = statusConfig[status] || statusConfig.building;

    // Format index with leading zero
    const formattedIndex = String(index + 1).padStart(2, '0');

    // Use existing data or placeholders
    const launchedDate = project.launched_date || '—';
    const audience = project.audience || '—';
    const model = project.model || '—';
    const mrr = project.mrr ?? '€0';
    const metric1Value = project.metric1_value || '—';
    const metric1Label = project.metric1_label || 'users';
    const metric2Value = project.metric2_value || '—';
    const metric2Label = project.metric2_label || 'visits/mo';
    const wantsNeeds = project.wants_needs || [];
    const blocker = project.blocker || '—';
    const ownerName = project.owner_name || 'Tay';
    const ownerAvatar = project.owner_avatar || null;

    return (
        <div className="w-full">
            <div
                className="rounded-[32px] p-8 md:p-10"
                style={{ backgroundColor: cardColor }}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-1">
                    <span className="text-[#F5F0EB]/40 text-sm font-mono">{formattedIndex}</span>
                    <div className="flex items-center gap-2">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: currentStatus.color }}
                        />
                        <span
                            className="text-sm"
                            style={{ color: currentStatus.color }}
                        >
                            {currentStatus.label}
                        </span>
                    </div>
                </div>

                {/* Title & Description */}
                <h2 className="text-[#F5F0EB] text-4xl md:text-5xl font-light tracking-tight mb-2">
                    {project.title}
                </h2>
                <p className="text-[#F5F0EB]/70 text-base md:text-lg mb-8">
                    {project.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-8 md:gap-12 mb-10 text-sm">
                    <div>
                        <p className="text-[#F5F0EB]/40 mb-1">Launched</p>
                        <p className="text-[#F5F0EB]">{launchedDate}</p>
                    </div>
                    <div>
                        <p className="text-[#F5F0EB]/40 mb-1">Audience</p>
                        <p className="text-[#F5F0EB]">{audience}</p>
                    </div>
                    <div>
                        <p className="text-[#F5F0EB]/40 mb-1">Model</p>
                        <p className="text-[#F5F0EB]">{model}</p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-8 md:gap-10 mb-10">
                    <div>
                        <p className="text-[#F5F0EB] text-3xl md:text-4xl font-light">{mrr}</p>
                        <p className="text-[#F5F0EB]/40 text-sm mt-1">MRR</p>
                    </div>
                    <div>
                        <p className="text-[#F5F0EB] text-3xl md:text-4xl font-light">{metric1Value}</p>
                        <p className="text-[#F5F0EB]/40 text-sm mt-1">{metric1Label}</p>
                    </div>
                    <div>
                        <p className="text-[#F5F0EB] text-3xl md:text-4xl font-light">{metric2Value}</p>
                        <p className="text-[#F5F0EB]/40 text-sm mt-1">{metric2Label}</p>
                    </div>
                </div>

                <div className="h-px bg-[#F5F0EB]/20 mb-8" />

                {/* Wants & Needs */}
                {wantsNeeds.length > 0 && (
                    <div className="mb-8">
                        <p className="text-[#F5F0EB]/40 text-xs uppercase tracking-widest mb-4">Wants & Needs</p>
                        <div className="flex flex-wrap gap-2">
                            {wantsNeeds.map((need, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-[#F5F0EB]/10 rounded-full text-[#F5F0EB] text-sm"
                                >
                                    {need}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Blocker */}
                <div className="mb-10">
                    <p className="text-[#F5F0EB]/40 text-xs uppercase tracking-widest mb-2">Blocker</p>
                    <p className="text-[#F5F0EB]">{blocker}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {ownerAvatar ? (
                            <img
                                src={ownerAvatar}
                                alt={ownerName}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#F5F0EB]/20" />
                        )}
                        <span className="text-[#F5F0EB]/70 text-sm">{ownerName}</span>
                    </div>
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-[#F5F0EB] rounded-full text-sm font-medium hover:bg-white transition-colors"
                            style={{ color: cardColor }}
                        >
                            Go to project →
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
