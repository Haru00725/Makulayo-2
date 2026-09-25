"use client";

type DayPoint = { label: string; amount: number };

export function RevenueChart({ data }: { data: DayPoint[] }) {
    const max = Math.max(...data.map((d) => d.amount), 1);
    const width = 900;
    const height = 220;
    const barGap = 6;
    const barWidth = data.length ? (width - barGap * (data.length - 1)) / data.length : 0;

    return (
        <svg viewBox={`0 0 ${width} ${height + 28}`} className="w-full h-auto" role="img" aria-label="Revenue chart for the last 14 days">
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((pct) => (
                <line
                    key={pct}
                    x1={0}
                    y1={height - pct * height}
                    x2={width}
                    y2={height - pct * height}
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="4,4"
                />
            ))}
            {data.map((d, i) => {
                const barHeight = (d.amount / max) * height;
                const x = i * (barWidth + barGap);
                const y = height - barHeight;
                const hasValue = d.amount > 0;

                return (
                    <g key={d.label}>
                        {/* Gradient bar */}
                        <defs>
                            <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#D9B978" />
                                <stop offset="100%" stopColor="#C6A15B" />
                            </linearGradient>
                        </defs>
                        <rect
                            x={x}
                            y={hasValue ? y : height - 3}
                            width={barWidth}
                            height={hasValue ? barHeight : 3}
                            fill={hasValue ? `url(#bar-grad-${i})` : "rgba(255,255,255,0.06)"}
                            rx={2}
                            style={{
                                transition: "height 400ms ease, y 400ms ease",
                            }}
                        />
                        {/* Glow effect on top */}
                        {hasValue && (
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={Math.min(4, barHeight)}
                                fill="rgba(198, 161, 91, 0.4)"
                                rx={2}
                            />
                        )}
                        {/* Labels */}
                        {i % Math.ceil(data.length / 7) === 0 && (
                            <text
                                x={x + barWidth / 2}
                                y={height + 20}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#6B675F"
                                fontFamily="var(--font-body)"
                            >
                                {d.label}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}