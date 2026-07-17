import React, { useState } from 'react';

// ── DONUT / PIE CHART ──
interface DonutChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  title?: string;
  size?: number;
  thickness?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  size = 200,
  thickness = 30
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900/30 rounded-2xl border border-color shadow-sm">
      {title && <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4">{title}</h4>}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        {/* SVG Circle Graph */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {total === 0 ? (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="var(--border-color)"
                strokeWidth={thickness}
              />
            ) : (
              data.map((item, idx) => {
                const percentage = item.value / total;
                const strokeLength = percentage * circumference;
                const strokeOffset = circumference - strokeLength;
                const rotation = (accumulatedAngle / total) * 360;
                accumulatedAngle += item.value;

                const isHovered = hoveredIdx === idx;

                return (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={isHovered ? thickness + 6 : thickness}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    transform={`rotate(${rotation} ${center} ${center})`}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      opacity: hoveredIdx === null || isHovered ? 1 : 0.6
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })
            )}
          </svg>
          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredIdx !== null ? (
              <>
                <span className="text-xl font-black text-slate-800 dark:text-white">
                  {((data[hoveredIdx].value / total) * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-muted font-bold truncate max-w-[100px] text-center">
                  {data[hoveredIdx].label}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-black text-slate-800 dark:text-white">{total}</span>
                <span className="text-[9px] text-muted font-black uppercase tracking-wider">Total</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 w-full">
          {data.map((item, idx) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-200 ${
                  isHovered ? 'bg-slate-100 dark:bg-slate-800/60 scale-[1.02]' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-slate-800 dark:text-white">{item.value}</span>
                  <span className="text-[10px] text-muted font-bold">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── BAR CHART (HORIZONTAL) ──
interface BarChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  color?: string;
  maxValue?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  color = 'var(--primary)',
  maxValue
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const highestValue = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <div className="p-5 bg-white dark:bg-slate-900/30 rounded-2xl border border-color shadow-sm space-y-4">
      {title && <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{title}</h4>}
      <div className="space-y-3.5">
        {data.map((item, idx) => {
          const percentage = (item.value / highestValue) * 100;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="space-y-1.5 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="font-black text-slate-800 dark:text-white">
                  {item.value} <span className="text-[10px] text-muted font-normal">Alumni</span>
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                    opacity: hoveredIdx === null || isHovered ? 1 : 0.7,
                    boxShadow: isHovered ? '0 0 10px var(--primary-glow)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── LINE CHART ──
interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  title?: string;
  color?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = '#00B9AD',
  height = 180
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  if (data.length === 0) return null;

  const width = 500;
  const paddingX = 40;
  const paddingY = 20;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = 0;
  const valRange = maxVal - minVal;

  // Chart coordinates mapping
  const points = data.map((item, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((item.value - minVal) / valRange) * (height - 2 * paddingY);
    return { x, y, ...item };
  });

  // SVG Path generator
  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Gradient area path generator
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="p-5 bg-white dark:bg-slate-900/30 rounded-2xl border border-color shadow-sm space-y-4">
      {title && <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{title}</h4>}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const y = paddingY + p * (height - 2 * paddingY);
            const valLabel = Math.round(maxVal - p * valRange);
            return (
              <g key={i} className="opacity-20 dark:opacity-10">
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" />
                <text x={10} y={y + 4} className="fill-current text-[10px] font-bold">{valLabel}</text>
              </g>
            );
          })}

          {/* Area under curve */}
          {areaD && <path d={areaD} fill="url(#lineGrad)" />}

          {/* Main line path */}
          {pathD && <path d={pathD} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}

          {/* Data Points / Circles */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 4.5}
                  fill={isHovered ? '#fff' : color}
                  stroke={color}
                  strokeWidth={2.5}
                  style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                <text
                  x={pt.x}
                  y={height - 4}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px] font-bold"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip Popup */}
        {hoveredIdx !== null && (
          <div
            className="absolute bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-lg shadow-xl text-[10px] font-bold pointer-events-none -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100 - 4}%`,
            }}
          >
            <div>Periode: {points[hoveredIdx].label}</div>
            <div className="text-[12px] font-black text-teal-400 dark:text-teal-600">
              {points[hoveredIdx].value} Lulus
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
