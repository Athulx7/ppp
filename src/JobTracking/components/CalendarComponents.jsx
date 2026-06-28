import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Calendar, Clock, Coffee, GitBranch, X } from 'lucide-react';
import {
    HOURS, HOUR_HEIGHT, MIN_BLOCK_HEIGHT, WEEK_DAYS_SHORT,
    WEEK_DAYS_FULL, MONTH_NAMES, formatHour, formatDuration,
    getDensityBg, getDensityLabel, getColorClasses, buildDayBlocks, toDateStr,
} from './calendarUtils';

// ─── Current-time red line ──────────────────────────────────────────────────

export function CurrentTimeIndicator() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(t);
    }, []);
    const top = (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT;
    return (
        <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top }}>
            <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 -ml-1 shadow" />
                <div className="flex-1 h-px bg-red-400" />
            </div>
        </div>
    );
}

// ─── Single time block in the grid ─────────────────────────────────────────

export function JobBlock({ block, onClick }) {
    const { col, totalCols } = block;
    const top = block.startHour * HOUR_HEIGHT;
    const height = Math.max((block.endHour - block.startHour) * HOUR_HEIGHT, MIN_BLOCK_HEIGHT);
    const durationMins = block.duration_minutes || Math.round((block.endHour - block.startHour) * 60);

    const leftPct = `${(col / totalCols) * 100}%`;
    const widthPct = `${(1 / totalCols) * 100 - 0.5}%`;

    const cfg = getColorClasses(block.status_color);

    return (
        <div
            onClick={() => onClick && onClick(block)}
            className={`absolute rounded-md px-1.5 py-1 overflow-hidden cursor-pointer
                        shadow-sm border border-white/30 hover:brightness-110 hover:shadow-md
                        transition-all ${cfg.blockBg} ${cfg.blockText}`}
            style={{ top, height, left: leftPct, width: widthPct }}
            title={`${block.title} — ${durationMins}m`}
        >
            {block.isRunning && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            )}
            <p className="truncate text-[11px] font-semibold leading-tight">{block.title}</p>
            {height >= 32 && (
                <p className="text-[10px] opacity-80 truncate font-mono">{block.job_code}</p>
            )}
            {height >= 46 && durationMins > 0 && (
                <p className="text-[10px] opacity-75 flex items-center gap-0.5 mt-0.5">
                    <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                    {formatDuration(durationMins)}
                </p>
            )}
        </div>
    );
}

// ─── One vertical column in the time grid (one day) ────────────────────────

export function TimeGridColumn({ dateStr, allBlocks, lunchBlock, isToday, onBlockClick }) {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const blocks = useMemo(() => buildDayBlocks(allBlocks, dateStr), [allBlocks, dateStr]);

    return (
        <div ref={containerRef} className="relative flex-1 border-r border-gray-100 last:border-r-0">
            {/* Hour lines */}
            {HOURS.map((h) => (
                <div key={h} className="border-b border-gray-100" style={{ height: HOUR_HEIGHT }} />
            ))}

            {/* Lunch shading */}
            {lunchBlock && (
                <div
                    className="absolute left-0.5 right-0.5 bg-amber-50 border border-amber-200 rounded-md opacity-80 z-10"
                    style={{
                        top: lunchBlock.startHour * HOUR_HEIGHT,
                        height: (lunchBlock.endHour - lunchBlock.startHour) * HOUR_HEIGHT,
                    }}
                >
                    <div className="px-1 py-0.5 text-[10px] text-amber-600 font-medium flex items-center gap-0.5">
                        <Coffee className="w-2.5 h-2.5" /> Lunch
                    </div>
                </div>
            )}

            {isToday && <CurrentTimeIndicator />}

            {blocks.map((b, i) => (
                <JobBlock
                    key={`${b.time_log_id}-${i}`}
                    block={b}
                    containerWidth={width}
                    onClick={onBlockClick}
                />
            ))}
        </div>
    );
}

// ─── Left-side hour label column ────────────────────────────────────────────

