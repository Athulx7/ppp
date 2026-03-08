import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Tag, Clock, CheckCircle2, ArrowRight, AlertCircle, CircleDot, Coffee, X } from 'lucide-react';

const STATUS_CONFIG = {
    idle:         { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Idle',        dot: 'bg-gray-400'   },
    running:      { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running',     dot: 'bg-indigo-500' },
    completed:    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Completed',   dot: 'bg-green-500'  },
    'in-progress':{ bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'In Progress', dot: 'bg-blue-500'   },
    refer:        { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Refer',       dot: 'bg-purple-500' },
};

const PRIORITY_CONFIG = {
    Low: { dot: 'bg-green-500' },
    Medium: { dot: 'bg-amber-500' },
    High: { dot: 'bg-orange-500' },
    Critical: { dot: 'bg-red-500' },
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDuration(secs) {
    if (!secs) return '0s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// Heatmap density → color
function getDensityColor(count) {
    if (count === 0) return 'bg-gray-100 hover:bg-gray-200';
    if (count <= 2) return 'bg-green-200 hover:bg-green-300 text-green-900';
    if (count <= 5) return 'bg-amber-300 hover:bg-amber-400 text-amber-900';
    return 'bg-red-400 hover:bg-red-500 text-red-900';
}

function getDensityLabel(count) {
    if (count === 0) return null;
    if (count <= 2) return { label: 'Low', bg: 'bg-green-100', text: 'text-green-700' };
    if (count <= 5) return { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-700' };
    return { label: 'High', bg: 'bg-red-100', text: 'text-red-700' };
}

function JobCalendar({ jobs, lunchBreak }) {
    const [calDate, setCalDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    // Build a map: "YYYY-MM-DD" → [jobs that ran on that day]
    const jobsByDate = useMemo(() => {
        const map = {};
        jobs.forEach(job => {
            const dates = new Set();
            // From run log
            (job.runLog || []).forEach(log => {
                const d = log.start?.slice(0, 10);
                if (d) dates.add(d);
            });
            // If currently running
            if (job.status === 'running' && job.startedAt) {
                dates.add(new Date(job.startedAt).toISOString().slice(0, 10));
            }
            // Created date (initial run tracking)
            if (job.stoppedAt) {
                dates.add(job.stoppedAt.slice(0, 10));
            }
            dates.forEach(d => {
                if (!map[d]) map[d] = [];
                map[d].push(job);
            });
        });
        return map;
    }, [jobs]);

    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date().toISOString().slice(0, 10);

    const selectedDateStr = selectedDay
        ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        : null;
    const selectedJobs = selectedDateStr ? (jobsByDate[selectedDateStr] || []) : [];

    const prevMonth = () => setCalDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCalDate(new Date(year, month + 1, 1));

    // Check if a day had lunch break (simple heuristic: if lunch is enabled)
    const hasLunch = (dateStr) => lunchBreak?.enabled;

    return (
        <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Job Calendar
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Visual overview of your job activity by day</p>
                </div>
                {/* Month nav */}
                <div className="flex items-center gap-3">
                    <button onClick={prevMonth} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-semibold text-gray-800 min-w-[150px] text-center text-base">
                        {MONTH_NAMES[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex gap-4 flex-col lg:flex-row">
                {/* Calendar Grid */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                            {WEEK_DAYS.map(d => (
                                <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Day Cells */}
                        <div className="grid grid-cols-7">
                            {/* Empty prefix cells */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-16 sm:h-20 border-b border-r border-gray-100 bg-gray-50" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayJobs = jobsByDate[dateStr] || [];
                                const count = dayJobs.length;
                                const isToday = dateStr === today;
                                const isSelected = selectedDay === day;
                                const densityClass = getDensityColor(count);

                                return (
                                    <div
                                        key={day}
                                        onClick={() => setSelectedDay(isSelected ? null : day)}
                                        className={`h-16 sm:h-20 border-b border-r border-gray-100 p-1.5 flex flex-col cursor-pointer transition-all relative
                                            ${isSelected ? 'ring-2 ring-indigo-500 ring-inset' : ''}
                                            ${count > 0 ? densityClass : 'hover:bg-gray-50'}
                                        `}
                                    >
                                        {/* Day number */}
                                        <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0
                                            ${isToday ? 'bg-indigo-600 text-white' : count > 0 ? '' : 'text-gray-700'}
                                        `}>
                                            {day}
                                        </span>

                                        {/* Per-job status color dots */}
                                        {count > 0 && (
                                            <div className="mt-auto flex flex-wrap gap-0.5 items-center">
                                                {dayJobs.slice(0, 4).map((j, idx) => (
                                                    <span
                                                        key={idx}
                                                        title={`${j.id}: ${STATUS_CONFIG[j.status]?.label || j.status}`}
                                                        className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${STATUS_CONFIG[j.status]?.dot || 'bg-gray-400'} ring-1 ring-white`}
                                                    />
                                                ))}
                                                {count > 4 && (
                                                    <span className="text-[9px] font-bold leading-none opacity-80">+{count - 4}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Lunch icon */}
                                        {hasLunch(dateStr) && count > 0 && (
                                            <span className="absolute top-0.5 right-0.5 text-[9px]" title="Lunch break">☕</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 px-1">
                        {/* Density legend */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-gray-500 font-semibold">Density:</span>
                            {[
                                { label: 'None',         bg: 'bg-gray-200'   },
                                { label: 'Low (1–2)',    bg: 'bg-green-300'  },
                                { label: 'Medium (3–5)', bg: 'bg-amber-300'  },
                                { label: 'High (6+)',    bg: 'bg-red-400'    },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-1">
                                    <div className={`w-3.5 h-3.5 rounded ${item.bg}`} />
                                    <span className="text-xs text-gray-600">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="w-px h-4 bg-gray-300" />

                        {/* Status dot legend */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-gray-500 font-semibold">Job Status:</span>
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                <div key={key} className="flex items-center gap-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ring-1 ring-white`} />
                                    <span className="text-xs text-gray-600">{cfg.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                <span className="text-[9px] text-white font-bold">T</span>
                            </div>
                            <span className="text-xs text-gray-600">Today</span>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="lg:w-72 xl:w-80">
                    {selectedDay && selectedDateStr ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">{MONTH_NAMES[month]} {year}</p>
                                    <h3 className="text-base font-bold text-gray-900">Day {selectedDay}</h3>
                                </div>
                                <button onClick={() => setSelectedDay(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {selectedJobs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                    <Calendar className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">No jobs on this day</p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-2">
                                    {/* Density badge */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">{selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} tracked</span>
                                        {(() => {
                                            const d = getDensityLabel(selectedJobs.length);
                                            return d ? (
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d.bg} ${d.text}`}>
                                                    {d.label} Density
                                                </span>
                                            ) : null;
                                        })()}
                                    </div>

                                    {selectedJobs.map(job => {
                                        const sCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.idle;
                                        const pDot = PRIORITY_CONFIG[job.priority]?.dot || 'bg-gray-400';
                                        return (
                                            <div key={job.id} className="p-3 rounded-lg border border-gray-200 hover:border-indigo-200 transition-all">
                                                <div className="flex items-start gap-2">
                                                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${pDot}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                            <span className="font-mono text-xs font-bold text-indigo-600">{job.id}</span>
                                                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${sCfg.bg} ${sCfg.text}`}>
                                                                {sCfg.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                                                        {job.elapsedSecs > 0 && (
                                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {formatDuration(job.elapsedSecs)}
                                                            </p>
                                                        )}
                                                        {job.subJobs?.length > 0 && (
                                                            <p className="text-xs text-indigo-500 mt-0.5">
                                                                {job.subJobs.length} sub-job{job.subJobs.length > 1 ? 's' : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Lunch break info */}
                                    {lunchBreak?.enabled && (
                                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                                            <Coffee className="w-3.5 h-3.5 text-amber-600" />
                                            <span className="text-xs text-amber-700">
                                                Lunch break: {lunchBreak.start} – {lunchBreak.end}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-16 text-gray-400">
                            <Calendar className="w-10 h-10 mb-3 opacity-30" />
                            <p className="text-sm font-medium">Select a day</p>
                            <p className="text-xs mt-1 text-center px-4">Click any day on the calendar to see the jobs run on that day</p>
                        </div>
                    )}

                    {/* Monthly Summary */}
                    <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">
                            {MONTH_NAMES[month]} Summary
                        </h4>
                        <div className="space-y-2">
                            {[
                                { label: 'Active Days', value: Object.keys(jobsByDate).filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length, color: 'text-indigo-600' },
                                { label: 'Total Jobs Run', value: jobs.length, color: 'text-gray-800' },
                                { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: 'text-green-600' },
                                { label: 'In Progress', value: jobs.filter(j => j.status === 'in-progress').length, color: 'text-blue-600' },
                                { label: 'Referred', value: jobs.filter(j => j.status === 'refer').length, color: 'text-purple-600' },
                            ].map(s => (
                                <div key={s.label} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{s.label}</span>
                                    <span className={`font-bold ${s.color}`}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobCalendar;
