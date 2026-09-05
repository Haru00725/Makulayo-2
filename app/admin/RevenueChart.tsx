type DayPoint = { label: string; amount: number };

export function RevenueChart({ data }: { data: DayPoint[] }) {
    const max = Math.max(...data.map((d) => d.amount), 1);
    const width = 900;
    const height = 220;
    const barGap = 6;
    const barWidth = data.length ? (width - barGap * (data.length - 1)) / data.length : 0;

    return (
        <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full h-auto">
            {data.map((d, i) => {
                const barHeight = (d.amount / max) * height;
                const x = i * (barWidth + barGap);
                const y = height - barHeight;

                return (
                    <g key={d.label}>
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="#2F3A8F"
                            opacity={d.amount === 0 ? 0.08 : 1}
                            rx={1}
                        />
                        {i % Math.ceil(data.length / 10 || 1) === 0 && (
                            <text
                                x={x + barWidth / 2}
                                y={height + 16}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#6E6E68"
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