export function HourLabels() {
    return (
        <div className="w-14 flex-shrink-0 bg-gray-50 border-r border-gray-200">
            {HOURS.map((h) => (
                <div
                    key={h}
                    className="flex items-start justify-end pr-2 text-[10px] text-gray-400 border-b border-gray-100"
                    style={{ height: HOUR_HEIGHT }}
                >
                    <span className="mt-0.5">{formatHour(h)}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Month grid ─────────────────────────────────────────────────────────────

export function MonthGrid({
    year, month, todayStr, selectedDay, onSelectDay,
    jobsByDate, lunchEnabled,
}) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    return (
        <>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {WEEK_DAYS_SHORT.map((d) => (
                    <div key={d} className="py-2.5 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
                {/* Leading empty cells */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e${i}`} className="border-b border-r border-gray-100 bg-gray-50" style={{ height: 96 }} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayJobs = jobsByDate[dateStr] || [];
                    const count = dayJobs.length;
                    const isToday = dateStr === todayStr;
                    const isSelected = selectedDay === day;

                    return (
                        <div
                            key={day}
                            onClick={() => onSelectDay(isSelected ? null : day)}
                            style={{ height: 96 }}
                            className={`relative border-b border-r border-gray-100 p-1.5 flex flex-col cursor-pointer transition-all
                                ${isSelected ? 'ring-2 ring-inset ring-indigo-500 z-10' : ''}
                                ${count > 0 ? getDensityBg(count) : 'hover:bg-gray-50'}
                            `}
                        >
                            {/* Day number */}
                            <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0
                                ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                                {day}
                            </span>

                            {/* Job title previews (up to 2) */}
                            {dayJobs.slice(0, 2).map((j, idx) => {
                                const cfg = getColorClasses(j.status_color);
                                return (
                                    <div key={idx} className={`mt-0.5 truncate text-[10px] font-medium px-1 rounded ${cfg.bg} ${cfg.text}`}>
                                        {j.title}
                                    </div>
                                );
                            })}

                            {/* Overflow dots */}
                            {count > 2 && (
                                <div className="mt-auto flex items-center gap-0.5 flex-wrap">
                                    {dayJobs.slice(2, 6).map((j, idx) => {
                                        const cfg = getColorClasses(j.status_color);
                                        return <span key={idx} className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ring-1 ring-white`} />;
                                    })}
                                    {count > 6 && <span className="text-[9px] font-bold text-gray-400">+{count - 6}</span>}
                                </div>
                            )}

                            {lunchEnabled && count > 0 && (
                                <span className="absolute top-0.5 right-0.5 text-[9px]">☕</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

// ─── Week view ───────────────────────────────────────────────────────────────

export function WeekView({ weekDays, todayStr, allBlocks, lunchBlock, onBlockClick, onDayClick, gridRef }) {
    return (
        <div className="relative">
            {/* Day headers */}
            <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                <div className="w-14 flex-shrink-0 border-r border-gray-200" />
                {weekDays.map((date, i) => {
                    const ds = toDateStr(date);
                    const isToday = ds === todayStr;
                    return (
                        <div
                            key={i}
                            onClick={() => onDayClick(date)}
                            className={`flex-1 py-2 text-center text-xs font-semibold cursor-pointer transition-colors hover:bg-indigo-50
                                ${isToday ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600'}`}
                        >
                            <div className="uppercase tracking-wide text-[10px]">{WEEK_DAYS_SHORT[date.getDay()]}</div>
                            <div className={`text-base font-bold mt-0.5 w-7 h-7 mx-auto flex items-center justify-center rounded-full
                                ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-800'}`}>
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scrollable grid */}
            <div ref={gridRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 360px)', minHeight: 320 }}>
                <div className="flex">
                    <HourLabels />
                    {weekDays.map((date, i) => (
                        <TimeGridColumn
                            key={i}
                            dateStr={toDateStr(date)}
                            allBlocks={allBlocks}
                            lunchBlock={lunchBlock}
                            isToday={toDateStr(date) === todayStr}
                            onBlockClick={onBlockClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Day view ────────────────────────────────────────────────────────────────

export function DayView({ date, todayStr, allBlocks, lunchBlock, onBlockClick, gridRef, jobsByDate }) {
    const ds = toDateStr(date);
    const count = (jobsByDate[ds] || []).length;
    return (
        <div className="relative">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{WEEK_DAYS_FULL[date.getDay()]}</p>
                <p className={`text-2xl font-bold mt-0.5 ${ds === todayStr ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {MONTH_NAMES[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
                </p>
                {count > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{count} job{count !== 1 ? 's' : ''} tracked</p>
                )}
            </div>
            <div ref={gridRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 360px)', minHeight: 320 }}>
                <div className="flex">
                    <HourLabels />
                    <TimeGridColumn
                        dateStr={ds}
                        allBlocks={allBlocks}
                        lunchBlock={lunchBlock}
                        isToday={ds === todayStr}
                        onBlockClick={onBlockClick}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Job detail slide-in panel (week/day view) ──────────────────────────────

export function JobDetailPanel({ block, onClose }) {
    if (!block) return null;
    const cfg = getColorClasses(block.status_color);
    const pCfg = getColorClasses(block.priority_color);

    return (
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col rounded-r-xl overflow-hidden">
            <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        {block.job_code}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-1 leading-tight">{block.title}</h3>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 flex-shrink-0 ml-2">
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Status + Priority */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                        {block.status_name}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium">
                        <span className={`w-2 h-2 rounded-full ${pCfg.dot}`} />
                        {block.priority_name}
                    </span>
                    {block.isRunning && (
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-200 animate-pulse">
                            Running
                        </span>
                    )}
                </div>

                {/* Time session info */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[10px] text-gray-400 mb-0.5">Session start</p>
                        <p className="text-xs font-semibold text-gray-700">
                            {block.start_time ? new Date(block.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[10px] text-gray-400 mb-0.5">Session end</p>
                        <p className="text-xs font-semibold text-gray-700">
                            {block.end_time ? new Date(block.end_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Running…'}
                        </p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-2.5 col-span-2">
                        <p className="text-[10px] text-indigo-400 mb-0.5">Session duration</p>
                        <p className="text-sm font-bold text-indigo-600">
                            {formatDuration(block.duration_minutes)}
                        </p>
                    </div>
                </div>

                {/* Job type */}
                {block.type_name && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">{block.type_name}</span>
                        {block.parent_job_id && (
                            <span className="flex items-center gap-1 text-purple-500">
                                <GitBranch className="w-3 h-3" /> Sub-job
                            </span>
                        )}
                    </div>
                )}

                {/* Due date */}
                {block.due_date && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Due: {new Date(block.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                )}

                {/* Remarks */}
                {block.remarks && (
                    <div>
                        <p className="text-[10px] text-gray-400 mb-1">Remarks</p>
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg italic">"{block.remarks}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Sidebar: day detail panel (month view selected day) ────────────────────

export function DayDetailPanel({ selectedDay, selectedDateStr, year, month, jobsByDate, onClose, onJobClick, lunchBreak }) {
    const dayJobs = jobsByDate[selectedDateStr] || [];
    const density = getDensityLabel(dayJobs.length);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{MONTH_NAMES[month - 1]} {year}</p>
                    <h3 className="text-base font-bold text-gray-900">Day {selectedDay}</h3>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200">
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {dayJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Calendar className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">No activity on this day</p>
                </div>
            ) : (
                <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">{dayJobs.length} job{dayJobs.length !== 1 ? 's' : ''}</span>
                        {density && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${density.bg} ${density.text}`}>
                                {density.label} density
                            </span>
                        )}
                    </div>
                    {dayJobs.map((job, idx) => {
                        const cfg = getColorClasses(job.status_color);
                        const pCfg = getColorClasses(job.priority_color);
                        return (
                            <div key={idx}
                                className="p-3 rounded-lg border border-gray-200 hover:border-indigo-200 cursor-pointer transition-all"
                                onClick={() => onJobClick(job)}>
                                <div className="flex items-start gap-2">
                                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${pCfg.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                            <span className="font-mono text-[11px] font-bold text-indigo-600">{job.job_code}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                                                {job.status_name}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                                        {job.total_minutes_on_day > 0 && (
                                            <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />{formatDuration(job.total_minutes_on_day)} today
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {lunchBreak?.is_enabled && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 mt-1">
                            <Coffee className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span className="text-xs text-amber-700">
                                Lunch: {lunchBreak.start_time?.slice(0, 5)} – {lunchBreak.end_time?.slice(0, 5)}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Sidebar: monthly summary stats ─────────────────────────────────────────

export function MonthlySummary({ month, year, summary, jobsByDate, allJobs }) {
    const activeDays = Object.keys(jobsByDate).filter((d) =>
        d.startsWith(`${year}-${String(month).padStart(2, '0')}`)
    ).length;

    const countByStatus = (code) =>
        allJobs.filter((j) => j.status_code === code).length;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">{MONTH_NAMES[month - 1]} Summary</h4>
            <div className="space-y-2">
                {[
                    { label: 'Active Days', value: summary?.active_days ?? activeDays, color: 'text-indigo-600' },
                    { label: 'Total Jobs', value: summary?.total_jobs ?? allJobs.length, color: 'text-gray-800' },
                    { label: 'Time Logged', value: formatDuration(summary?.total_minutes), color: 'text-green-600' },
                ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{s.label}</span>
                        <span className={`font-bold ${s.color}`}>{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Calendar toolbar (nav + view switcher) ──────────────────────────────────

export function CalendarToolbar({ headerLabel, onPrev, onNext, onToday, view, onViewChange }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
                <button onClick={onToday}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Today
                </button>
                <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                    <button onClick={onPrev} className="p-1.5 hover:bg-gray-100 border-r border-gray-300 rounded-l-lg transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold min-w-[190px] text-center text-gray-800">
                        {headerLabel}
                    </span>
                    <button onClick={onNext} className="p-1.5 hover:bg-gray-100 border-l border-gray-300 rounded-r-lg transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                {['month', 'week', 'day'].map((v) => (
                    <button key={v} onClick={() => onViewChange(v)}
                        className={`px-4 py-1.5 text-xs font-medium capitalize transition-colors
                            ${view === v ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                        {v}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Legend bar ─────────────────────────────────────────────────────────────

export function CalendarLegend() {
    return (
        <div className="flex flex-wrap items-center gap-4 mt-3 px-1">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-gray-500 font-semibold">Density:</span>
                {[
                    { label: 'None', bg: 'bg-gray-200' },
                    { label: '1–2', bg: 'bg-green-200' },
                    { label: '3–5', bg: 'bg-amber-200' },
                    { label: '6+', bg: 'bg-red-200' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${item.bg}`} />
                        <span className="text-[11px] text-gray-500">{item.label}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <div className="w-5 h-px bg-red-400 relative">
                    <div className="absolute -left-0.5 -top-[3px] w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>
                Now
            </div>
        </div>
    );
}